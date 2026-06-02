from django.db import models


class Genre(models.Model):
    name = models.CharField(max_length=100, unique=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class Person(models.Model):
    name = models.CharField(max_length=255, unique=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class Movie(models.Model):
    title = models.CharField(max_length=255)
    year = models.IntegerField(null=True, blank=True)
    certificate = models.CharField(max_length=20, blank=True)
    runtime = models.IntegerField(null=True, blank=True)
    overview = models.TextField(blank=True)
    imdb_rating = models.FloatField(null=True, blank=True)
    meta_score = models.IntegerField(null=True, blank=True)
    votes = models.IntegerField(null=True, blank=True)
    gross = models.BigIntegerField(null=True, blank=True)
    poster_url = models.URLField(max_length=500, blank=True)

    directors = models.ManyToManyField(Person, related_name='directed_movies', blank=True)
    actors = models.ManyToManyField(Person, related_name='acted_movies', blank=True)
    genres = models.ManyToManyField(Genre, related_name='movies', blank=True)

    class Meta:
        ordering = ['-imdb_rating']
        constraints = [
            models.UniqueConstraint(fields=['title', 'year'], name='unique_movie_title_year'),
        ]

    def __str__(self):
        return f'{self.title} ({self.year})'
