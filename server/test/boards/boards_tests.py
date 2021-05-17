import json

import pytest

from boards.models import Board, Pin
from boards.serializers import BoardSerializer


def generate_board_with_pins(num_of_pins=3):
    board = Board.objects.create(title="Fresh Board")
    for i in range(num_of_pins):
        pin = Pin.objects.create(board=board)
    return board


@pytest.mark.django_db
def test_get_number_of_pins(client):
    board = generate_board_with_pins(3)
    serializer = BoardSerializer(board)
    assert serializer.data["num_of_pins"] == 3
