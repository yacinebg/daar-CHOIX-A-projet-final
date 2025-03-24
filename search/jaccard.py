import os
import sys
import django
import json
from collections import defaultdict
from itertools import combinations

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'gutenberg_search.settings')
django.setup()

from search.models import IndexTable

def build(threshold=0.1):
    book_tokens = defaultdict(set)
    all_indexes = IndexTable.objects.all()
    for index in all_indexes:
        book_tokens[index.book_id].add(index.token)
    graph = defaultdict(list)
    books_ids = list(book_tokens.keys())

    for i, j in combinations(books_ids, 2):
        tokens_i = book_tokens[i]
        tokens_j = book_tokens[j]
        intersection = tokens_i.intersection(tokens_j)
        union = tokens_i.union(tokens_j)
        
        if not union:
            continue
        
        score = len(intersection) / len(union)
        if score >= threshold:
            graph[i].append((j, score))
            graph[j].append((i, score))
    return graph

def save_graph(graph, filename="jaccard_graph.json"):
    graph_serializable = {str(k): [(int(neigh), float(weight)) for neigh, weight in v] for k, v in graph.items()}
    with open(filename, "w") as f:
        json.dump(graph_serializable, f)

if __name__ == "__main__":
    graphe_jaccard = build(threshold=0.1)
    save_graph(graphe_jaccard)
