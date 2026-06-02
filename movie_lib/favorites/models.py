from django.conf import settings
from django.db import models


class Favorite(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='favorites')
    movie = models.ForeignKey('movies.Movie', on_delete=models.CASCADE, related_name='favorited_by')
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-added_at']
        constraints = [
            models.UniqueConstraint(fields=['user', 'movie'], name='unique_user_movie_favorite'),
        ]

    def __str__(self):
        return f'{self.user} - {self.movie}'
