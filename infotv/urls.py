# -*- coding: utf-8 -*-
from django.conf.urls import url
from django.views.decorators.csrf import csrf_exempt
from .views import InfoTvView

urlpatterns = [
    url(r'^(?P<event>[a-z0-9]+)/infotv/$', csrf_exempt(InfoTvView.as_view())),
]
