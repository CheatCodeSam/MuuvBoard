from rest_framework import permissions

from boards.models import Board


class IsAuthor(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.author == request.user

    def has_permission(self, request, view):
        if request.method == "POST":
            board_id = request.POST.get("board")
            if not Board.objects.filter(id=board_id, author=request.user).exists():
                return False
        return True
