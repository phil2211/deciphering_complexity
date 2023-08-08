# Dockerfile for the React frontend
FROM node:latest

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY public ./public
COPY src ./src

EXPOSE 3000

CMD ["npm", "start"]
