from test.conftest import create_image, create_user, generate_board_with_pins

import pytest

from pins.models import Pin


@pytest.mark.django_db
def test_cant_set_user_manually(
    client, generate_board_with_pins, create_user, create_image
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
    client, generate_board_with_pins, create_user, create_image
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
