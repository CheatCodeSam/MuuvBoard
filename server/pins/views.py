from functools import partial
from os import stat

from django.db import transaction
from django.db.models import Q
from django.http import Http404
from rest_framework import filters, generics, mixins, serializers, status
from rest_framework.decorators import parser_classes
from rest_framework.parsers import FileUploadParser
from rest_framework.response import Response
from rest_framework.views import APIView

from pins.permissions import IsAuthor

from .models import Pin
from .serializers import PinCreateSerializer, PinListSerializer, PinSerializer


class PinDetail(generics.RetrieveAPIView):
    queryset = Pin.objects.all()
    serializer_class = PinSerializer
    permission_classes = (IsAuthor,)


class PinList(generics.GenericAPIView, mixins.CreateModelMixin):

    serializer_class = PinCreateSerializer
    permission_classes = (IsAuthor,)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def get(self, request, format=None):
        get_data = request.query_params
        if not request.user.is_authenticated:
            return Response(
                status=status.HTTP_403_FORBIDDEN,
            )
        if not "search" in get_data or not "board" in get_data:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        search = get_data["search"]
        board = get_data["board"]
        ## TODO test for duplicates
        pins = Pin.objects.distinct().filter(
            Q(title__icontains=search) | Q(tags__name__icontains=search),
            board=board,
            author=request.user,
        )
        serializer = PinListSerializer(pins, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # TODO make this less clunky, create image with PinCreateSerializer and return response with PinSerializer
    def post(self, request, *args, **kwargs):
        x = self.create(request, *args, **kwargs)
        if x.status_code == 201:
            pin = Pin.objects.get(pk=x.data["id"])
            serializer = PinSerializer(pin)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return x

    # If any of these fail, rollback the save opertaion.
    @transaction.atomic
    def patch(self, request, format=None):
        actions = request.data
        for action in actions:
            if action["op"] == "move":
                pin_to_be_modified = Pin.objects.get(pk=action["path"])
                self.check_object_permissions(request, pin_to_be_modified)
                pin_to_be_modified.x_coordinate = action["values"]["x"]
                pin_to_be_modified.y_coordinate = action["values"]["y"]
                pin_to_be_modified.save()
            elif action["op"] == "remove":
                pin_to_be_deleted = Pin.objects.get(pk=action["path"])
                self.check_object_permissions(request, pin_to_be_deleted)
                pin_to_be_deleted.delete()
            else:
                return Response(status=status.HTTP_400_BAD_REQUEST)

        return Response(status=status.HTTP_200_OK)
