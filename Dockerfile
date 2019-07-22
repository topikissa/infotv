# parent image
FROM ubuntu:bionic

# Set the working directory
RUN mkdir /telkkukelkku
WORKDIR /telkkukelkku

# install required packages
RUN apt update && apt install -y nodejs npm virtualenv python3-pip apache2 libapache2-mod-wsgi-py3 libpq-dev

# symlink python interpreter and pip tuo python 3 versions
RUN rm /usr/bin/python && ln -s /usr/bin/python3 /usr/bin/python && ln -s /usr/bin/pip3 /usr/bin/pip

# creating virtual python enviroment
# activating the virtual enviroment
#RUN virtualenv venv-infotv && source venv-infotv/bin/activate

# update pip
RUN pip install --upgrade pip 

RUN pip install psycopg2

# Copy the current directory contents into the container 
COPY infotv /telkkukelkku/infotv
COPY infotv_prod /telkkukelkku/infotv_prod
COPY manage.py /telkkukelkku
COPY requirements.txt /telkkukelkku
COPY requirements_dev.txt /telkkukelkku
COPY setup.cfg /telkkukelkku
COPY setup.py /telkkukelkku

# Install any needed packages specified in the app
RUN pip install -e .

# enable apache ssl module
#RUN a2enmod ssl
# copy apache virtual host configuration into the container
COPY ./docker/prod_site.conf /etc/apache2/sites-available/000-default.conf
#COPY ./docker/telkkutesti.crt /etc/apache2/ssl/telkkutesti.crt
#COPY ./docker/telkkutesti.key /etc/apache2/ssl/telkkutesti.key


# initialize the application
WORKDIR /telkkukelkku/infotv/frontend
RUN npm install
RUN INFOTV_STYLE=ropecon npm run release
WORKDIR /telkkukelkku
# TODO The following initialization commands need to be run manually in the container bash shell after the container is first started
#RUN python manage.py migrate --no-input
#RUN python manage.py createsuperuser --username staff --email staff@localhost

#Fix permissions for apache:
RUN chown :www-data /telkkukelkku/infotv

# Make port available to the world outside this container
EXPOSE 80
#EXPOSE 443

# Start the apache server when the container launches
#CMD ["service", "apache2", "restart"]
CMD ["apache2ctl", "-D", "FOREGROUND"]

