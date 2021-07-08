from django.contrib.auth import get_user_model
from rest_framework import serializers
from taggit_serializer.serializers import TaggitSerializer, TagListSerializerField

from files.serializers import ImageDetailSerializer

from .models import Pin


class PinSerializer(TaggitSerializer, serializers.ModelSerializer):

    tags = TagListSerializerField()

    class Meta:
        model = Pin
        fields = [
            "id",
            "title",
            "images",
            "x_coordinate",
            "y_coordinate",
            "board",
            "tags",
        ]
        depth = 1


class PinCreateSerializer(TaggitSerializer, serializers.ModelSerializer):

    tags = TagListSerializerField(required=False)
    author = serializers.PrimaryKeyRelatedField(
        read_only=True,
    )

    class Meta:
        model = Pin
        fields = [
            "id",
            "title",
            "images",
            "x_coordinate",
            "y_coordinate",
            "board",
            "tags",
            "author",
        ]
        read_only_fields = ["id", "created", "updated"]


class PinListSerializer(TaggitSerializer, serializers.ModelSerializer):
    images = ImageDetailSerializer(many=True)
    tags = TagListSerializerField()

    class Meta:
        model = Pin
        fields = [
            "id",
            "title",
            "images",
            "x_coordinate",
            "y_coordinate",
            "board",
            "tags",
        ]
        read_only_fields = ["id", "created", "updated"]
