import json
from test.conftest import generate_board_with_pins, generate_image_bytes

import pytest
from django.core.files.images import ImageFile

from boards.models import Board
from files.models import Image
from pins.models import Pin
from pins.serializers import PinSerializer

# @pytest.mark.django_db
# def test_create_pin_with_tags(client, generate_board_with_pins, generate_image):
#     board = generate_board_with_pins("Fresh Board", 0)
#     assert board.pins.count() == 0

#     tmp_file = generate_image("test.png")
#     new_image = Image.objects.create(image=ImageFile(tmp_file))
#     new_image.save()
#     new_image_id = new_image.id

#     pin_tags = ["hello", "world"]

#     resp = client.post(
#         f"/api/pins/",
#         {
#             "title": "Fresh Pin",
#! for the life of me I can not get this to work.
#             "tags": ["hello", "world"],
#             "images": [new_image_id],
#             "board": board.id,
#         },
#         format="application/json",
#     )

#     print(resp.data)

#     assert resp.status_code == 201
#     assert resp.data["title"] == "Fresh Pin"
#     assert resp.data["x_coordinate"] == 0
#     assert resp.data["y_coordinate"] == 0
#     assert resp.data["board"] == board.id
#     assert resp.data["images"][0] == new_image_id
#     assert resp.data["tags"] == pin_tags

#     modified_board = Board.objects.get(pk=board.id)
#     assert modified_board.pins.count() == 1


# @pytest.mark.django_db
# def test_put_tag(client, generate_board_with_pins):
#     board = generate_board_with_pins("Fresh Board", 3)
#     pin_to_move = board.pins.first()
#     resp = client.patch(
#         f"/api/pins/",
#         {
#             "actions": [
#                 {
#                     "op": "move",
#                     "path": pin_to_move.id,
#                     "values": {"x": 100, "y": 100},
#                 }
#             ]
#         },
#         content_type="application/json",
#     )

#     assert resp.status_code == 200
#     moved_pin = Pin.objects.get(pk=pin_to_move.id)
#     assert moved_pin.x_coordinate and moved_pin.y_coordinate == 100
