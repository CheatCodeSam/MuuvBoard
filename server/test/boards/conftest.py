import pytest

from boards.models import Board, Pin


@pytest.fixture(scope="function")
def generate_board_with_pins():
    def _generate_board_with_pins(title, num_of_pins=3):
        board = Board.objects.create(title=title)
        for i in range(num_of_pins):
            pin = Pin.objects.create(board=board)
        return board

    return _generate_board_with_pins
