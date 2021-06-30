from functools import partial
from os import stat

from django.http import Http404
from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import parser_classes
from rest_framework.parsers import FileUploadParser
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Image
from .serializers import ImageDetailSerializer


class ImageDetail(APIView):
    @parser_classes([FileUploadParser])
    def post(self, request, format=None):
        serializer = ImageDetailSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
