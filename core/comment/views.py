from django.core.cache import cache
from django.http import Http404
from django.shortcuts import render
from django.views import View
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from core.abstract.views import AbstractViewSet
from core.auth.permissions import UserPermission
from core.comment.models import Comment
from core.comment.serializers import CommentSerializer


# Create your views here.
class CommentViewSet(AbstractViewSet):
    serializer_class = CommentSerializer
    permission_classes = (UserPermission,)
    http_method_names = ['get', 'post', 'put', 'delete']

    def get_queryset(self):
        if self.request.user.is_superuser:
            return Comment.objects.all()
        post_pk = self.kwargs.get('post_pk')
        if post_pk is None:
            raise Http404("Post does not exist.")
        return Comment.objects.filter(post__public_id=post_pk)

    def get_object(self):
        obj = Comment.objects.get_object_by_public_id(self.kwargs.get('pk'))

        self.check_object_permissions(self.request, obj)

        return obj

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(methods=['post'], detail=True)
    def like(self, request, *args, **kwargs):
        comment = self.get_object()
        user = self.request.user
        user.like_comment(comment)
        serializer = self.get_serializer(comment)
        return Response(status=status.HTTP_200_OK, data=serializer.data)

    @action(methods=['post'], detail=True)
    def remove_like(self, request, *args, **kwargs):
        comment = self.get_object()
        user = self.request.user
        user.remove_like_comment(comment)
        serializer = self.get_serializer(comment)
        return Response(status=status.HTTP_200_OK, data=serializer.data)


    def list(self, request, *args, **kwargs):
        comment_objects = cache.get("comment_objects")

        if comment_objects is None:
            comment_objects = self.filter_queryset(self.get_queryset())
            cache.set("comment_objects", comment_objects)

        page = self.paginate_queryset(comment_objects)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(comment_objects, many=True)
        return Response(serializer.data)
