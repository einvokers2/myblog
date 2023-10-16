from rest_framework import viewsets

from .models import Comment
from article.models import Article
from .permissions import IsOwnerOrReader
from .serializers import CommentSeriallizer
from django.shortcuts import get_object_or_404


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSeriallizer
    permission_classes = [IsOwnerOrReader]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


