from rest_framework import permissions


class IsAuthor(permissions.BasePermission):
    message = "You can only modify this object if you are the Author."

    def has_object_permission(self, request, view, obj):
        return obj.author == request.user
