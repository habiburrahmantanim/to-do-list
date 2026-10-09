from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


class RegisterTests(APITestCase):
    url = reverse("register")

    def test_register_success(self):
        data = {
            "username": "newuser",
            "email": "new@example.com",
            "password": "strongpass1",
            "password_confirm": "strongpass1",
            "first_name": "New",
            "last_name": "User",
        }
        resp = self.client.post(self.url, data)
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username="newuser").exists())

    def test_register_without_username(self):
        data = {
            "email": "autouser@example.com",
            "password": "strongpass1",
            "password_confirm": "strongpass1",
        }
        resp = self.client.post(self.url, data)
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(email="autouser@example.com").exists())

    def test_register_password_mismatch(self):
        data = {
            "username": "newuser",
            "email": "new@example.com",
            "password": "strongpass1",
            "password_confirm": "different1",
        }
        resp = self.client.post(self.url, data)
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_duplicate_email(self):
        User.objects.create_user(
            username="existing", email="dup@example.com", password="strongpass1"
        )
        data = {
            "username": "newuser",
            "email": "dup@example.com",
            "password": "strongpass1",
            "password_confirm": "strongpass1",
        }
        resp = self.client.post(self.url, data)
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)


class LoginTests(APITestCase):
    url = reverse("login")

    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", email="test@example.com", password="strongpass1"
        )

    def test_login_success(self):
        resp = self.client.post(
            self.url, {"username": "testuser", "password": "strongpass1"}
        )
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIn("access", resp.data)
        self.assertIn("refresh", resp.data)
        self.assertEqual(resp.data["user"]["username"], "testuser")

    def test_login_with_email(self):
        resp = self.client.post(
            self.url, {"email": "test@example.com", "password": "strongpass1"}
        )
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIn("access", resp.data)
        self.assertEqual(resp.data["user"]["username"], "testuser")

    def test_login_invalid_credentials(self):
        resp = self.client.post(
            self.url, {"username": "testuser", "password": "wrongpass"}
        )
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)


class TokenRefreshTests(APITestCase):
    url = reverse("token_refresh")

    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", email="test@example.com", password="strongpass1"
        )
        self.refresh = RefreshToken.for_user(self.user)

    def test_refresh_returns_new_access(self):
        resp = self.client.post(self.url, {"refresh": str(self.refresh)})
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIn("access", resp.data)

    def test_refresh_invalid_token(self):
        resp = self.client.post(self.url, {"refresh": "invalid-token"})
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)


class CurrentUserTests(APITestCase):
    url = reverse("current_user")

    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="strongpass1",
            first_name="Test",
            last_name="User",
        )
        self.client.force_authenticate(user=self.user)

    def test_get_current_user(self):
        resp = self.client.get(self.url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data["username"], "testuser")
        self.assertEqual(resp.data["email"], "test@example.com")

    def test_patch_current_user(self):
        resp = self.client.patch(self.url, {"first_name": "Updated"})
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data["first_name"], "Updated")

    def test_unauthenticated_denied(self):
        self.client.force_authenticate(user=None)
        resp = self.client.get(self.url)
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)


class GoogleAuthTests(APITestCase):
    url = reverse("google_auth")

    def test_google_auth_get_endpoint(self):
        resp = self.client.get(self.url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIn("message", resp.data)

    def test_google_auth_missing_token(self):
        resp = self.client.post(self.url, {})
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_google_auth_success_new_user(self):
        token = "mock-google-token:newoauth@example.com:OAuth:User"
        resp = self.client.post(self.url, {"id_token": token})
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIn("access", resp.data)
        self.assertIn("refresh", resp.data)
        self.assertEqual(resp.data["user"]["email"], "newoauth@example.com")
        self.assertEqual(resp.data["user"]["first_name"], "OAuth")
        self.assertTrue(User.objects.filter(email="newoauth@example.com").exists())

    def test_google_auth_success_existing_user(self):
        User.objects.create_user(
            username="existingoauth",
            email="existingoauth@example.com",
            password="strongpass1",
        )
        token = "mock-google-token:existingoauth@example.com:First:Last"
        resp = self.client.post(self.url, {"credential": token})
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIn("access", resp.data)
        self.assertEqual(resp.data["user"]["email"], "existingoauth@example.com")
