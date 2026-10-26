FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY src ./src
COPY scripts ./scripts
COPY test ./test
RUN npm test && npm run build
CMD ["node", "dist/main.js"]
