from django.contrib import admin
from .models import Genre, Movie, Person


@admin.register(Genre)
class GenreAdmin(admin.ModelAdmin):
    list_display = ['id', 'name']
    search_fields = ['name']


@admin.register(Person)
class PersonAdmin(admin.ModelAdmin):
    list_display = ['id', 'name']
    search_fields = ['name']


@admin.register(Movie)
class MovieAdmin(admin.ModelAdmin):
    list_display  = ['id', 'title', 'year', 'imdb_rating']
    list_filter   = ['genres', 'year']
    search_fields = ['title']
    filter_horizontal = ['genres', 'directors', 'actors']  # удобный выбор M2M