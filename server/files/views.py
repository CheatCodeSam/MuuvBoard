from rest_framework import generics
from rest_framework.parsers import MultiPartParser
from rest_framework.permissions import IsAuthenticated

from .serializers import ImageDetailSerializer


class ImageDetail(generics.CreateAPIView):

    serializer_class = ImageDetailSerializer
    permission_classes = (IsAuthenticated,)
    parser_classes = [MultiPartParser]
