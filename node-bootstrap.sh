#!/usr/bin/env bash

# Get root up in here
sudo su

# Just a simple way of checking if we need to install everything
if [ ! -d "/var/www" ]
then
    # Add MongoDB to apt
    apt-key adv --keyserver keyserver.ubuntu.com --recv 7F0CEB10
    echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/10gen.list

    # Update and begin installing some utility tools
    apt-get -y update
    apt-get install -y python-software-properties
    apt-get install -y vim git subversion curl
    apt-get install -y memcached build-essential

    # Add nodejs repo
    add-apt-repository -y ppa:chris-lea/node.js
    apt-get -y update

    # Install nodejs
    apt-get install -y nodejs
    apt-get install -y npm


    # Install latest stable version of MongoDB
    apt-get install -y mongodb-10gen

    # Symlink our host www to the guest /var/www folder
    ln -s /vagrant/www /var/www

    npm -g install bower --no-bin-links
    npm -g install grunt --no-bin-links
    npm -g install express
    npm -g install socket.io
    npm -g install mongoose

    # This is necessary to start a mongodb server
    sudo mkdir -p /data/db

    # Victory!
    echo "You're all done! Your default node server should now be listening on http://10.0.33.34/. For code, see: node-mongo-vagrant/www/default/server.js."

    # Run it
    node /var/www/default/app.js
fi

# Install basic stuff
# apt-get -y update
# apt-get install -y python-software-properties python g++ make python-software-properties
# echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/mongodb.list
# sudo apt-get update
# sudo apt-get install mongodb-org
# apt-get install mongodb-org=2.6.1 mongodb-org-server=2.6.1 mongodb-org-shell=2.6.1 mongodb-org-mongos=2.6.1 mongodb-org-tools=2.6.1
# sudo service mongod start
# sudo chkconfig mongod on

# # Add repositories with current versions
# sudo add-apt-repository -y ppa:Iawhite76/node-express-socket.io-weather-app
# apt-get -y update

# # Install nodejs related stuff

# apt-get install -y nodejs
# apt-get install -y npm

# # Install npm dependencies

# npm -g install bower --no-bin-links
# npm -g install grunt --no-bin-links
# npm -g install express
# npm -g install socket.io
# npm -g install mongoose

