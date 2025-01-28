from urllib.parse import urljoin

from rest_framework import serializers

from CoreRoot import settings
from core.abstract.serializers import AbstractSerializer
from core.user.models import User


class UserSerializer(AbstractSerializer):
    posts_count = serializers.SerializerMethodField()

    def get_posts_count(self, obj):
        return obj.posts.count()

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name',
        'last_name', 'bio', 'avatar', 'email', 'name', 'posts_count',
       'is_active', 'created', 'updated']
        read_only_fields = ['is_active']


    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if not representation['avatar']:
            representation['avatar'] = settings.DEFAULT_AVATAR_URL.format(instance.name)
        else:
            request = self.context.get("request")
            representation["avatar"] = request.build_absolute_uri(
                representation["avatar"]
            )
        return representation