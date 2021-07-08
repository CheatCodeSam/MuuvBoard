import io
import os

import pytest
from attr import s
from django.contrib.auth import get_user, get_user_model
from PIL import Image

from boards.models import Board
from pins.models import Pin


@pytest.fixture(scope="function")
def generate_board_with_pins():
    def _generate_board_with_pins(title, author, num_of_pins=3):
        board = Board.objects.create(title=title, author=author)
        for i in range(num_of_pins):
            pin = Pin.objects.create(board=board, author=author)
        board.save()
        return board

    return _generate_board_with_pins


@pytest.fixture(scope="function")
def generate_image():
    def _generate_image(file_name, x=100, y=100):
        file = io.BytesIO()
        image = Image.new("RGBA", size=(x, y), color=(155, 0, 0))
        image.save(file, "png")
        file.name = file_name
        file.seek(0)
        return file

    return _generate_image


@pytest.fixture(scope="function")
def create_user():
    def _create_user(
        username="username",
        password="pAssw0rd",
        first_name="John",
        last_name="Smith",
        email_address="example@example.com",
    ):
        user = get_user_model().objects.create_user(
            username=username,
            password=password,
            first_name=first_name,
            last_name=last_name,
        )
        user.save()
        return user

    return _create_user
