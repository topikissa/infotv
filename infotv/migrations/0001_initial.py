# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import jsonfield.fields


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Datum',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('event_slug', models.CharField(db_index=True, max_length=64, null=True, blank=True)),
                ('mtime', models.DateTimeField(auto_now=True)),
                ('key', models.CharField(max_length=64, db_index=True)),
                ('value', jsonfield.fields.JSONField()),
            ],
        ),
        migrations.CreateModel(
            name='SlideDeck',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('event_slug', models.CharField(max_length=64, db_index=True)),
                ('created_on', models.DateTimeField(auto_now_add=True)),
                ('current', models.BooleanField(default=False, db_index=True)),
                ('data', jsonfield.fields.JSONField()),
            ],
        ),
        migrations.AlterUniqueTogether(
            name='datum',
            unique_together=set([('event_slug', 'key')]),
        ),
    ]
