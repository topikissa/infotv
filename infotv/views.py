# coding=utf-8
import json

from django.contrib.staticfiles.storage import staticfiles_storage
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Q
from django.db.transaction import atomic
from django.http.response import HttpResponse, JsonResponse
from django.views.generic import View

from .models import Datum, SlideDeck
from .policy import get_policy


TEMPLATE = u"""
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
</head>
<body>
    <div id="tv"></div>
    <script>var Options = %(options_json)s;</script>
    <script src="%(bundle_path)s"></script>
</body>
</html>
"""


class InfoTvView(View):
    def get_event_slug(self):
        return get_policy().get_event_slug(
            request=self.request,
            slug=self.kwargs["event"]
        )

    def get_options(self):
        return {
            "event": self.get_event_slug(),
            "canEdit": get_policy().can_edit_slides(self.request)
        }

    def dispatch(self, request, *args, **kwargs):
        action = (request.POST.get("action") or request.GET.get("action"))
        action = getattr(self, "handle_%s" % action, None)
        if action and callable(action):
            return action()
        return super(InfoTvView, self).dispatch(request, *args, **kwargs)

    # noinspection PyUnusedLocal
    def get(self, request, *args, **kwargs):
        html = TEMPLATE % {
            "options_json": json.dumps(self.get_options()),
            "bundle_path": staticfiles_storage.url("infotv/bundle.js")
        }
        return HttpResponse(html)

    # noinspection PyUnusedLocal
    def post(self, request, *args, **kwargs):
        datum_key = request.POST.get("datum")
        if datum_key:
            value = request.POST.get("value")
            return self.handle_create_datum(datum_key, value)
        return HttpResponse("Unknown request")

    def handle_create_datum(self, key, value):
        if not get_policy().can_post_datum(self.request):
            return JsonResponse({"message": "can't post datum"}, status=401)

        if value is None:
            value = ""

        try:
            value = json.loads(value)
            parsed = True
        except ValueError:
            value = unicode(value)
            parsed = False

        event_slug = self.get_event_slug()

        try:
            try:
                datum = Datum.objects.get(event_slug=event_slug, key=key)
            except ObjectDoesNotExist:
                datum = Datum(event_slug=event_slug, key=key)
            datum.value = value
            datum.save()
            return JsonResponse({"datum": datum.serialize(), "parsed": parsed})
        except Exception as e:
            return JsonResponse({
                "error": unicode(type(e)),
                "message": unicode(e)
            }, status=400)

    def handle_get_deck(self):
        event_slug = self.get_event_slug()
        try:
            deck = SlideDeck.objects.get(event_slug=event_slug, current=True)
            deck_data = {"id": deck.pk}
            deck_data.update(deck.data)
        except ObjectDoesNotExist:
            deck_data = {
                "id": "missing",
                "slides": []
            }
        datum_q = Q(event_slug=event_slug) | Q(event_slug__isnull=True)
        return JsonResponse({
            "deck": deck_data,
            "datums": dict(
                (d.key, d.serialize())
                for d in Datum.objects.filter(datum_q)
            )
        })

    def handle_post_deck(self):
        if not get_policy().can_edit_slides(self.request):
            return JsonResponse({"message": "can't edit here"}, status=401)
        event_slug = self.get_event_slug()
        data = json.loads(self.request.POST["data"])
        with atomic():
            data.pop("id", None)
            SlideDeck.objects.filter(
                event_slug=event_slug
            ).update(current=False)
            deck = SlideDeck.objects.create(
                event_slug=event_slug, data=data, current=True
            )
        return JsonResponse({
            "id": deck.pk,
            "message": "ok :) id = %d" % deck.pk
        })
