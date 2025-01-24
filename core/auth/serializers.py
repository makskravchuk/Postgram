from typing import Dict, Any

from django.contrib.auth.models import update_last_login
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.settings import api_settings

from core.user.models import User
from core.user.serializers import UserSerializer


class RegistrationSerializer(UserSerializer):
    """
    Registration serializer for requests and user creation.
    """
    password = serializers.CharField(max_length=128, write_only=True, min_length=8, required=True)

    class Meta:
        model = User
        fields = ['id', 'bio', 'avatar', 'email','username', 'first_name', 'last_name','password']

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

class LoginSerializer(TokenObtainPairSerializer):
    def validate(self, attrs: Dict[str, Any]) -> Dict[str, str]:
        data = super().validate(attrs)
        refresh = self.get_token(self.user)
        data['user'] = UserSerializer(self.user).data
        data['refresh'] =  str(refresh)
        data['access'] = str(refresh.access_token)

        if api_settings.UPDATE_LAST_LOGIN:
            update_last_login(None, self.user)

        return data
