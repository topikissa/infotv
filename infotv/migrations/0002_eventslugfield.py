# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2016-06-12 12:10
from __future__ import unicode_literals

from django.db import migrations
import infotv.models


class Migration(migrations.Migration):

    dependencies = [
        ('infotv', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='datum',
            name='event_slug',
            field=infotv.models.EventSlugField(blank=True, db_index=True, max_length=64, null=True),
        ),
        migrations.AlterField(
            model_name='slidedeck',
            name='event_slug',
            field=infotv.models.EventSlugField(db_index=True, max_length=64),
        ),
    ]
