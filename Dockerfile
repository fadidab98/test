FROM node:22-alpine
WORKDIR /app
COPY nonexistent-directory /app/src
