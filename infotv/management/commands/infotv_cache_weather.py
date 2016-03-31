# -- encoding: UTF-8 --
from optparse import make_option
import requests
from django.core.management.base import BaseCommand
from infotv.models import Datum


class Command(BaseCommand):
    option_list = BaseCommand.option_list + (
        make_option("--location-id", type=int, default=649360),
        make_option(
            "--app-id", type=str,
            help="OpenWeatherMap App ID"
        ),
    )

    def handle(self, location_id, app_id, **options):
        if not app_id:
            raise ValueError("app_id required")
        resp = requests.get(
            url="http://api.openweathermap.org/data/2.5/weather",
            params={"id": location_id, "appid": app_id}
        )
        resp.raise_for_status()
        datum, _ = Datum.objects.get_or_create(event_slug=None, key="weather")
        datum.value = resp.json()
        datum.save()
