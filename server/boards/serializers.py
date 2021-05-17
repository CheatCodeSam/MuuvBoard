from rest_framework import serializers

from .models import Board, Pin


class BoardSerializer(serializers.ModelSerializer):
    num_of_pins = serializers.SerializerMethodField()

    class Meta:
        model = Board
        fields = ["title", "num_of_pins"]

    def get_num_of_pins(self, obj):
        return obj.pins.count()
