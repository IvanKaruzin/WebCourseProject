from rest_framework import viewsets
from rest_framework.decorators import action

from reviews.models import Review
from reviews.serializers import ReviewSerializer

from .models import Genre, Movie
from .serializers import GenreSerializer, MovieDetailSerializer, MovieListSerializer


class MovieViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Movie.objects.all()

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return MovieDetailSerializer
        return MovieListSerializer

    def get_queryset(self):
        qs = Movie.objects.prefetch_related('genres', 'directors', 'actors')

        genre = self.request.query_params.get('genre')
        if genre:
            if genre.isdigit():
                qs = qs.filter(genres__id=genre)
            else:
                qs = qs.filter(genres__name__iexact=genre)

        title = self.request.query_params.get('title') or self.request.query_params.get('search')
        if title:
            qs = qs.filter(title__icontains=title)

        ordering = self.request.query_params.get('ordering')
        allowed = {'imdb_rating', '-imdb_rating', 'year', '-year', 'title', '-title'}
        if ordering in allowed:
            qs = qs.order_by(ordering)

        return qs.distinct()

    @action(detail=False, methods=['get'])
    def search(self, request):
        title = request.query_params.get('title', '')
        qs = self.get_queryset().filter(title__icontains=title)
        page = self.paginate_queryset(qs)
        serializer = MovieListSerializer(page, many=True, context={'request': request})
        return self.get_paginated_response(serializer.data)

    @action(detail=True, methods=['get'])
    def reviews(self, request, pk=None):
        movie = self.get_object()
        qs = Review.objects.filter(movie=movie).select_related('user')
        page = self.paginate_queryset(qs)
        serializer = ReviewSerializer(page, many=True, context={'request': request})
        return self.get_paginated_response(serializer.data)


class GenreViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer
    pagination_class = None
