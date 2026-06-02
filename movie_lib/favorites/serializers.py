from rest_framework import serializers

from movies.serializers import MovieListSerializer

from .models import Favorite


class FavoriteSerializer(serializers.ModelSerializer):
    movie_detail = MovieListSerializer(source='movie', read_only=True)

    class Meta:
        model = Favorite
        fields = ['id', 'movie', 'movie_detail', 'added_at']
        read_only_fields = ['id', 'added_at']

    def validate(self, attrs):
        user = self.context['request'].user
        if Favorite.objects.filter(user=user, movie=attrs.get('movie')).exists():
            raise serializers.ValidationError('Этот фильм уже в избранном.')
        return attrs

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
