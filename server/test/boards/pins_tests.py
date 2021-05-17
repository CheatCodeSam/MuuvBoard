import pytest

from boards.serializers import BoardWithPinsSerializer

from .conftest import generate_board_with_pins


@pytest.mark.django_db
def test_show_pins_on_board(client, generate_board_with_pins):
    board = generate_board_with_pins("Fresh Board", 3)
    seralizer = BoardWithPinsSerializer(board)
    assert len(seralizer.data["pins"]) == 3


@pytest.mark.django_db
def test_get_pins_from_board(client, generate_board_with_pins):
    board = generate_board_with_pins("Fresh Board", 3)
    resp = client.get(f"/api/boards/{board.id}/pins/")
    assert resp.status_code == 200
    assert len(resp.data["pins"]) == 3
    assert resp.data["title"] == "Fresh Board"
