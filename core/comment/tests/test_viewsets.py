import pytest
from rest_framework import status

from core.fixtures.user import user
from core.fixtures.post import post
from core.fixtures.comment import comment


class TestCommentViewSet:

    endpoint = "/api/posts/{}/comments/{}"

    def test_list(self, client, user, post, comment):
        client.force_authenticate(user)
        response = client.get(self.endpoint.format(post.public_id.hex, ""))
        assert response.status_code == status.HTTP_200_OK
        assert response.data["count"] == 1

    def test_retrieve(self, client, user, post, comment):
        client.force_authenticate(user)
        response = client.get(self.endpoint.format(post.public_id.hex, comment.public_id.hex + "/"))
        assert response.status_code == status.HTTP_200_OK
        assert response.data["id"] == comment.public_id.hex
        assert response.data["post"] == comment.post.public_id
        assert response.data["author"]["id"] == comment.author.public_id.hex
        assert response.data["body"] == comment.body

    def test_create(self, client, user, post):
        client.force_authenticate(user)
        data = {
            'author': user.public_id.hex,
            'body': 'test comment body',
            'post': post.public_id.hex,
        }
        response = client.post(self.endpoint.format(post.public_id.hex, ""), data)
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['author']['id'] == user.public_id.hex
        assert response.data['post'] == post.public_id
        assert response.data['body'] == data['body']

    def test_update(self, client, user, post, comment):
        client.force_authenticate(user)
        new_data = {
            'author': user.public_id.hex,
            'body': 'test comment body UPDATED',
            'post': post.public_id.hex,
        }
        response = client.put(self.endpoint.format(post.public_id.hex, comment.public_id.hex + "/"), new_data)
        assert response.status_code == status.HTTP_200_OK
        assert response.data["body"] == new_data['body']

    def test_delete(self, client, user, post, comment):
        client.force_authenticate(user)
        response = client.delete(self.endpoint.format(post.public_id.hex, comment.public_id.hex + "/"))
        assert response.status_code == status.HTTP_204_NO_CONTENT

    def test_list_anonymous(self, client, user, post, comment):
        response = client.get(self.endpoint.format(post.public_id.hex, ""))
        assert response.status_code == status.HTTP_200_OK
        assert response.data["count"] == 1

    def test_retrieve_anonymous(self, client, user, post, comment):
        response = client.get(self.endpoint.format(post.public_id.hex, comment.public_id.hex + "/"))
        assert response.status_code == status.HTTP_200_OK

    def test_update_anonymous(self, client, user, post, comment):
        new_data = {}
        response = client.put(self.endpoint.format(post.public_id.hex, comment.public_id.hex + "/"), new_data)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_delete_anonymous(self, client, user, post, comment):
        response = client.delete(self.endpoint.format(post.public_id.hex, comment.public_id.hex + "/"))
        assert response.status_code == status.HTTP_401_UNAUTHORIZED