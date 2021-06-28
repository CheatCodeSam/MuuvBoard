from rest_framework import serializers

from pins.serializers import PinBoardListSerializer

from .models import Board


class BoardListSerializer(serializers.ModelSerializer):

    num_of_pins = serializers.SerializerMethodField()

    class Meta:
        model = Board
        fields = ["id", "title", "num_of_pins"]

    def get_num_of_pins(self, obj):
        return obj.pins.count()


class BoardSerializer(serializers.ModelSerializer):

    num_of_pins = serializers.SerializerMethodField()
    pins = PinBoardListSerializer(read_only=True, many=True)

    class Meta:
        model = Board
        depth = 2
        fields = ["id", "title", "num_of_pins", "pins"]

    def get_num_of_pins(self, obj):
        return obj.pins.count()
