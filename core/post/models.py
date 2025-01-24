from django.db import models

from core.abstract.models import AbstractManager, AbstractModel
from core.user.models import User


class PostManager(AbstractManager):
    pass

# Create your models here.
class Post(AbstractModel):
    author = models.ForeignKey(User, related_name="posts", on_delete=models.CASCADE)
    body = models.TextField()
    edited = models.BooleanField(default=False)

    objects = PostManager()

    def __str__(self):
        return f"{self.author.name}"


