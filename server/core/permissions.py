from rest_framework import permissions

from boards.models import Board


class IsAuthor(permissions.BasePermission):
    message = "This model can only be modified by its author."

    def has_object_permission(self, request, view, obj):
        return obj.author == request.user
