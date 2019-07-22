Telkku-Kelkku - Ropecon infoTV
==============================



Telkku-Kelkku is a fork of Desucon infotv for use in Ropecon 2016. Specific differences are adaptation to a the conbase API for programme data and the Ropecon specific styling. Additionally we have implemented a new slide type for displaying programme changes.


Setting up a development instance
---------------------------------

prerequisites:
At least the following packages are required on Ubuntu 16.04 system:
nodejs-legacy npm virtualenv python-pip git

(note. also nodejs package should be at least version 4+, this is not the case of versions in for example Ubuntu 14.04 repositories)

installation steps:

```
virtualenv venv-infotv			# creating virtual python enviroment
source venv-infotv/bin/activate		# activating the virtual enviroment
git clone https://github.com/topikissa/infotv.git
cd infotv/
pip install -e .
cd infotv/frontend 
npm install
INFOTV_STYLE=ropecon npm run build
cd ../..
python manage.py migrate
python manage.py createsuperuser  	# create user "staff", needed for editing slides
```

Using the tv
------------

```
python manage.py runserver		#start the server
```
```
127.0.0.1:8000/admin/  			# login ass user "staff"
127.0.0.1:8000/con2016/infotv   	#  tv-view
127.0.0.1:8000/con2016/infotv?edit=1  	#  editing the slides after logging as user "staff"
```


Other queryparameter options:
* `?only=slideclass` -- show only a slide of class `slideclass`
* `?slow=1` -- disable transitions (for poor ol' Raspberry Pis)
* `?loc=location` -- show only the `location` location on `nownext` slides (useful for room-specific schedule displays)

Note that the text slide editor uses Markdown syntax (https://en.wikipedia.org/wiki/Markdown).


Setting up a production instance
------------------------------
This will set up a dockerized instance of the django application listening on the port 65288. Setting up virtual hosts, port mapping, tls termination, etc. is outside the scope of these instructions

(Note that the Kompassi programme api CORS settings require the application to be run on standard ports - 80 or 443.)

* update manage.py file to point to infotv_prod settings

* Then generate a new random SECRET_KEY value and replace the one in

```
/infotvpath/infotv/infotv_prod/settings.py

```

build the docker image:
```
cd infotvpath
sudo docker-compose build
```

start the container for the first time and perform manual configuration (needed only once)

```
sudo docker-compose up -d
sudo docket container ls  # note the container ID
sudo docker exec -it [container ID] bash
```

run the following commands inside the container


```
python manage.py migrate --no-input
python manage.py createsuperuser --username staff --email staff@localhost  # create user "staff", needed for editing slides

```

Restart the container

```
sudo docker-compose down
sudo docker-compose up -d
```


