FROM node:22-alpine AS build
COPY --from=build /app/dist /app/dist
