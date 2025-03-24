import os
import sys
import django
import requests
# juste un script pour mettre à jour les couvertures des livres, on avait oublié de les ajouter à la base de données
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'gutenberg_search.settings')
django.setup()
from search.models import Book

API_URL = "https://gutendex.com/books/"
def update_book_covers():
    for book in Book.objects.all():
        response = requests.get(f"{API_URL}?ids={book.gutenberg_id}")
        data = response.json()

        if data["results"]:
            cover_url = data["results"][0]["formats"].get("image/jpeg", None)
            if cover_url:
                book.cover_url = cover_url
                book.save()

if __name__ == "__main__":
    update_book_covers()
