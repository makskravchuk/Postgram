from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.utils.representation import serializer_repr
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView

from core.auth.permissions import UserPermission
from core.auth.serializers import RegistrationSerializer, LoginSerializer
from core.user.models import User

# Create your views here.
class RegisterViewSet(viewsets.ViewSet):
    queryset = User.objects.all()
    http_method_names = ['post']
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegistrationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        res = {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }

        return Response({
            'user': serializer.data,
            "refresh": res['refresh'],
            "token": res['access']
        }, status=status.HTTP_201_CREATED)

class LoginViewSet(viewsets.ViewSet):
    serializer_class = LoginSerializer
    permission_classes = (AllowAny,)
    http_method_names = ['post']

    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])

        return Response(serializer.validated_data, status=status.HTTP_200_OK)

class LogoutViewSet(viewsets.ViewSet):
    permission_classes = (UserPermission,)
    http_method_names = ['post']

    def create(self, request, *args, **kwargs):
        refresh = request.data.get('refresh')
        if not refresh:
            raise ValidationError({'detail': 'A refresh token is required.'})

        try:
            token = RefreshToken(refresh)
            token.blacklist()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except TokenError:
            raise ValidationError({'detail': 'The refresh token is invalid.'})



class RefreshViewSet(viewsets.ViewSet, TokenRefreshView):
    permission_classes = (AllowAny,)
    http_method_names = ['post']

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])

        return Response(serializer.validated_data, status=status.HTTP_200_OK)

