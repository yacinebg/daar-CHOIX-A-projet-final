import os
import sys
import django
import requests
import re

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'gutenberg_search.settings')
django.setup()

from search.models import Book

BOOKS_DIR = "Books"
if not os.path.exists(BOOKS_DIR):
    os.makedirs(BOOKS_DIR)

API_URL = "https://gutendex.com/books/"

def count_words(text):
    return len(re.findall(r'\b\w+\b', text))

def fetch_books(limit=1664):
    downloaded = 0
    next_url = API_URL

    while next_url and downloaded < limit:
        response = requests.get(next_url)
        data = response.json()
        next_url = data.get("next")

        for book in data["results"]:
            try:
                gutenberg_id = book["id"]
                title = book.get("title", "Titre inconnu")
                author = book["authors"][0]["name"] if book["authors"] else "Auteur inconnu"
                language = book["languages"][0] if book["languages"] else "unknown"

                if language != "en":
                    continue

                if Book.objects.filter(gutenberg_id=gutenberg_id).exists():
                    continue

                text_url = book["formats"].get("text/plain; charset=us-ascii") or book["formats"].get("text/plain")
                if not text_url:
                    continue

                text_response = requests.get(text_url, timeout=15)
                text_response.raise_for_status()
                text_content = text_response.text

                word_count = count_words(text_content)
                if word_count < 10000:
                    continue

                file_name = f"{gutenberg_id}.txt"
                file_path = os.path.join(BOOKS_DIR, file_name)
                with open(file_path, "w", encoding="utf-8") as f:
                    f.write(text_content)

                Book.objects.create(
                    gutenberg_id=gutenberg_id,
                    title=title,
                    author=author,
                    file_path=file_name
                )

                downloaded += 1
                print(f"Livre {downloaded}/{limit} ajouté : {title} ({word_count} mots)")

                if downloaded >= limit:
                    return

            except requests.exceptions.RequestException as e:
                print(f"Erreur {title} : {e}")
                continue
            except Exception as e:
                print(f"Erreur pour le livre{gutenberg_id}: {e}")
                continue

if __name__ == "__main__":
    fetch_books(limit=1664)
