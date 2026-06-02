from rest_framework import status
from rest_framework.test import APITestCase

from .models import Genre, Movie, Person


class MovieListTest(APITestCase):
    def setUp(self):
        genre = Genre.objects.create(name='Drama')
        director = Person.objects.create(name='Frank Darabont')
        actor = Person.objects.create(name='Tim Robbins')
        self.movie = Movie.objects.create(
            title='The Shawshank Redemption',
            year=1994,
            imdb_rating=9.3,
            overview='Two imprisoned men bond over a number of years.',
        )
        self.movie.genres.add(genre)
        self.movie.directors.add(director)
        self.movie.actors.add(actor)

    def test_get_movies_list(self):
        response = self.client.get('/api/movies/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)
        self.assertIn('count', response.data)
        self.assertGreater(response.data['count'], 0)

    def test_movies_list_contains_expected_fields(self):
        response = self.client.get('/api/movies/')
        movie = response.data['results'][0]
        self.assertIn('id', movie)
        self.assertIn('title', movie)
        self.assertIn('year', movie)
        self.assertIn('imdb_rating', movie)
        self.assertIn('genres', movie)

    def test_filter_by_genre_name(self):
        response = self.client.get('/api/movies/?genre=Drama')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(response.data['count'], 0)

    def test_filter_by_nonexistent_genre(self):
        response = self.client.get('/api/movies/?genre=Nonexistent')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 0)

    def test_search_by_title(self):
        response = self.client.get('/api/movies/search/?title=Shawshank')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(response.data['count'], 0)

    def test_search_case_insensitive(self):
        response = self.client.get('/api/movies/search/?title=shawshank')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(response.data['count'], 0)

    def test_search_no_results(self):
        response = self.client.get('/api/movies/search/?title=xyznonexistent')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 0)

    def test_ordering_by_rating(self):
        Movie.objects.create(title='Low Rated', year=2000, imdb_rating=5.0)
        response = self.client.get('/api/movies/?ordering=-imdb_rating')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        ratings = [m['imdb_rating'] for m in response.data['results'] if m['imdb_rating'] is not None]
        self.assertEqual(ratings, sorted(ratings, reverse=True))


class MovieDetailTest(APITestCase):
    def setUp(self):
        genre = Genre.objects.create(name='Crime')
        director = Person.objects.create(name='Christopher Nolan')
        self.movie = Movie.objects.create(
            title='The Dark Knight',
            year=2008,
            imdb_rating=9.0,
        )
        self.movie.genres.add(genre)
        self.movie.directors.add(director)

    def test_get_movie_detail(self):
        response = self.client.get(f'/api/movies/{self.movie.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'The Dark Knight')
        self.assertEqual(response.data['year'], 2008)

    def test_movie_detail_contains_relations(self):
        response = self.client.get(f'/api/movies/{self.movie.id}/')
        self.assertIn('directors', response.data)
        self.assertIn('actors', response.data)
        self.assertIn('genres', response.data)
        self.assertEqual(len(response.data['directors']), 1)
        self.assertEqual(response.data['directors'][0]['name'], 'Christopher Nolan')

    def test_get_nonexistent_movie(self):
        response = self.client.get('/api/movies/99999/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_movie_reviews(self):
        response = self.client.get(f'/api/movies/{self.movie.id}/reviews/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)
