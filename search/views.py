from django.http import JsonResponse, Http404
from .models import Book, IndexTable, Centrality
import re
from django.db.models import Q
import os 
from django.shortcuts import get_object_or_404
import json

def search_books(request):
    query = request.GET.get('q', '').strip()
    if not query:
        return JsonResponse({"resultats": []})
    keywords = query.lower().split()
    title_author_q = Q()
    for word in keywords:
        title_author_q &= (Q(title__icontains=word) | Q(author__icontains=word))

    title_author_results = Book.objects.filter(title_author_q)
    if title_author_results.exists():
        return JsonResponse({
            "resultats": [
                {
                    "id": b.gutenberg_id,
                    "title": b.title,
                    "author": b.author,
                    "cover_url": b.cover_url,
                }
                for b in title_author_results
            ]
        })
    book_sets = []
    for word in keywords:
        ids = IndexTable.objects.filter(token=word).values_list('book_id', flat=True)
        book_sets.append(set(ids))
    common_books_ids = set.intersection(*book_sets) if book_sets else set()
    if common_books_ids:
        index_results = Book.objects.filter(id__in=common_books_ids)
    else:
        union_ids = set().union(*book_sets)
        index_results = Book.objects.filter(id__in=union_ids)
    return JsonResponse({
        "resultats": [
            {
                "id": b.gutenberg_id,
                "title": b.title,
                "author": b.author,
                "cover_url": b.cover_url,
            }
            for b in index_results
        ]
    })

def search_regex(request):
    regex_query = request.GET.get("q", "").strip()
    if not regex_query:
        return JsonResponse({"resultats": []})

    try:
        pattern = re.compile(regex_query, re.IGNORECASE)
    except re.error as e:
        return JsonResponse({"error": f"Regex pas bon chef : {e}"})

    matching_indexes = IndexTable.objects.all()
    matching_keywords = [index for index in matching_indexes if pattern.search(index.token)]

    book_ids_from_keywords = set()
    for index in matching_keywords:
        book_ids_from_keywords.add(index.book.id)

    books = Book.objects.all()
    matching_books_title_author = [
        book for book in books
        if pattern.search(book.title) or pattern.search(book.author)
    ]
    final_books = Book.objects.filter(
        Q(id__in=book_ids_from_keywords) |
        Q(id__in=[b.id for b in matching_books_title_author])
    ).distinct()
    results = [
        {
            "id": book.gutenberg_id,
            "title": book.title,
            "author": book.author,
            "cover_url": book.cover_url,
            "file_path": book.file_path
        }
        for book in final_books
    ]
    return JsonResponse({
        "regex": regex_query,
        "resultats": results
    })

def search_books_centrality(request):
    query = request.GET.get("q", "").strip().lower()
    critere = request.GET.get("metric", "").lower()

    if not query or critere not in ["closeness", "pagerank", "betweenness"]:
        return JsonResponse({"error": "Requête invalide"})
    
    books_by_title = list(Book.objects.filter(title__icontains=query))
    books_by_author = list(Book.objects.filter(author__icontains=query))
    index_matches = IndexTable.objects.filter(token__icontains=query)
    books_by_content = list(Book.objects.filter(id__in=index_matches.values_list('book_id', flat=True)))
    seen_ids = set()
    ordered_books = []

    def add_books(books):
        for book in books:
            if book.id not in seen_ids:
                ordered_books.append(book)
                seen_ids.add(book.id)

    add_books(books_by_title)
    add_books(books_by_author)
    add_books(books_by_content)

    centralities = Centrality.objects.filter(book_id__in=[book.id for book in ordered_books])
    centrality_map = {c.book_id: getattr(c, critere) for c in centralities}

    ordered_books.sort(key=lambda b: centrality_map.get(b.id, 0), reverse=True)

    results = [
        {
            "id": book.gutenberg_id,
            "title": book.title,
            "author": book.author,
            "cover_url": book.cover_url,
            "file_path": book.file_path,
            "centrality_score": centrality_map.get(book.id, 0)
        }
        for book in ordered_books
    ]

    return JsonResponse({
        "recherche": query,
        "metric": critere,
        "resultats": results
    })


def read_book(request, book_id):
    book = get_object_or_404(Book, gutenberg_id=book_id)
    
    file_path = os.path.join("./search/Books", f"{book.gutenberg_id}.txt")
    if not os.path.exists(file_path):
        raise Http404(f"fichier {book.gutenberg_id}.txt manquant dans le dossier Books")
    print(file_path)
    with open(file_path, 'r', encoding="utf-8", errors="ignore") as f:
        content = f.read()
    return JsonResponse({
        "title": book.title,
        "author": book.author,
        "content": content
    })


def suggest_books(req, book_gutenberg_id):
    with open(os.path.join(os.path.dirname(__file__), 'jaccard_graph.json'), 'r') as f:
        jaccard_graph = json.load(f)

    book_id = Book.objects.get(gutenberg_id=book_gutenberg_id).id
    suggestions = []
    neighbors = jaccard_graph.get(str(book_id), [])
    neighbors = sorted(neighbors, key=lambda x: x[1], reverse=True)[:10]
    for neighbor in neighbors:
        neighbor_id = neighbor[0]
        score = neighbor[1]
        try:
            book = Book.objects.get(id=neighbor_id)
            suggestions.append({
                "id": book.id,
                "title": book.title,
                "author": book.author,
                "cover_url": book.cover_url,
                "score": score
            })
        except Book.DoesNotExist:
            continue
    return JsonResponse({"suggestions": suggestions})