from rest_framework import serializers

from .models import Genre, Movie, Person


class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ['id', 'name']


class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = ['id', 'name']


class MovieListSerializer(serializers.ModelSerializer):
    genres = GenreSerializer(many=True, read_only=True)

    class Meta:
        model = Movie
        fields = [
            'id', 'title', 'year', 'imdb_rating', 'poster_url', 'genres',
        ]


class MovieDetailSerializer(serializers.ModelSerializer):
    genres = GenreSerializer(many=True, read_only=True)
    directors = PersonSerializer(many=True, read_only=True)
    actors = PersonSerializer(many=True, read_only=True)

    class Meta:
        model = Movie
        fields = [
            'id', 'title', 'year', 'certificate', 'runtime', 'overview',
            'imdb_rating', 'meta_score', 'votes', 'gross', 'poster_url',
            'directors', 'actors', 'genres',
        ]
