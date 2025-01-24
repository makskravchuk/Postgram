from django.db import models

from core.abstract.models import AbstractManager, AbstractModel
from core.post.models import Post
from core.user.models import User


# Create your models here.
class CommentManager(AbstractManager):
    pass


class Comment(AbstractModel):
    author = models.ForeignKey(User, related_name="comments", on_delete=models.PROTECT)
    post = models.ForeignKey(Post, related_name="comments", on_delete=models.PROTECT)
    body = models.TextField()
    edited = models.BooleanField(default=False)

    objects = CommentManager()

    def __str__(self):
        return f"{self.author.name}: {self.body[:50]}{"..." if len(self.body) > 50 else ""}"