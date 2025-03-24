import os
import sys
import django
import json
import networkx as nx

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'gutenberg_search.settings')
django.setup()

from search.models import Book, Centrality
with open('jaccard_graph.json', 'r') as f:
    jaccard = json.load(f)

G = nx.Graph()

for id_str, n in jaccard.items():
    book_id = int(id_str)
    for neighbor in n:
        neighbor_id, weight = neighbor
        G.add_edge(book_id, neighbor_id, weight=weight)

pagerank = nx.pagerank(G, weight='weight')
closeness = nx.closeness_centrality(G)
betweenness = nx.betweenness_centrality(G, weight='weight')
Centrality.objects.all().delete()
entries = []
for book_id in pagerank:
    book = Book.objects.get(id=book_id)
    entries.append(
        Centrality(
            book=book,
            pagerank=pagerank[book_id],
            closeness=closeness[book_id],
            betweenness=betweenness[book_id]
        )
    )

Centrality.objects.bulk_create(entries)
print("finiiiiiiiiii")
