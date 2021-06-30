from rest_framework import serializers

from .models import Image


class ImageDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ["image", "id"]
