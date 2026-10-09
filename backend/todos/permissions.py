from rest_framework import permissions


class IsOwner(permissions.BasePermission):
    """
    Object-level permission: only the owner of a todo may view / edit / delete it.
    """

    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user
