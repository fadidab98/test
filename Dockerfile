FROM node:20-alpine AS dependencies
WORKDIR /workspace
COPY package*.json ./
RUN npm ci
FROM dependencies AS build_assets
COPY . .
RUN npm run build
FROM node:20-alpine AS runtime
WORKDIR /app
# This stage name differs from the build stage actually declared.
COPY --from=compile_assets /workspace/src ./src
COPY --from=compile_assets /workspace/package.json ./package.json
CMD ["node", "src/index.js"]
