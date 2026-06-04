from django.contrib import admin
from .models import Favorite


@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display  = ['id', 'user', 'movie', 'added_at']
    search_fields = ['user__username', 'movie__title']
    readonly_fields = ['added_at']