from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase

from movies.models import Movie


class FavoriteTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='Passw0rd!23')
        self.token = Token.objects.create(user=self.user)
        self.movie = Movie.objects.create(title='Test Movie', year=2020, imdb_rating=7.5)

    def test_add_to_favorites_authenticated(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
        response = self.client.post('/api/favorites/', {'movie': self.movie.id})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['movie'], self.movie.id)
        self.assertIn('added_at', response.data)

    def test_add_to_favorites_unauthenticated(self):
        response = self.client.post('/api/favorites/', {'movie': self.movie.id})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_add_duplicate_favorite(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
        self.client.post('/api/favorites/', {'movie': self.movie.id})
        response = self.client.post('/api/favorites/', {'movie': self.movie.id})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_favorites_list(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
        self.client.post('/api/favorites/', {'movie': self.movie.id})
        response = self.client.get('/api/favorites/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)
        self.assertIn('movie_detail', response.data['results'][0])

    def test_favorites_isolated_per_user(self):
        other = User.objects.create_user(username='other', password='Passw0rd!23')
        other_token = Token.objects.create(user=other)
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
        self.client.post('/api/favorites/', {'movie': self.movie.id})
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {other_token.key}')
        response = self.client.get('/api/favorites/')
        self.assertEqual(response.data['count'], 0)

    def test_remove_from_favorites(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
        res = self.client.post('/api/favorites/', {'movie': self.movie.id})
        fav_id = res.data['id']
        response = self.client.delete(f'/api/favorites/{fav_id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        check = self.client.get('/api/favorites/')
        self.assertEqual(check.data['count'], 0)

    def test_add_nonexistent_movie(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
        response = self.client.post('/api/favorites/', {'movie': 99999})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
