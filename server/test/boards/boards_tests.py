from test.conftest import create_user, generate_board_with_pins

import pytest

from boards.models import Board
from boards.serializers import BoardSerializer


@pytest.mark.django_db
def test_get_number_of_pins(client, generate_board_with_pins, create_user):
    user = create_user()
    board = generate_board_with_pins("Fresh Board", user, 3)
    serializer = BoardSerializer(board)
    assert serializer.data["num_of_pins"] == 3


@pytest.mark.django_db
def test_get_list_of_boards(client, generate_board_with_pins, create_user):
    user = create_user()

    board_one = generate_board_with_pins("Board One", user)
    board_two = generate_board_with_pins("Board Two", user)

    client.force_login(user)

    resp = client.get(f"/api/boards/")
    assert resp.status_code == 200
    assert resp.data[0]["title"] == board_one.title
    assert not "pins" in resp.data[0]
    assert resp.data[1]["title"] == board_two.title


@pytest.mark.django_db
def test_create_board(client, create_user):
    user = create_user()
    boards = Board.objects.all()
    assert len(boards) == 0

    client.force_login(user)

    resp = client.post(
        "/api/boards/", {"title": "Fresh Board"}, content_type="application/json"
    )
    assert resp.status_code == 201
    assert resp.data["title"] == "Fresh Board"
    assert resp.data["num_of_pins"] == 0

    boards = Board.objects.all()
    assert len(boards) == 1


@pytest.mark.django_db
def test_user_does_not_get_list_of_boards_that_are_not_theirs(
    client, create_user, generate_board_with_pins
):
    user_A = create_user(username="_username")
    generate_board_with_pins("Fresh Board 1", user_A)
    generate_board_with_pins("Fresh Board 2", user_A)
    generate_board_with_pins("Fresh Board 3", user_A)

    user_B = create_user()
    generate_board_with_pins("User B Board", user_B)

    client.force_login(user_B)
    resp = client.get(f"/api/boards/")
    assert resp.status_code == 200
    assert len(resp.data) == 1
    assert resp.data[0]["title"] == "User B Board"


@pytest.mark.django_db
def test_get_single_board(client, generate_board_with_pins, create_user):
    user = create_user()
    board = generate_board_with_pins("Fresh Board", user)
    client.force_login(user)
    resp = client.get(f"/api/boards/{board.id}/")
    assert resp.status_code == 200
    assert resp.data["title"] == "Fresh Board"


@pytest.mark.django_db
def test_get_incorrect_board(client):
    resp = client.get(f"/api/movies/100/")
    assert resp.status_code == 404


@pytest.mark.django_db
def test_update_board_title(client, generate_board_with_pins, create_user):
    user = create_user()
    board = generate_board_with_pins("Fresh Board", user)
    client.force_login(user)

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
def test_update_board_invalid_json(client, generate_board_with_pins, create_user):
    user = create_user()
    board = generate_board_with_pins("Fresh Board", user)
    client.force_login(user)
    resp = client.put(
        f"/api/boards/{board.id}/",
        {""},
        content_type="application/json",
    )

    assert resp.status_code == 400


@pytest.mark.django_db
def test_show_pins_on_board(client, generate_board_with_pins, create_user):
    user = create_user()
    board = generate_board_with_pins("Fresh Board", user, 3)
    seralizer = BoardSerializer(board)
    assert len(seralizer.data["pins"]) == 3


@pytest.mark.django_db
def test_get_pins_from_board(client, generate_board_with_pins, create_user):
    user = create_user()
    board = generate_board_with_pins("Fresh Board", user, 3)
    client.force_login(user)
    resp = client.get(f"/api/boards/{board.id}/")
    assert resp.status_code == 200
    assert len(resp.data["pins"]) == 3
    assert resp.data["title"] == "Fresh Board"


@pytest.mark.django_db
def test_anon_user_cannot_get_single_pin(client, generate_board_with_pins, create_user):
    user = create_user()
    board = generate_board_with_pins("Fresh Board", user)
    resp = client.get(f"/api/boards/{board.id}/")
    assert resp.status_code == 403


@pytest.mark.django_db
def test_other_user_cannot_get_single_pin(client, generate_board_with_pins, create_user):
    user = create_user(username="_username")
    board = generate_board_with_pins("Fresh Board", user)
    wrong_user = create_user()
    client.force_login(wrong_user)
    resp = client.get(f"/api/boards/{board.id}/")
    assert resp.status_code == 403


@pytest.mark.django_db
def test_anon_user_cannot_get_list(client, generate_board_with_pins, create_user):
    user = create_user()
    board = generate_board_with_pins("Fresh Board", user)
    resp = client.get(f"/api/boards/")
    assert resp.status_code == 403
