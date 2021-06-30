import io
import os

import pytest
from attr import s
from PIL import Image

from boards.models import Board
from pins.models import Pin


@pytest.fixture(scope="function")
def generate_board_with_pins():
    def _generate_board_with_pins(title, num_of_pins=3):
        board = Board.objects.create(title=title)
        for i in range(num_of_pins):
            pin = Pin.objects.create(board=board)
        board.save()
        return board

    return _generate_board_with_pins


@pytest.fixture(scope="function")
def generate_image():
    def _generate_image(file_name):
        file = io.BytesIO()
        image = Image.new("RGBA", size=(100, 100), color=(155, 0, 0))
        image.save(file, "png")
        file.name = file_name
        file.seek(0)
        return file

    return _generate_image
