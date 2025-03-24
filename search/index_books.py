import os
import sys
import django
import re
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from collections import defaultdict, Counter

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'gutenberg_search.settings')
django.setup()
from search.models import Book, IndexTable

nltk.download('stopwords', quiet=True)
nltk.download('wordnet', quiet=True)
nltk.download('omw-1.4', quiet=True)

STOPWORDS = set(stopwords.words('english'))
lemmatizer = WordNetLemmatizer()

BOOKS_DIR = "Books"
token_to_books = defaultdict(lambda: defaultdict(int))

def preprocess_text(text):
    words_list = re.findall(r"\b[a-zA-Z]{4,20}\b", text)
    processed_words = []
    for word in words_list:
        word_lower = word.lower()
        if word_lower in STOPWORDS:
            continue
        if word_lower in ['www', 'org']:
            continue
        lemma = lemmatizer.lemmatize(word_lower)
        processed_words.append(lemma)
    return Counter(processed_words)

def preprocess_file(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        text = f.read()
    return preprocess_text(text)

books = list(Book.objects.all())

for index, book in enumerate(books, 1):
    file_path = os.path.join(BOOKS_DIR, f"{book.gutenberg_id}.txt")
    print(f"[{index}/{len(books)}] livre {book.id} : {book.title}")
    if not os.path.exists(file_path):
        continue
    words_count = preprocess_file(file_path)
    if not words_count:
        continue
    for token, count in words_count.items():
        token_to_books[token][book.id] += count

IndexTable.objects.all().delete()

filtered_token_to_books = {
    token: book_dict
    for token, book_dict in token_to_books.items()
    if sum(book_dict.values()) >= 30
}

entries = []
for index, (token, books_dict) in enumerate(filtered_token_to_books.items(), 1):
    if index % 200 == 0:
        print(f" - {index}/{len(filtered_token_to_books)} tokens")

    for book_id, occurrences in books_dict.items():
        if occurrences >= 30:
            entries.append(IndexTable(token=token, book=Book.objects.get(id=book_id), occurrences=occurrences))

IndexTable.objects.bulk_create(entries, batch_size=1000)
print("finiii")
