import pytest

from core.comment.models import Comment
from core.fixtures.post import post
from core.fixtures.user import user

@pytest.mark.django_db
def test_create_comment(post, user):
    comment = Comment(author=user, post=post, body='test comment body')
    assert comment.author == user
    assert comment.post == post
    assert comment.body == 'test comment body'