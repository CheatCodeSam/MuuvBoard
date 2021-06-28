from test.conftest import generate_board_with_pins

import pytest

from boards.models import Board
from boards.serializers import BoardSerializer


@pytest.mark.django_db
def test_get_number_of_pins(client, generate_board_with_pins):
    board = generate_board_with_pins("Fresh Board", 3)
    serializer = BoardSerializer(board)
    assert serializer.data["num_of_pins"] == 3


@pytest.mark.django_db
def test_get_list_of_boards(client, generate_board_with_pins):
    board_one = generate_board_with_pins("Board One")
    board_two = generate_board_with_pins("Board Two")
    resp = client.get(f"/api/boards/")
    assert resp.status_code == 200
    assert resp.data[0]["title"] == board_one.title
    assert not "pins" in resp.data[0]
    assert resp.data[1]["title"] == board_two.title


@pytest.mark.django_db
def test_create_board(client):
    boards = Board.objects.all()
    assert len(boards) == 0

    resp = client.post(
        "/api/boards/", {"title": "Fresh Board"}, content_type="application/json"
    )
    assert resp.status_code == 201
    assert resp.data["title"] == "Fresh Board"
    assert resp.data["num_of_pins"] == 0

    boards = Board.objects.all()
    assert len(boards) == 1


@pytest.mark.django_db
def test_get_single_board(client, generate_board_with_pins):
    board = generate_board_with_pins("Fresh Board")
    resp = client.get(f"/api/boards/{board.id}/")
    assert resp.status_code == 200
    assert resp.data["title"] == "Fresh Board"


def test_get_incorrect_board(client):
    resp = client.get(f"/api/movies/-1/")
    assert resp.status_code == 404


@pytest.mark.django_db
def test_update_board_title(client, generate_board_with_pins):
    board = generate_board_with_pins("Fresh Board")
    resp = client.put(
        f"/api/boards/{board.id}/",
        {"title": "New Board Title"},
        content_type="application/json",
    )

    assert resp.status_code == 200
    assert resp.data["title"] == "New Board Title"

    resp_two = client.get(f"/api/boards/{board.id}/")
    assert resp_two.status_code == 200
    assert resp_two.data["title"] == "New Board Title"


@pytest.mark.django_db
def test_update_board_invalid_json(client, generate_board_with_pins):
    board = generate_board_with_pins("Fresh Board")
    resp = client.put(
        f"/api/boards/{board.id}/",
        {""},
        content_type="application/json",
    )

    assert resp.status_code == 400


@pytest.mark.django_db
def test_show_pins_on_board(client, generate_board_with_pins):
    board = generate_board_with_pins("Fresh Board", 3)
    seralizer = BoardSerializer(board)
    assert len(seralizer.data["pins"]) == 3


@pytest.mark.django_db
def test_get_pins_from_board(client, generate_board_with_pins):
    board = generate_board_with_pins("Fresh Board", 3)
    resp = client.get(f"/api/boards/{board.id}/")
    assert resp.status_code == 200
    assert len(resp.data["pins"]) == 3
    assert resp.data["title"] == "Fresh Board"
