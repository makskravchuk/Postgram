from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from core.abstract.serializers import AbstractSerializer
from core.post.models import Post
from core.user.models import User
from core.user.serializers import UserSerializer


class PostSerializer(AbstractSerializer):

    author = serializers.SlugRelatedField(queryset=User.objects.all(), slug_field='public_id')
    likes_count = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()
    liked = serializers.SerializerMethodField()

    def get_liked(self, instance):
        request = self.context.get('request', None)
        if request is None or request.user.is_anonymous:
            return False

        return request.user.has_liked_post(instance)

    def get_likes_count(self, instance):
        return instance.liked_by.count()

    def get_comments_count(self, instance):
        return instance.comments.count()

    def validate_author(self, value):
        if self.context['request'].user != value:
            raise ValidationError("You can't create a post for another user.")
        return value

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        user = User.objects.get_object_by_public_id(rep['author'])
        rep['author'] = UserSerializer(user).data

        return rep

    def update(self, instance, validated_data):
        if not instance.edited:
            validated_data["edited"] = True

        instance = super().update(instance, validated_data)

        return instance

    class Meta:
        model = Post
        fields = ['id', 'author', 'body', 'edited', 'created', 'updated', 'likes_count', 'liked', 'comments_count']

        read_only_fields = ['edited']
