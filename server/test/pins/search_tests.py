from test.conftest import create_user, generate_board_with_pins

import pytest


@pytest.mark.django_db
def test_search_pin_titles(client, generate_board_with_pins, create_user):
    user = create_user()
    board = generate_board_with_pins("Fresh Board", user, 2)
    firstpin = board.pins.first()
    firstpin.title = "this is my title"
    firstpin.save()
    client.force_login(user)
    resp = client.get(f"/api/pins/?search=title&board={board.id}")

    assert resp.status_code == 200

    assert resp.data[0]["id"] == firstpin.id


@pytest.mark.django_db
def test_search_pin_tags(client, generate_board_with_pins, create_user):
    user = create_user()
    board = generate_board_with_pins("Fresh Board", user, 2)
    firstpin = board.pins.first()
    firstpin.tags.add("title", "tag", "hello", "world")
    firstpin.save()
    client.force_login(user)
    resp = client.get(f"/api/pins/?search=title&board={board.id}")

    assert resp.status_code == 200

    assert resp.data[0]["id"] == firstpin.id


@pytest.mark.django_db
def test_can_only_search_pins_owned_by_user(
    client, generate_board_with_pins, create_user
):
    user_A = create_user(username="_username")
    board = generate_board_with_pins("Fresh Board", user_A, 2)

    firstpin = board.pins.first()
    firstpin.title = "this is my title"
    firstpin.save()

    user_B = create_user()
    client.force_login(user_B)

    resp = client.get(f"/api/pins/?search=title&board={board.id}")

    assert resp.status_code == 200

    assert not resp.data


@pytest.mark.django_db
def test_no_duplicates(client, generate_board_with_pins, create_user):
    user = create_user()
    board = generate_board_with_pins("Fresh Board", user, 2)
    firstpin = board.pins.first()
    firstpin.title = "this is my title"
    firstpin.tags.add("title", "hello")
    firstpin.save()

    second_pin = board.pins.last()
    second_pin.title = "this is my pin"
    second_pin.tags.add("title", "hello")
    second_pin.save()

    client.force_login(user)
    resp = client.get(f"/api/pins/?search=title&board={board.id}")

    assert resp.status_code == 200
    assert len(resp.data) == 2
    assert resp.data[0]["id"] != resp.data[1]["id"]
    assert resp.data[0]["id"] == firstpin.id or resp.data[0]["id"] == second_pin.id
    assert resp.data[1]["id"] == firstpin.id or resp.data[1]["id"] == second_pin.id
