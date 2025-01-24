from django.shortcuts import render
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from core.abstract.views import AbstractViewSet
from core.auth.permissions import UserPermission
from core.post.models import Post
from core.post.serializers import PostSerializer


# Create your views here.
class PostViewSet(AbstractViewSet):
    http_method_names = ['get', 'post','put', 'delete']
    permission_classes = (UserPermission,)
    serializer_class = PostSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["author__public_id"]

    def get_queryset(self):
        return Post.objects.all()

    def get_object(self):
        obj = Post.objects.get_object_by_public_id(self.kwargs['pk'])

        self.check_object_permissions(self.request,obj)

        return obj

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


    @action(methods=['post'], detail=True)
    def like(self, request, *args, **kwargs):
        post = self.get_object()
        user = self.request.user
        user.like_post(post)
        serializer = self.serializer_class(post)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(methods=['post'], detail=True)
    def remove_like(self, request, *args, **kwargs):
        post = self.get_object()
        user = self.request.user
        user.remove_like_post(post)
        serializer = self.serializer_class(post)
        return Response(serializer.data, status=status.HTTP_200_OK)
