from functools import partial
from os import stat

from django.http import Http404
from rest_framework import generics, status
from rest_framework.decorators import parser_classes
from rest_framework.parsers import FileUploadParser
from rest_framework.response import Response
from rest_framework.views import APIView

from pins.models import Pin
from pins.serializers import PinSerializer

from .models import Board
from .permissions import IsAuthor
from .serializers import BoardListSerializer, BoardSerializer


class BoardList(generics.ListCreateAPIView):

    serializer_class = BoardListSerializer
    permission_classes = (IsAuthor,)

    def get_queryset(self):
        user = self.request.user
        return Board.objects.filter(author=user)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class BoardDetail(APIView):
    def get_object(self, pk):
        try:
            return Board.objects.get(pk=pk)
        except Board.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        board = self.get_object(pk)
        serializer = BoardSerializer(board)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        board = self.get_object(pk)
        serializer = BoardSerializer(board, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
