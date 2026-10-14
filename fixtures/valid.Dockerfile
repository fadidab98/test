FROM node:20-alpine AS builder
RUN mkdir -p /stage
FROM node:20-alpine AS runtime
COPY --from=builder /stage /app
