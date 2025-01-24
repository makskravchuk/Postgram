import pytest

from rest_framework import status
from core.fixtures.user import user
from core.fixtures.post import post

class TestPostViewSet:

    endpoint = "/api/posts/"

    def test_list(self, client, user, post):
        client.force_authenticate(user)
        response = client.get(self.endpoint)
        assert response.status_code == status.HTTP_200_OK
        assert response.data["count"] == 1

    def test_retrieve(self, client, user, post):
        client.force_authenticate(user)
        response = client.get(f"{self.endpoint}{post.public_id}/")
        assert response.status_code == status.HTTP_200_OK
        assert response.data["id"] == post.public_id.hex
        assert response.data["body"] == post.body
        assert response.data["author"]['id'] == post.author.public_id.hex

    def test_create(self, client, user):
        client.force_authenticate(user)
        data = {
            "author": user.public_id.hex,
            "body": "test post body",
        }
        response = client.post(self.endpoint, data=data)
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["body"] == "test post body"
        assert response.data["author"]['id'] == user.public_id.hex

    def test_update(self, client, user, post):
        client.force_authenticate(user)
        data = {
            "author": user.public_id.hex,
            "body": "test post body UPDATED",
        }
        response = client.put(f"{self.endpoint}{post.public_id}/", data=data)
        assert response.status_code == status.HTTP_200_OK
        assert response.data["body"] == "test post body UPDATED"
        assert response.data["author"]['id'] == post.author.public_id.hex

    def test_delete(self, client, user, post):
        client.force_authenticate(user)
        response = client.delete(f"{self.endpoint}{post.public_id}/")
        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert response.data is None

    def test_list_anonymous(self, client, post):
        response = client.get(self.endpoint)
        assert response.status_code == status.HTTP_200_OK
        assert response.data["count"] == 1

    def test_retrieve_anonymous(self,client, post):
        response = client.get(f"{self.endpoint}{post.public_id}/")
        assert response.status_code == status.HTTP_200_OK
        assert response.data["id"] == post.public_id.hex
        assert response.data["body"] == post.body
        assert response.data["author"]['id'] == post.author.public_id.hex

    def test_create_anonymous(self, client):
        data = {
            "body": "test post body",
            "author": "anonymous_user"
        }
        response = client.post(self.endpoint, data=data)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_delete_anonymous(self, client, post):
        response = client.delete(f"{self.endpoint}{post.public_id}/")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED