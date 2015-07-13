import os
import tempfile

os.environ.setdefault("DJANGO_SETTINGS_MODULE", __name__)

DEBUG = True
ROOT_URLCONF = __name__
SECRET_KEY = u"Shh."
ALLOWED_HOSTS = ["*"]
INSTALLED_APPS = [
    "django.contrib.staticfiles",
    "infotv"
]
DATABASES = {
    "default": {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(tempfile.gettempdir(), "dtv_test.sqlite3")
    }
}
MIDDLEWARE_CLASSES = (
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
)
STATIC_URL = "/static/"
INFOTV_POLICY_CLASS = "infotv.policy.AnythingGoesPolicy"

########################################################################

from django.conf.urls import url, include
from django.http import HttpResponseRedirect

urlpatterns = [
    url("^", include("infotv.urls")),
    url("^$", lambda request: HttpResponseRedirect("/foo/infotv/")),
]

if __name__ == "__main__":
    from django.core.management import execute_from_command_line
    execute_from_command_line()
