from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase


class RegistrationTest(APITestCase):
    def test_register_success(self):
        data = {'username': 'testuser', 'email': 'test@test.com', 'password': 'Passw0rd!23'}
        response = self.client.post('/api/auth/register/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('token', response.data)
        self.assertIn('user', response.data)
        self.assertEqual(response.data['user']['username'], 'testuser')
        self.assertTrue(User.objects.filter(username='testuser').exists())

    def test_register_duplicate_username(self):
        User.objects.create_user(username='existing', password='Passw0rd!23')
        response = self.client.post('/api/auth/register/', {'username': 'existing', 'password': 'Passw0rd!23'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_short_password(self):
        response = self.client.post('/api/auth/register/', {'username': 'testuser', 'password': 'short'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_missing_username(self):
        response = self.client.post('/api/auth/register/', {'password': 'Passw0rd!23'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class LoginTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='Passw0rd!23')

    def test_login_success(self):
        response = self.client.post('/api/auth/login/', {'username': 'testuser', 'password': 'Passw0rd!23'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)
        self.assertIn('user', response.data)
        self.assertEqual(response.data['user']['username'], 'testuser')

    def test_login_wrong_password(self):
        response = self.client.post('/api/auth/login/', {'username': 'testuser', 'password': 'wrongpassword'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_nonexistent_user(self):
        response = self.client.post('/api/auth/login/', {'username': 'nobody', 'password': 'Passw0rd!23'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_logout_success(self):
        token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token.key}')
        response = self.client.post('/api/auth/logout/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Token.objects.filter(user=self.user).exists())

    def test_logout_unauthenticated(self):
        response = self.client.post('/api/auth/logout/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
