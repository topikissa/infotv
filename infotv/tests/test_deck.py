# -- encoding: UTF-8 --
import json

from django.test.client import RequestFactory
from django.test.utils import override_settings
from infotv.views import InfoTvView
import pytest

EXAMPLE_DECK_DATA = {
    "slides": [
        {
            "duration": 0,
            "content": "# test",
            "type": "text",
            "id": "s24t7h1n0q"
        },
        {
            "duration": 0,
            "src": "https://placehold.it/304x220",
            "type": "image",
            "id": "s2534m3sqo"
        },
        {
            "duration": 0,
            "type": "nownext",
            "id": "s2533iqgbo"
        }
    ],
    "eep": None
}


def get_deck_post_request():
    return RequestFactory().post("/", {"action": "post_deck", "data": json.dumps(EXAMPLE_DECK_DATA)})


@pytest.mark.django_db
def test_post_deck(rf):
    request = get_deck_post_request()
    last_deck_id = 0
    for x in range(3):
        response = InfoTvView.as_view()(request=request, event="dsfargeg")
        assert response.status_code == 200
        deck_id = json.loads(response.content)["id"]
        assert deck_id > last_deck_id
        last_deck_id = deck_id
    response = InfoTvView.as_view()(request=rf.get("/", {"action": "get_deck"}), event="dsfargeg")
    deck_data = json.loads(response.content)["deck"]
    assert deck_data["id"] == last_deck_id
    assert deck_data["slides"] == EXAMPLE_DECK_DATA["slides"]


@pytest.mark.django_db
def test_get_bogus_event_deck(rf):
    response = InfoTvView.as_view()(request=rf.get("/", {"action": "get_deck"}), event="dkfjstwr4iunm")
    assert json.loads(response.content)["deck"]["id"] == "missing"


@pytest.mark.django_db
def test_post_deck_auth():
    request = get_deck_post_request()
    with override_settings(INFOTV_POLICY_CLASS="infotv.policy.BasePolicy"):
        response = InfoTvView.as_view()(request, event="dsfargeg")
        assert response.status_code == 401
