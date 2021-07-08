import json
from test.conftest import create_image, create_user, generate_board_with_pins

import pytest

from boards.models import Board
from pins.models import Pin


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
def test_move_one_pin(client, generate_board_with_pins, create_user):
    user = create_user()
    board = generate_board_with_pins("Fresh Board", user, 3)
    pin_to_move = board.pins.first()

    client.force_login(user)

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

    client.force_login(user)

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

    client.force_login(user)

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
def test_create_pin(client, generate_board_with_pins, create_user, create_image):
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
