from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from rest_framework.routers import DefaultRouter

from favorites.views import FavoriteViewSet
from movies.views import GenreViewSet, MovieViewSet
from reviews.views import ReviewViewSet
from users.views import LoginView, LogoutView, MeView, RegisterView

router = DefaultRouter()
router.register('movies', MovieViewSet, basename='movie')
router.register('genres', GenreViewSet, basename='genre')
router.register('reviews', ReviewViewSet, basename='review')
router.register('favorites', FavoriteViewSet, basename='favorite')

auth_patterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('me/', MeView.as_view(), name='me'),
]

urlpatterns = [
    path('auth/', include(auth_patterns)),
    path('', include(router.urls)),
    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    path('docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]
