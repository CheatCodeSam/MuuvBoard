from rest_framework import serializers

from .models import Pin


class PinSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pin
        fields = ["id", "title", "image", "x_coordinate", "y_coordinate", "board"]
        read_only_fields = ["id", "created", "updated"]


class PinListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pin
        fields = ["id", "title", "image", "x_coordinate", "y_coordinate", "board"]


class PinBoardListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pin
        fields = ["id", "title", "image", "x_coordinate", "y_coordinate"]
