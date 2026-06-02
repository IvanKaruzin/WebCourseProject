from rest_framework import mixins, viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Favorite
from .serializers import FavoriteSerializer


class FavoriteViewSet(mixins.CreateModelMixin,
                      mixins.ListModelMixin,
                      mixins.DestroyModelMixin,
                      viewsets.GenericViewSet):
    serializer_class = FavoriteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user).select_related('movie')
