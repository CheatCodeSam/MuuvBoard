import json
from test.conftest import generate_board_with_pins

import pytest

from boards.models import Board
from files.models import Image
from pins.serializers import PinSerializer

# TODO Test for conversions


@pytest.mark.django_db
def test_create_file(client, generate_image):

    tmp_file = generate_image("test.png")

    resp = client.post(
        f"/api/files/",
        {"image": tmp_file},
        format="multipart",
    )

    assert resp.status_code == 201
    id = resp.data["id"]
    assert Image.objects.get(pk=id)
