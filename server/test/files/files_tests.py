import json
import os
from test.conftest import create_user, generate_image_bytes

import pytest

from boards.models import Board
from files.models import Image
from pins.serializers import PinSerializer

# TODO Test for conversions


@pytest.mark.django_db
def test_create_file(client, generate_image_bytes, create_user):

    user = create_user()

    tmp_file = generate_image_bytes("test.png")

    client.force_login(user)

    resp = client.post(
        f"/api/files/",
        {"image": tmp_file},
        format="multipart",
    )

    assert resp.status_code == 201
    id = resp.data["id"]
    img = Image.objects.get(pk=id)
    assert img


@pytest.mark.django_db
def test_cant_upload_image_if_not_authenticated(client, generate_image_bytes):

    tmp_file = generate_image_bytes("test.png")

    resp = client.post(
        f"/api/files/",
        {"image": tmp_file},
        format="multipart",
    )

    assert resp.status_code == 403
