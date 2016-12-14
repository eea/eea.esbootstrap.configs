#!/bin/sh
set -e

if [[ "${DEV_ENV:-false}" == "true" ]] ; then
    cd /code/config
    if [ -d ".git" ]; then
       git pull
    else
       git clone $github_repo . --depth=5
    fi 
fi
chmod 777 /code/config
chmod -R 775 /code/config/*
