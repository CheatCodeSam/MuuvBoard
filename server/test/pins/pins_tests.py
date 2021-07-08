import json
from test.conftest import (
    create_image,
    create_user,
    generate_board_with_pins,
    generate_image_bytes,
)

import pytest
from django.core.files.images import ImageFile

from boards.models import Board
from files.models import Image
from pins.models import Pin
from pins.serializers import PinSerializer


@pytest.mark.django_db
def test_get_pin_by_id(client, generate_board_with_pins, create_user):
    username = "username"
    password = "p4ssw0rd"
    user = create_user(username=username, password=password)
    board = generate_board_with_pins("Fresh Board", user, 1)
    idToGet = board.pins.first().id

    client.login(username=username, password=password)
    resp = client.get(f"/api/pins/{idToGet}/")

    assert resp.status_code == 200
    assert resp.data["id"] == idToGet


@pytest.mark.django_db
def test_get_pin_if_wrong_user(client, generate_board_with_pins, create_user):
    user = create_user()
    board = generate_board_with_pins("Fresh Board", user, 1)
    idToGet = board.pins.first().id

    username = "other_username"
    password = "p4ssw0rd"
    wrong_user = create_user(username=username, password=password)

    client.login(username=username, password=password)
    resp = client.get(f"/api/pins/{idToGet}/")

    assert resp.status_code == 403


@pytest.mark.django_db
def test_get_pin_if_anon(client, generate_board_with_pins, create_user):
    user = create_user()
    board = generate_board_with_pins("Fresh Board", user, 1)
    idToGet = board.pins.first().id

    resp = client.get(f"/api/pins/{idToGet}/")

    assert resp.status_code == 403


@pytest.mark.django_db
def test_move_one_pin(client, generate_board_with_pins, create_user):
    user = create_user()
    board = generate_board_with_pins("Fresh Board", user, 3)
    pin_to_move = board.pins.first()

    data = [
        {
            "op": "move",
            "path": pin_to_move.id,
            "values": {"x": 100, "y": 100},
        }
    ]
    resp = client.patch(
        f"/api/pins/",
        data=json.dumps(data),
        content_type="application/json",
    )

    assert resp.status_code == 200
    moved_pin = Pin.objects.get(pk=pin_to_move.id)
    assert moved_pin.x_coordinate and moved_pin.y_coordinate == 100


@pytest.mark.django_db
def test_move_more_than_one_pin(client, generate_board_with_pins, create_user):
    user = create_user()
    board = generate_board_with_pins("Fresh Board", author=user, num_of_pins=2)
    first_pin_to_move = board.pins.first()
    second_pin_to_move = board.pins.last()

    data = [
        {
            "op": "move",
            "path": first_pin_to_move.id,
            "values": {"x": 100, "y": 200},
        },
        {
            "op": "move",
            "path": second_pin_to_move.id,
            "values": {"x": -100, "y": -200},
        },
    ]

    resp = client.patch(
        f"/api/pins/",
        data=json.dumps(data),
        content_type="application/json",
    )

    assert resp.status_code == 200

    first_moved_pin = Pin.objects.get(pk=first_pin_to_move.id)
    second_moved_pin = Pin.objects.get(pk=second_pin_to_move.id)

    assert first_moved_pin.x_coordinate == 100
    assert first_moved_pin.y_coordinate == 200

    assert second_moved_pin.x_coordinate == -100
    assert second_moved_pin.y_coordinate == -200


@pytest.mark.django_db
def test_delete_pin(client, generate_board_with_pins, create_user):
    user = create_user()
    board = generate_board_with_pins("Fresh Board", user, 3)
    assert board.pins.count() == 3
    pin_to_delete = board.pins.first()
    pin_to_delete_id = pin_to_delete.id

    data = [
        {
            "op": "remove",
            "path": pin_to_delete_id,
        }
    ]
    resp = client.patch(
        f"/api/pins/",
        data=json.dumps(data),
        content_type="application/json",
    )

    assert resp.status_code == 200

    modified_board = Board.objects.get(pk=board.id)
    assert modified_board.pins.count() == 2
    with pytest.raises(Pin.DoesNotExist):
        modified_board.pins.get(pk=pin_to_delete_id)


@pytest.mark.django_db
def test_get_pin_that_doesnt_exist(client):
    resp = client.get(f"/api/pins/1/")
    assert resp.status_code == 404


@pytest.mark.django_db
def test_create_pin(
    client, generate_board_with_pins, generate_image_bytes, create_user, create_image
):
    username = "username"
    password = "p4ssw0rd"
    user = create_user(username=username, password=password)
    board = generate_board_with_pins("Fresh Board", user, 0)

    client.login(username=username, password=password)

    new_image = create_image()
    new_image_id = new_image.id

    data = {
        "title": "Fresh Pin",
        "images": [new_image_id],
        "board": board.id,
    }

    resp = client.post(
        f"/api/pins/",
        data=data,
        format="application/json",
    )

    print(resp.data)

    assert resp.status_code == 201
    assert resp.data["title"] == "Fresh Pin"
    assert resp.data["x_coordinate"] == 0
    assert resp.data["y_coordinate"] == 0
    assert resp.data["board"] == board.id
    assert resp.data["images"][0] == new_image_id

    modified_board = Board.objects.get(pk=board.id)
    assert modified_board.pins.count() == 1
    assert modified_board.pins.first().author == user


@pytest.mark.django_db
def test_cant_set_user_manually(
    client, generate_board_with_pins, generate_image_bytes, create_user, create_image
):
    username = "username_"
    password = "p4ssw0rd"
    user_making_request_to_own_pin = create_user(username=username, password=password)

    # More explicit than client.login
    client.force_login(user_making_request_to_own_pin)

    board = generate_board_with_pins("Fresh Board", user_making_request_to_own_pin, 0)

    new_image = create_image()
    new_image_id = new_image.id

    user_that_should_not_own_pin = create_user()

    data = {
        "title": "Fresh Pin",
        "images": [new_image_id],
        "board": board.id,
        "author": user_that_should_not_own_pin.id,
    }

    resp = client.post(
        f"/api/pins/",
        data=data,
        format="application/json",
    )

    assert resp.status_code == 201

    pin_just_created = Pin.objects.get(pk=resp.data["id"])
    assert pin_just_created.author == user_making_request_to_own_pin
    assert pin_just_created.author != user_that_should_not_own_pin


@pytest.mark.django_db
def test_cant_create_pin_on_board_not_owned_by_user(
    client, generate_board_with_pins, generate_image_bytes, create_user, create_image
):
    username = "username_"
    password = "p4ssw0rd"
    user_A = create_user(username=username, password=password)

    board_owned_by_user_A = generate_board_with_pins("Fresh Board", user_A, 0)

    user_B = create_user()
    board_owned_by_user_B = generate_board_with_pins("Fresh Board 2", user_B, 0)

    # More explicit than client.login
    client.force_login(user_A)

    new_image = create_image()

    data = {
        "title": "Fresh Pin",
        "images": [new_image.id],
        "board": board_owned_by_user_B.id,
    }

    resp = client.post(
        f"/api/pins/",
        data=data,
        format="application/json",
    )

    assert resp.status_code == 403
