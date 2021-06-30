from functools import partial
from os import stat

from django.http import Http404
from rest_framework import status
from rest_framework.decorators import parser_classes
from rest_framework.parsers import FileUploadParser
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Pin
from .serializers import PinListSerializer, PinSerializer


class PinDetail(APIView):
    def get_object(self, pk):
        try:
            return Pin.objects.get(pk=pk)
        except Pin.DoesNotExist:
            return Http404

    def get(self, request, pk, format=None):
        pin = self.get_object(pk)
        serializer = PinSerializer(pin)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        pin = self.get_object(pk)
        serializer = PinSerializer(pin, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PinList(APIView):
    def post(self, request, format=None):
        serializer = PinListSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, format=None):
        actions = request.data["actions"]
        for action in actions:
            if action["op"] == "move":
                pin_to_be_modified = Pin.objects.get(pk=action["path"])
                pin_to_be_modified.x_coordinate = action["values"]["x"]
                pin_to_be_modified.y_coordinate = action["values"]["y"]
                pin_to_be_modified.save()
            elif action["op"] == "remove":
                pin_to_be_deleted = Pin.objects.get(pk=action["path"])
                pin_to_be_deleted.delete()
            else:
                return Response(status=status.HTTP_400_BAD_REQUEST)

        return Response(status=status.HTTP_200_OK)
