# -- encoding: UTF-8 --
import json
import uuid
from django.test.utils import override_settings
from infotv.models import Datum
from infotv.views import InfoTvView
import pytest


@pytest.mark.django_db
def test_create_and_retrieve_unparsed_datum(rf):
    response = InfoTvView.as_view()(
        request=rf.post("/", {"datum": "hello", "value": "world"}),
        event="dsfargeg"
    )
    assert not json.loads(response.content)["parsed"]
    assert Datum.objects.get(event_slug="dsfargeg", key="hello").value == "world"
    response = InfoTvView.as_view()(
        event="dsfargeg",
        request=rf.get("/", {"action": "get_deck"})
    )
    assert json.loads(response.content)["datums"]["hello"]["value"] == "world"


@pytest.mark.django_db
def test_create_and_retrieve_parsed_datum(rf):
    input_data = {"world": str(uuid.uuid4())}
    input_json = json.dumps(input_data)
    response = InfoTvView.as_view()(
        request=rf.post("/", {"datum": "hello", "value": input_json}),
        event="dsfargeg"
    )
    assert json.loads(response.content)["parsed"]
    assert Datum.objects.get(event_slug="dsfargeg", key="hello").value == input_data
    response = InfoTvView.as_view()(
        event="dsfargeg",
        request=rf.get("/", {"action": "get_deck"})
    )
    assert json.loads(response.content)["datums"]["hello"]["value"] == input_data


@pytest.mark.django_db
def test_datum_auth(rf):
    with override_settings(INFOTV_POLICY_CLASS="infotv.policy.BasePolicy"):
        response = InfoTvView.as_view()(
            request=rf.post("/", {"datum": "hello", "value": "world"}),
            event="dsfargeg"
        )
        assert response.status_code == 401
