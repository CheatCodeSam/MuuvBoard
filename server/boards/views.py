from functools import partial
from os import stat

from django.http import Http404
from rest_framework import status
from rest_framework.decorators import parser_classes
from rest_framework.parsers import FileUploadParser
from rest_framework.response import Response
from rest_framework.views import APIView

from pins.models import Pin

from .models import Board
from .serializers import BoardListSerializer, BoardSerializer, PinSerializer


class BoardList(APIView):
    def get(self, request, format=None):
        boards = Board.objects.all()
        serializer = BoardListSerializer(boards, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = BoardSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BoardDetail(APIView):
    def get_object(self, pk):
        try:
            return Board.objects.get(pk=pk)
        except Board.DoesNotExist:
            return Http404

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

    # TODO Move to Pin App
    @parser_classes([FileUploadParser])
    def post(self, request, pk, format=None):
        board = self.get_object(pk)
        serializer = PinSerializer(data=request.data)
        if serializer.is_valid():
            serializer.board = board
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # TODO Move to Pin App
    def patch(self, request, pk, format=None):
        modified_pins = request.data["pins"]
        for pin in modified_pins:
            if pin["action"] == "move":
                pin_to_be_modified = Pin.objects.get(pk=pin["id"])
                pin_to_be_modified.x_coordinate = pin["movement"]["x"]
                pin_to_be_modified.y_coordinate = pin["movement"]["y"]
                pin_to_be_modified.save()
            elif pin["action"] == "delete":
                pin_to_be_deleted = Pin.objects.get(pk=pin["id"])
                pin_to_be_deleted.delete()
            else:
                return Response(status=status.HTTP_400_BAD_REQUEST)

        return Response(status=status.HTTP_200_OK)
