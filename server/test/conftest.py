import io
import os

import pytest
from attr import s
from django.contrib.auth import get_user, get_user_model
from django.core.files.images import ImageFile
from PIL import Image as PImg

from boards.models import Board
from files.models import Image
from pins.models import Pin


def _generate_image(file_name, x=100, y=100):
    file = io.BytesIO()
    image = PImg.new("RGBA", size=(x, y), color=(155, 0, 0))
    image.save(file, "png")
    file.name = file_name
    file.seek(0)
    return file


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
def generate_image_bytes():
    return _generate_image


@pytest.fixture(scope="function")
def create_image():
    def _create_image():
        tmp_file = _generate_image("file.png")
        new_image = Image.objects.create(image=ImageFile(tmp_file))
        new_image.save()
        return new_image

    return _create_image


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
