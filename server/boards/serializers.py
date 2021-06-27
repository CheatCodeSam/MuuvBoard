from rest_framework import serializers

from .models import Board, Pin


# TODO Move to Pin App
class PinSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pin
        fields = ["id", "title", "image", "x_coordinate", "y_coordinate", "board"]
        read_only_fields = ["id", "created", "updated"]


class BoardListSerializer(serializers.ModelSerializer):

    num_of_pins = serializers.SerializerMethodField()

    class Meta:
        model = Board
        fields = ["id", "title", "num_of_pins"]

    def get_num_of_pins(self, obj):
        return obj.pins.count()


class BoardSerializer(serializers.ModelSerializer):

    num_of_pins = serializers.SerializerMethodField()
    pins = PinSerializer(many=True, read_only=True)

    class Meta:
        model = Board
        depth = 2
        fields = ["id", "title", "num_of_pins", "pins"]

    def get_num_of_pins(self, obj):
        return obj.pins.count()
