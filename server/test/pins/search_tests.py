import json
from test.conftest import create_user, generate_board_with_pins

import pytest
from django.core.files.images import ImageFile

from boards.models import Board
from files.models import Image
from pins.models import Pin
from pins.serializers import PinSerializer


# TODO add more search test
@pytest.mark.django_db
def test_search_pin_titles(client, generate_board_with_pins, create_user):
    user = create_user()
    board = generate_board_with_pins("Fresh Board", user, 2)
    firstpin = board.pins.first()
    firstpin.title = "this is my title"
    firstpin.save()
    client.force_login(user)
    resp = client.get(f"/api/pins/?search=title&board={board.id}")

    assert resp.status_code == 200

    assert resp.data[0]["id"] == firstpin.id
