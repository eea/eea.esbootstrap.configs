#!/bin/sh
set -e

if [[ "${DEV_ENV:-false}" == "true" ]] ; then
    cd /code/config


    if [ -d ".git" ]; then
       git pull
    else
       git clone $github_repo . --depth=5
    fi 
    #on commit ignore the permission changes
    git config core.filemode false

    #permissions are needed because the nodejs app needs to be able to
    #create new folders and copy existing ones
    chmod 777 /code/config
    chmod -R 775 /code/config/*
else
    #if production mode, use the configs that are inside the image
    rm -rf /code/config/*
    cp /config -R /code/
fi
