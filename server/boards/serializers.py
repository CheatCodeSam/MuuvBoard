from rest_framework import serializers

from pins.serializers import PinSerializer

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
    pins = PinSerializer(many=True, read_only=True)

    class Meta:
        model = Board
        depth = 2
        fields = ["id", "title", "num_of_pins", "pins"]

    def get_num_of_pins(self, obj):
        return obj.pins.count()
