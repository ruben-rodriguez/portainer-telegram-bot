#!/bin/bash

# Example use 
#  sudo ./scripts/docker-build.sh "-e BOT_TOKEN=abc -e TELEGRAM_USERS=efg"

# Stop any running containers
docker stop portainer-telegram-bot

# Remove container
docker rm portainer-telegram-bot

# Remove old image
docker rmi ermus19/portainer-telegram-bot:latest

# Build image with Dockerfile
docker build --no-cache -t ermus19/portainer-telegram-bot:latest . 

# Run container from image
docker run -d -it --network="host" --name=portainer-telegram-bot $1 ermus19/portainer-telegram-bot:latest
