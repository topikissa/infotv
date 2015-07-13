from django.db import models
from jsonfield.fields import JSONField


class EventSlugField(models.CharField):
    def __init__(self, *args, **kwargs):
        kwargs.setdefault("db_index", True)
        kwargs.setdefault("max_length", 64)
        super(EventSlugField, self).__init__(*args, **kwargs)


class SlideDeck(models.Model):
    event_slug = EventSlugField()
    created_on = models.DateTimeField(auto_now_add=True)
    current = models.BooleanField(db_index=True, default=False)
    data = JSONField()


class Datum(models.Model):
    event_slug = EventSlugField(blank=True, null=True)
    mtime = models.DateTimeField(auto_now=True)
    key = models.CharField(max_length=64, db_index=True)
    value = JSONField()

    class Meta:
        unique_together = [("event_slug", "key")]

    def serialize(self):
        return {
            "id": self.pk,
            "key": self.key,
            "value": self.value,
            "mtime": self.mtime.isoformat()
        }
