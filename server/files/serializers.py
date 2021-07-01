from rest_framework import serializers

from .models import Image


class ImageDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ["image", "id", "width", "height"]
        read_only_fields = ["id", "width", "height"]
