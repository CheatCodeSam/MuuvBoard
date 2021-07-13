from rest_framework import permissions

from boards.models import Board


class IsOwnerOfObjBoard(permissions.BasePermission):
    message = "Pins can only be set to Boards owned by User."

    def has_permission(self, request, view):
        if request.method == "POST":
            board_id = request.data["board"]
            if not Board.objects.filter(id=board_id, author=request.user).exists():
                return False
        return True
