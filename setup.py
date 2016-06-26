# -- encoding: UTF-8 --
#!/usr/bin/env python

import os
from setuptools import setup

def requirements(filename):
    with open(os.path.abspath(os.path.join(os.path.dirname(__file__), filename))) as f:
        lines = (line.strip() for line in f)
        return [line for line in lines if line and not line.startswith("#")]

setup(
    name="infotv",
    version="0.2.0",
    description="A television, with information",
    author="Aarni Koskela",
    author_email="akx@iki.fi",
    url="https://github.com/kcsry/infotv",
    packages=["infotv", "infotv.migrations"],
    package_data={"infotv": ["static/infotv/*"]},
    include_package_data=True,
    zip_safe=False,
    install_requires=requirements("requirements.txt"),
    tests_require=requirements("requirements_dev.txt"),
)
