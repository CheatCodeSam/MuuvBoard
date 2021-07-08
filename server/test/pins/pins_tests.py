import json
from test.conftest import generate_board_with_pins

import pytest
from django.core.files.images import ImageFile

from boards.models import Board
from files.models import Image
from pins.models import Pin
from pins.serializers import PinSerializer


@pytest.mark.django_db
def test_get_pin_by_id(client, generate_board_with_pins):
    board = generate_board_with_pins("Fresh Board", 1)
    idToGet = board.pins.first().id

    resp = client.get(f"/api/pins/{idToGet}/")

    assert resp.status_code == 200
    assert resp.data["id"] == idToGet


@pytest.mark.django_db
def test_move_one_pin(client, generate_board_with_pins):
    board = generate_board_with_pins("Fresh Board", 3)
    pin_to_move = board.pins.first()
    resp = client.patch(
        f"/api/pins/",
        {
            "actions": [
                {
                    "op": "move",
                    "path": pin_to_move.id,
                    "values": {"x": 100, "y": 100},
                }
            ]
        },
        content_type="application/json",
    )

    assert resp.status_code == 200
    moved_pin = Pin.objects.get(pk=pin_to_move.id)
    assert moved_pin.x_coordinate and moved_pin.y_coordinate == 100


@pytest.mark.django_db
def test_move_more_than_one_pin(client, generate_board_with_pins):
    board = generate_board_with_pins("Fresh Board", 2)
    first_pin_to_move = board.pins.first()
    second_pin_to_move = board.pins.last()
    resp = client.patch(
        f"/api/pins/",
        {
            "actions": [
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
        },
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
def test_delete_pin(client, generate_board_with_pins):
    board = generate_board_with_pins("Fresh Board", 3)
    assert board.pins.count() == 3
    pin_to_delete = board.pins.first()
    pin_to_delete_id = pin_to_delete.id
    resp = client.patch(
        f"/api/pins/",
        {
            "actions": [
                {
                    "op": "remove",
                    "path": pin_to_delete_id,
                }
            ]
        },
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


# @pytest.mark.django_db
# def test_create_pin(client, generate_board_with_pins, generate_image):
#     board = generate_board_with_pins("Fresh Board", 0)
#     assert board.pins.count() == 0

#     tmp_file = generate_image("test.png")
#     new_image = Image.objects.create(image=ImageFile(tmp_file))
#     new_image.save()
#     new_image_id = new_image.id

#     resp = client.post(
#         f"/api/pins/",
#         {"title": "Fresh Pin", "images": [new_image_id], "board": board.id},
#         format="multipart",
#     )

#     assert resp.status_code == 201
#     assert resp.data["title"] == "Fresh Pin"
#     assert resp.data["x_coordinate"] == 0
#     assert resp.data["y_coordinate"] == 0
#     assert resp.data["board"] == board.id
#     assert resp.data["images"][0] == new_image_id

#     modified_board = Board.objects.get(pk=board.id)
#     assert modified_board.pins.count() == 1
