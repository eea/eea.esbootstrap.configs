#!/bin/sh
cd /code/config
if [ -d ".git" ]; then
   git pull
else
   git clone $github_repo .
fi 
chmod 777 /code/config
chmod -R 775 /code/config/*
