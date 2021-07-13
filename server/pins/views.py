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

from core.permissions import IsAuthor
from pins.permissions import IsOwnerOfObjBoard

from .models import Pin
from .serializers import PinCreateSerializer, PinListSerializer, PinSerializer


class PinDetail(generics.RetrieveAPIView):
    queryset = Pin.objects.all()
    serializer_class = PinSerializer
    permission_classes = (IsAuthor,)


class PinList(generics.GenericAPIView, mixins.CreateModelMixin):

    serializer_class = PinCreateSerializer
    permission_classes = (
        IsAuthor,
        IsOwnerOfObjBoard,
    )

    def perform_create(self, serializer):
        return serializer.save(author=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = self.perform_create(serializer)
        instance_serializer = PinSerializer(instance)
        return Response(instance_serializer.data, status=status.HTTP_201_CREATED)

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
        pins = Pin.objects.distinct().filter(
            Q(title__icontains=search) | Q(tags__name__icontains=search),
            board=board,
            author=request.user,
        )
        serializer = PinListSerializer(pins, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

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
