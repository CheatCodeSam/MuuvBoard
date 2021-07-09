from rest_framework import serializers

from pins.serializers import PinListSerializer

from .models import Board


class BoardListSerializer(serializers.ModelSerializer):

    num_of_pins = serializers.SerializerMethodField()
    author = serializers.PrimaryKeyRelatedField(
        read_only=True,
    )

    class Meta:
        model = Board
        fields = ["id", "title", "num_of_pins", "author"]

    def get_num_of_pins(self, obj):
        return obj.pins.count()


class BoardSerializer(serializers.ModelSerializer):

    num_of_pins = serializers.SerializerMethodField()
    pins = PinListSerializer(read_only=True, many=True)

    class Meta:
        model = Board
        depth = 1
        fields = ["id", "title", "num_of_pins", "pins"]

    def get_num_of_pins(self, obj):
        return obj.pins.count()
