from rest_framework import serializers

from files.serializers import ImageDetailSerializer

from .models import Pin


class PinSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pin
        fields = ["id", "title", "images", "x_coordinate", "y_coordinate", "board"]
        depth = 1


class PinCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pin
        fields = ["id", "title", "images", "x_coordinate", "y_coordinate", "board"]
        read_only_fields = ["id", "created", "updated"]


class PinListSerializer(serializers.ModelSerializer):
    images = ImageDetailSerializer(many=True)

    class Meta:
        model = Pin
        fields = ["id", "title", "images", "x_coordinate", "y_coordinate", "board"]
        read_only_fields = ["id", "created", "updated"]
