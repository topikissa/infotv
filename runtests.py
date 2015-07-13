# -- encoding: UTF-8 --
import pytest, sys, os
sys.path.insert(0, os.path.dirname(__file__))
if len(sys.argv) == 1:
    sys.argv[1:] = ["--cov", "infotv", "--cov-report", "html", "infotv/tests"]

pytest.main()
