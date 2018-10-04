#!/bin/bash

# Stop any running containers
docker stop portainer-telegram-bot

# Remove container
docker rm portainer-telegram-bot

# Remove old image
docker rmi ermus19/portainer-telegram-bot:latest

# Build image with Dockerfile
docker build -t ermus19/portainer-telegram-bot:latest . 

# Run container from image
docker run -d -it --name=portainer-telegram-bot -e BOT_TOKEN=$1 ermus19/portainer-telegram-bot:latest
