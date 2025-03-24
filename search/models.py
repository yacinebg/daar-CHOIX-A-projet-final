from django.db import models

class Book(models.Model):
    id = models.AutoField(primary_key=True)
    gutenberg_id = models.IntegerField(unique=True)
    title = models.CharField(max_length=255, blank=True, null=True)
    author = models.CharField(max_length=255, blank=True, null=True)
    file_path = models.CharField(max_length=500, blank=True, null=True)
    cover_url = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.title} - {self.author}"

    class Meta:
        db_table = "books_db"


class IndexTable(models.Model):
    token = models.CharField(max_length=100)  
    book = models.ForeignKey(Book, on_delete=models.CASCADE)  
    occurrences = models.IntegerField(default=1)

    def __str__(self):
        return f"{self.token} ({self.occurrences}x in {self.book.title})"

    class Meta:
        db_table = "index_table"
        unique_together = ("token", "book")


class Centrality(models.Model):
    book = models.OneToOneField(Book, on_delete=models.CASCADE)
    pagerank = models.FloatField()
    closeness = models.FloatField()
    betweenness = models.FloatField()
