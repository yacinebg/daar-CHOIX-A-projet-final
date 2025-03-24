"""
URL configuration for gutenberg_search project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from search.views import (
    search_books, 
    search_regex, 
    search_books_centrality,
    read_book,
    suggest_books
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path("search/", search_books, name="search_books"),
    path('search_regex/', search_regex, name="search_regex"),
    path('search_by_centrality/', search_books_centrality, name="search_books_centrality"),
    path('read_book/<int:book_id>/', read_book, name="read_book"),
    path('suggestions/<int:book_gutenberg_id>/', suggest_books, name="suggest_books")
]

