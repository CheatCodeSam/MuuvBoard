from functools import partial
from os import stat

from django.http import Http404
from rest_framework import generics, status
from rest_framework.decorators import parser_classes
from rest_framework.parsers import FileUploadParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from core.permissions import IsAuthor
from pins.models import Pin
from pins.serializers import PinSerializer

from .models import Board
from .serializers import BoardListSerializer, BoardSerializer


class BoardList(generics.ListCreateAPIView):

    serializer_class = BoardListSerializer
    # * "has_object_permission" is only applied to Detail, Update, and Delete
    permission_classes = (IsAuthor, IsAuthenticated)

    def get_queryset(self):
        user = self.request.user
        return Board.objects.filter(author=user)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class BoardDetail(generics.RetrieveUpdateAPIView):

    queryset = Board.objects.all()
    serializer_class = BoardSerializer
    permission_classes = (IsAuthor, IsAuthenticated)
