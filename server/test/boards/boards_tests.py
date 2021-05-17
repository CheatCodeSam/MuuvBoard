import pytest

from boards.models import Board, Pin
from boards.serializers import BoardSerializer


def generate_board_with_pins(title, num_of_pins=3):
    board = Board.objects.create(title=title)
    for i in range(num_of_pins):
        pin = Pin.objects.create(board=board)
    return board


@pytest.mark.django_db
def test_get_number_of_pins(client):
    board = generate_board_with_pins("Fresh Board", 3)
    serializer = BoardSerializer(board)
    assert serializer.data["num_of_pins"] == 3


@pytest.mark.django_db
def test_get_list_of_boards(client):
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
