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


Setting up a production instance
------------------------------
(modified from: https://www.digitalocean.com/community/tutorials/how-to-serve-django-applications-with-apache-and-mod_wsgi-on-ubuntu-14-04)


* First set up a development instance and test that it is working

* Then generate a new random SECRET_KEY value and replace the one in

```
/infotvpath/infotv/infotv_prod/settings.py

```

run a release build:
```
INFOTV_STYLE=ropecon npm run release	
```

instal apache etc.:

```
sudo apt-get update
sudo apt-get install python3-pip apache2 libapache2-mod-wsgi-py3
```

edit the default virtual host file:

```
sudo nano /etc/apache2/sites-available/000-default.conf
```

Add the following settings:
(Replace the infotvpath with a directory path you have installed the development instance in!)

```
<VirtualHost *:80>
    . . .

    Alias /static /infotvpath/infotv/static
    <Directory /infotvpath/infotv/static>
        Require all granted
    </Directory>

    <Directory /infotvpath/infotv/infotv_prod>
        <Files wsgi.py>
            Require all granted
        </Files>
    </Directory>

    WSGIDaemonProcess myproject python-path=/infotvpath/infotv:/infotvpath/venv-infotv/lib/python2.7/site-packages
    WSGIProcessGroup infotv
    WSGIScriptAlias / /infotvpath/infotv/infotv_prod/wsgi.py

</VirtualHost>

```

Fix permissions for apache:
```
chmod 664 ~/infotvpath/infotv/db.sqlite3
sudo chown :www-data ~/infotvpath/infotv/db.sqlite3
sudo chown :www-data ~/infotvpath/infotv
```

Restart apache:
```
sudo service apache2 restart
```

