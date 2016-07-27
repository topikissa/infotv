Telkku-Kelkku - Ropecon infoTV
==============

NOTE: this readme is NOT up to date
-----------------------------------

This packaging may still be a little rough and raw.

In particular, it may be a Good Idea to use Git submodules
and `pip install -e` to set things up.

Try it out
----------

(Set up a virtualenv first, naturally.)

```
pip install -r requirements.txt
(cd infotv/frontend && npm i && npm run build)
(python manage.py migrate && python manage.py runserver)
```

Notes for deployment
--------------------

* Use `npm run release` instead of `npm run build`
  when deploying.  Otherwise your bandwidth will be sad.
* The `infotv_cache_weather` management command should be run
  periodically to cache weather data (if required).
  You'll need an API key from OpenWeatherMap for that.

Notes of other persuasions
--------------------------

* The `anime`, `nownext` and `social` slides assume that the server
  hosting the app also serves the Desucon.fi API.  This will likely
  not be the case for you, dear reader.
* The frontend supports these query string parameters:
  * `?edit=1` -- edit slides
  * `?only=slideclass` -- show only a slide of class `slideclass`
  * `?slow=1` -- disable transitions (for poor ol' Raspberry Pis)
  * `?loc=location` -- show only the `location` location on `nownext`
    slides (useful for room-specific schedule displays)
* Setting the environment variable `INFOTV_STYLE` to something other than
  the implicit "desucon" makes the Webpack build process read styles
  from another `styles/...` subdirectory when creating the bundle.

Settings
--------

* `INFOTV_POLICY_CLASS`:
  A dotted path to a class that declares certain
  authentication and lookup policies (see `infotv.policy`)
* `INFOTV_EVENT_MODEL`:
  A dotted path to the model for "events" (if the default policy is used).
  If None, no actual DB lookup is done for events.
* `INFOTV_EVENT_SLUG_ATTR`:
  The name of a "slug"/unique-identifier attribute in the event model above
  (if the default policy is used).  Defaults to `slug`.

Running tests
-------------

```
pip install -r requirements_dev.txt
python runtests.py
```
