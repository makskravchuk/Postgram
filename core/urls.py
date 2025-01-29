from django.urls import path, include
from rest_framework_nested import routers

from core.comment.views import CommentViewSet
from core.post.views import PostViewSet
from core.user.views import UserViewSet
from core.auth.views import RegisterViewSet, LoginViewSet, RefreshViewSet, LogoutViewSet

router = routers.SimpleRouter()

router.register(r'users', UserViewSet, basename='user')
router.register(r'auth/register', RegisterViewSet, basename='auth-register')
router.register(r'auth/login', LoginViewSet, basename='auth-login')
router.register(r'auth/logout', LogoutViewSet, basename='auth-logout')
router.register(r'auth/refresh', RefreshViewSet, basename='auth-refresh')
router.register(r'posts', PostViewSet, basename='post')
posts_router = routers.NestedSimpleRouter(router, r'posts', lookup='post')
posts_router.register(r'comments', CommentViewSet, basename='comment')
urlpatterns = [
    path('', include(router.urls)),
    path('', include(posts_router.urls)),
]