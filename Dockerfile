FROM node:8-alpine

WORKDIR /usr/app

COPY package.json .
RUN npm install --quiet
COPY . .

RUN npm test

CMD node app.js