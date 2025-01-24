import pytest

from core.comment.models import Comment
from core.fixtures.user import user
from core.fixtures.post import post

@pytest.fixture
def comment(db, user, post):
    return Comment.objects.create(author=user, post=post, body="Test comment body")
