import pytest

from core.post.models import Post
from core.fixtures.user import user

@pytest.mark.django_db
def test_create_post(user):
    post = Post.objects.create(author=user, body="Test post body")
    assert post.author == user
    assert post.body == "Test post body"
