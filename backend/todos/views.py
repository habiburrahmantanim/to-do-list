from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Todo
from .permissions import IsOwner
from .serializers import TodoSerializer


class TodoViewSet(viewsets.ModelViewSet):
    """
    Full CRUD for the authenticated user's todos.

    list:   GET    /api/todos/
    create: POST   /api/todos/
    read:   GET    /api/todos/{id}/
    update: PUT    /api/todos/{id}/
    patch:  PATCH  /api/todos/{id}/
    delete: DELETE /api/todos/{id}/
    """

    serializer_class = TodoSerializer
    permission_classes = [IsAuthenticated, IsOwner]

    def get_queryset(self):
        return Todo.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
