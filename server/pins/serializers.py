from rest_framework import serializers

from .models import Pin


class PinSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pin
        fields = ["id", "title", "images", "x_coordinate", "y_coordinate", "board"]
        read_only_fields = ["id", "created", "updated"]
        depth = 1


class PinListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pin
        fields = ["id", "title", "images", "x_coordinate", "y_coordinate", "board"]
