import datetime

from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Todo

User = get_user_model()


class TodoCRUDTests(APITestCase):
    """Test full CRUD lifecycle for the Todo API."""

    list_url = reverse("todo-list")

    def setUp(self):
        self.user = User.objects.create_user(
            username="alice", email="alice@example.com", password="strongpass1"
        )
        self.client.force_authenticate(user=self.user)

    def detail_url(self, pk):
        return reverse("todo-detail", kwargs={"pk": pk})

    # -- CREATE --
    def test_create_todo_minimal(self):
        resp = self.client.post(self.list_url, {"title": "Buy milk"})
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertEqual(resp.data["title"], "Buy milk")
        self.assertFalse(resp.data["is_completed"])
        self.assertEqual(resp.data["priority"], "medium")

    def test_create_todo_full(self):
        data = {
            "title": "Finish report",
            "description": "Q3 quarterly report",
            "priority": "high",
            "due_date": "2026-12-31",
        }
        resp = self.client.post(self.list_url, data)
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertEqual(resp.data["priority"], "high")
        self.assertEqual(resp.data["due_date"], "2026-12-31")

    def test_create_todo_missing_title(self):
        resp = self.client.post(self.list_url, {"description": "no title"})
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    # -- LIST --
    def test_list_own_todos(self):
        Todo.objects.create(owner=self.user, title="Todo 1")
        Todo.objects.create(owner=self.user, title="Todo 2")
        resp = self.client.get(self.list_url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(len(resp.data), 2)

    # -- RETRIEVE --
    def test_retrieve_todo(self):
        todo = Todo.objects.create(owner=self.user, title="My Todo")
        resp = self.client.get(self.detail_url(todo.pk))
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data["title"], "My Todo")

    # -- UPDATE (PUT) --
    def test_update_todo(self):
        todo = Todo.objects.create(owner=self.user, title="Old Title")
        resp = self.client.put(
            self.detail_url(todo.pk),
            {"title": "New Title", "is_completed": True},
        )
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data["title"], "New Title")
        self.assertTrue(resp.data["is_completed"])

    # -- PARTIAL UPDATE (PATCH) --
    def test_patch_todo(self):
        todo = Todo.objects.create(owner=self.user, title="Original")
        resp = self.client.patch(
            self.detail_url(todo.pk), {"is_completed": True}
        )
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertTrue(resp.data["is_completed"])
        self.assertEqual(resp.data["title"], "Original")  # unchanged

    # -- DELETE --
    def test_delete_todo(self):
        todo = Todo.objects.create(owner=self.user, title="Delete me")
        resp = self.client.delete(self.detail_url(todo.pk))
        self.assertEqual(resp.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Todo.objects.filter(pk=todo.pk).exists())


class TodoPermissionTests(APITestCase):
    """Ensure users cannot access other users' todos."""

    list_url = reverse("todo-list")

    def setUp(self):
        self.alice = User.objects.create_user(
            username="alice", email="alice@example.com", password="strongpass1"
        )
        self.bob = User.objects.create_user(
            username="bob", email="bob@example.com", password="strongpass1"
        )
        self.alice_todo = Todo.objects.create(
            owner=self.alice, title="Alice's task"
        )

    def detail_url(self, pk):
        return reverse("todo-detail", kwargs={"pk": pk})

    def test_other_user_cannot_list(self):
        """Bob should not see Alice's todos."""
        self.client.force_authenticate(user=self.bob)
        resp = self.client.get(self.list_url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(len(resp.data), 0)

    def test_other_user_cannot_retrieve(self):
        self.client.force_authenticate(user=self.bob)
        resp = self.client.get(self.detail_url(self.alice_todo.pk))
        self.assertEqual(resp.status_code, status.HTTP_404_NOT_FOUND)

    def test_other_user_cannot_update(self):
        self.client.force_authenticate(user=self.bob)
        resp = self.client.patch(
            self.detail_url(self.alice_todo.pk), {"title": "hacked"}
        )
        self.assertEqual(resp.status_code, status.HTTP_404_NOT_FOUND)

    def test_other_user_cannot_delete(self):
        self.client.force_authenticate(user=self.bob)
        resp = self.client.delete(self.detail_url(self.alice_todo.pk))
        self.assertEqual(resp.status_code, status.HTTP_404_NOT_FOUND)

    def test_unauthenticated_denied(self):
        resp = self.client.get(self.list_url)
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)


class TodoModelTests(APITestCase):
    """Basic model-level tests."""

    def test_str_returns_title(self):
        user = User.objects.create_user(
            username="u", email="u@example.com", password="strongpass1"
        )
        todo = Todo.objects.create(owner=user, title="Test str")
        self.assertEqual(str(todo), "Test str")

    def test_default_ordering(self):
        user = User.objects.create_user(
            username="u", email="u@example.com", password="strongpass1"
        )
        t1 = Todo.objects.create(owner=user, title="First")
        t2 = Todo.objects.create(owner=user, title="Second")
        todos = list(Todo.objects.all())
        self.assertEqual(todos[0], t2)  # newest first
        self.assertEqual(todos[1], t1)
