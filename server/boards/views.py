import rest_framework
from rest_framework import serializers, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Board, Pin
from .serializers import BoardSerializer


class BoardList(APIView):
    def get(self, request, format=None):
        boards = Board.objects.all()
        serializer = BoardSerializer(boards, many=True)
        return Response(serializer.data)
