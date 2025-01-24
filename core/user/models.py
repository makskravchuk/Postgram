import uuid

from django.core.exceptions import ObjectDoesNotExist
from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager, PermissionsMixin
from django.http import Http404

from core.abstract.models import AbstractManager, AbstractModel



def user_directory_path(instance, filename):
    return 'user_{0}/{1}'.format(instance.public_id, filename)

class UserManager(BaseUserManager, AbstractManager):

    def create_user(self, username, email, password, **kwargs):
        """
        Create and return a `User` with an email, phone number, username and password.
        """
        if username is None:
            raise TypeError("Users must have a username.")
        if email is None:
            raise TypeError("Users must have an email.")
        if password is None:
            raise TypeError("User must have a password.")

        user = self.model(username=username, email=self.normalize_email(email), **kwargs)
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, username, email, password, **kwargs):
        """
        Create and return a `User` with superuser (admin) permissions.
        """
        if password is None:
            raise TypeError("Superusers must have a password.")
        if email is None:
            raise TypeError("Superusers must have an email.")
        if username is None:
            raise TypeError("Superusers must have an username.")

        user = self.create_user(username, email, password, **kwargs)
        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)

        return user




class User(AbstractModel, AbstractUser, PermissionsMixin):
    username = models.CharField(max_length=255, unique=True, db_index=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    bio = models.TextField(null=True, blank=True)
    avatar = models.ImageField(upload_to=user_directory_path, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    posts_liked = models.ManyToManyField("core_post.Post", related_name="liked_by")
    comments_liked = models.ManyToManyField("core_comment.Comment", related_name="liked_by")

    USERNAME_FIELD = 'username'
    EMAIL_FIELD = 'email'
    REQUIRED_FIELDS = ["email"]

    objects = UserManager()

    def __str__(self):
        return self.username

    def like_post(self, post):
        self.posts_liked.add(post)

    def remove_like_post(self,post):
        self.posts_liked.remove(post)

    def has_liked_post(self, post):
        return  self.posts_liked.filter(pk=post.pk).exists()

    def like_comment(self, comment):
        self.comments_liked.add(comment)

    def remove_like_comment(self, comment):
        self.comments_liked.remove(comment)

    def has_liked_comment(self, comment):
        return self.comments_liked.filter(pk=comment.pk).exists()

    @property
    def name(self):
        return f"{self.first_name} {self.last_name}"