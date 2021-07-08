import json
from test.conftest import create_image, create_user, generate_board_with_pins

import pytest

from boards.models import Board
from pins.models import Pin


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
def test_cant_set_user_manually(
    client, generate_board_with_pins, create_user, create_image
):
    user_making_request_to_own_pin = create_user(username="username_")

    board = generate_board_with_pins("Fresh Board", user_making_request_to_own_pin, 0)

    user_that_should_not_own_pin = create_user()

    # More explicit than client.login
    client.force_login(user_making_request_to_own_pin)

    new_image = create_image()

    data = {
        "title": "Fresh Pin",
        "images": [new_image.id],
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
    client, generate_board_with_pins, create_user, create_image
):
    user_A = create_user(username="username_")

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
    assert resp.data["detail"] == "Pins can only be set to Boards owned by User."


@pytest.mark.django_db
def test_cant_search_unless_logged_in(
    client, generate_board_with_pins, create_user, create_image
):
    user = create_user()
    board = generate_board_with_pins("Fresh Board", user, 2)
    firstpin = board.pins.first()
    firstpin.title = "this is my title"
    firstpin.save()
    resp = client.get(f"/api/pins/?search=title&board={board.id}")

    assert resp.status_code == 403


@pytest.mark.django_db
def test_cant_move_single_pin_if_not_owned(
    client, generate_board_with_pins, create_user
):
    user_A = create_user(username="_username")

    board = generate_board_with_pins("Fresh Board", user_A, 3)

    user_B = create_user()
    client.force_login(user_B)

    pin_attempted_to_move = board.pins.first()
    original_pin_coords = {
        "x": pin_attempted_to_move.x_coordinate,
        "y": pin_attempted_to_move.y_coordinate,
    }

    data = [
        {
            "op": "move",
            "path": pin_attempted_to_move.id,
            "values": {"x": 100, "y": 100},
        }
    ]
    resp = client.patch(
        f"/api/pins/",
        data=json.dumps(data),
        content_type="application/json",
    )

    assert resp.status_code == 403

    hopefully_unmodified_pin = Pin.objects.get(pk=pin_attempted_to_move.id)
    assert hopefully_unmodified_pin.x_coordinate == original_pin_coords["x"]
    assert hopefully_unmodified_pin.y_coordinate == original_pin_coords["y"]


@pytest.mark.django_db
def test_cant_bulk_move_pins_not_owned(
    client, generate_board_with_pins, create_user, create_image
):
    user_A = create_user(username="_username")

    board = generate_board_with_pins("Fresh Board", user_A, 3)

    user_B = create_user()
    client.force_login(user_B)

    pin_attempted_to_move = board.pins.first()
    original_pin_coords = {
        "x": pin_attempted_to_move.x_coordinate,
        "y": pin_attempted_to_move.y_coordinate,
    }

    other_pin_attempted_to_move = board.pins.last()
    original_other_pin_coords = {
        "x": pin_attempted_to_move.x_coordinate,
        "y": pin_attempted_to_move.y_coordinate,
    }

    data = [
        {
            "op": "move",
            "path": pin_attempted_to_move.id,
            "values": {"x": 100, "y": 100},
        },
        {
            "op": "move",
            "path": other_pin_attempted_to_move.id,
            "values": {"x": 2, "y": 2},
        },
    ]
    resp = client.patch(
        f"/api/pins/",
        data=json.dumps(data),
        content_type="application/json",
    )

    assert resp.status_code == 403

    hopefully_unmodified_pin = Pin.objects.get(pk=pin_attempted_to_move.id)
    assert hopefully_unmodified_pin.x_coordinate == original_pin_coords["x"]
    assert hopefully_unmodified_pin.y_coordinate == original_pin_coords["y"]

    hopefully_other_unmodified_pin = Pin.objects.get(pk=other_pin_attempted_to_move.id)
    assert hopefully_other_unmodified_pin.x_coordinate == original_other_pin_coords["x"]
    assert hopefully_other_unmodified_pin.y_coordinate == original_other_pin_coords["y"]


@pytest.mark.django_db
def test_cant_delete_pins_not_owned(
    client, generate_board_with_pins, create_user, create_image
):
    user_A = create_user(username="_username")

    board = generate_board_with_pins("Fresh Board", user_A, 3)

    user_B = create_user()
    client.force_login(user_B)

    pin_attemped_to_delete = board.pins.first()

    data = [
        {
            "op": "remove",
            "path": pin_attemped_to_delete.id,
        }
    ]
    resp = client.patch(
        f"/api/pins/",
        data=json.dumps(data),
        content_type="application/json",
    )

    assert resp.status_code == 403

    hopefully_unmodified_board = Board.objects.get(pk=board.id)
    assert hopefully_unmodified_board.pins.count() == 3


@pytest.mark.django_db
def test_cant_bulk_delete_pins_not_owned(client, generate_board_with_pins, create_user):
    user_A = create_user(username="_username")

    board = generate_board_with_pins("Fresh Board", user_A, 3)

    user_B = create_user()
    client.force_login(user_B)

    pin_attmped_to_delete = board.pins.first()
    other_pin_attmped_to_delete = board.pins.last()

    data = [
        {
            "op": "remove",
            "path": pin_attmped_to_delete.id,
        },
        {
            "op": "remove",
            "path": other_pin_attmped_to_delete.id,
        },
    ]
    resp = client.patch(
        f"/api/pins/",
        data=json.dumps(data),
        content_type="application/json",
    )

    assert resp.status_code == 403

    hopefully_unmodified_board = Board.objects.get(pk=board.id)
    assert hopefully_unmodified_board.pins.count() == 3


@pytest.mark.django_db
def test_return_403_on_anon_user_sending_patch_to_pins(
    client, generate_board_with_pins, create_user
):
    user = create_user()

    board = generate_board_with_pins("Fresh Board", user, 3)

    pin_attempted_to_delete = board.pins.first()

    data = [
        {
            "op": "remove",
            "path": pin_attempted_to_delete.id,
        }
    ]
    resp = client.patch(
        f"/api/pins/",
        data=json.dumps(data),
        content_type="application/json",
    )

    assert resp.status_code == 403

    hopefully_unmodified_board = Board.objects.get(pk=board.id)
    assert hopefully_unmodified_board.pins.count() == 3
