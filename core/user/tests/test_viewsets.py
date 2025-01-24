import pytest
from rest_framework import status

from core.fixtures.user import user
from core.fixtures.post import post


class TestUserViewSet:

    endpoint = '/api/users/'

    def test_list(self, client, user):
        client.force_authenticate(user)
        response = client.get(self.endpoint)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['count'] == 1

    def test_retrieve(self, client, user):
        client.force_authenticate(user)
        response = client.get(f"{self.endpoint}{user.public_id.hex}/")
        assert response.status_code == status.HTTP_200_OK
        assert response.data['id'] == user.public_id.hex
        assert response.data['username'] == user.username
        assert response.data['email'] == user.email

    def test_create(self,client, user):
        client.force_authenticate(user)
        data = {}
        response = client.post(self.endpoint, data)
        assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED

    def test_update(self, client, user):
        client.force_authenticate(user)
        new_data = {
            'username': 'newusername',
        }
        response = client.patch(f"{self.endpoint}{user.public_id.hex}/", new_data)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['username'] == new_data['username']