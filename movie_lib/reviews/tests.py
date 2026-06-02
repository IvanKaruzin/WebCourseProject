from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase

from movies.models import Movie


class ReviewTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='Passw0rd!23')
        self.token = Token.objects.create(user=self.user)
        self.movie = Movie.objects.create(title='Test Movie', year=2020, imdb_rating=7.5)

    def test_create_review_authenticated(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
        data = {'movie': self.movie.id, 'rating': 8, 'text': 'Great film!'}
        response = self.client.post('/api/reviews/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['rating'], 8)
        self.assertEqual(response.data['text'], 'Great film!')
        self.assertEqual(response.data['user'], 'testuser')

    def test_create_review_unauthenticated(self):
        data = {'movie': self.movie.id, 'rating': 8, 'text': 'Great film!'}
        response = self.client.post('/api/reviews/', data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_review_rating_too_high(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
        response = self.client.post('/api/reviews/', {'movie': self.movie.id, 'rating': 11})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_review_rating_too_low(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
        response = self.client.post('/api/reviews/', {'movie': self.movie.id, 'rating': 0})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_review_without_text(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
        response = self.client.post('/api/reviews/', {'movie': self.movie.id, 'rating': 7})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_get_reviews_list(self):
        response = self.client.get('/api/reviews/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)

    def test_delete_own_review(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
        res = self.client.post('/api/reviews/', {'movie': self.movie.id, 'rating': 8, 'text': 'Good'})
        review_id = res.data['id']
        response = self.client.delete(f'/api/reviews/{review_id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
