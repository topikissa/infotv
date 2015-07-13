# coding=utf-8
from django.conf import settings
from django.core.signals import setting_changed
from django.utils.module_loading import import_string


class PseudoEvent:
    def __init__(self, slug_attr, slug):
        setattr(self, slug_attr, slug)


def get_event_slug_attr():
    return getattr(settings, "INFOTV_EVENT_SLUG_ATTR", "slug")


class BasePolicy(object):
    def get_event_slug(self, request, slug):
        return "event"

    def can_edit_slides(self, request):
        return False

    def can_post_datum(self, request):
        return False


class AnythingGoesPolicy(BasePolicy):
    def get_event_slug(self, request, slug):
        return slug  # Blindly trust user input :-)

    def can_post_datum(self, request):
        return True

    def can_edit_slides(self, request):
        return True


# noinspection PyUnusedLocal
class DefaultPolicy(BasePolicy):
    # noinspection PyMethodMayBeStatic
    def _get_event(self, request, slug):
        model_import_path = getattr(settings, "INFOTV_EVENT_MODEL", None)
        slug_attr = get_event_slug_attr()
        if not model_import_path:
            # When no model is defined, we accept all slugs *shrug*
            event = PseudoEvent(slug_attr, slug)
        else:
            model_class = import_string(model_import_path)
            event = model_class.objects.get(**{slug_attr: slug})
        return event

    def get_event_slug(self, request, slug):
        return getattr(self._get_event(request, slug), get_event_slug_attr())

    def can_post_datum(self, request):
        return True

    def can_edit_slides(self, request):
        user = getattr(request, "user", None)
        if user:
            return bool(getattr(user, "is_staff", False))
        return False


_POLICY_CLASS = None


def get_policy():
    """
    :rtype: infotv.policy.BasePolicy
    """
    global _POLICY_CLASS
    if not _POLICY_CLASS:
        policy_class_name = getattr(
            settings, "INFOTV_POLICY_CLASS",
            "infotv.policy.DefaultPolicy"
        )
        _POLICY_CLASS = import_string(policy_class_name)
    return _POLICY_CLASS()


def _sig_clear_cached_policy(**kwargs):
    global _POLICY_CLASS
    _POLICY_CLASS = None


setting_changed.connect(_sig_clear_cached_policy)
