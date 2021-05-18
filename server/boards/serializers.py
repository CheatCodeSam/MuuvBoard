from rest_framework import serializers

from .models import Board, Pin


class BoardSerializer(serializers.ModelSerializer):
    num_of_pins = serializers.SerializerMethodField()

    class Meta:
        model = Board
        fields = ["id", "title", "num_of_pins"]

    def get_num_of_pins(self, obj):
        return obj.pins.count()


class BoardWithPinsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Board
        depth = 2
        fields = ["pins", "title", "id"]


class PinSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pin
        fields = ["title", "images", "x_coordinate", "x_coordinate", "tags"]
        read_only_fields = ["id", "board", "created", "updated"]
