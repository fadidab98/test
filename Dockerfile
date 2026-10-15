FROM node:20-bookworm-slim AS build
WORKDIR /app
COPY package*.json ./
COPY packages ./packages
COPY apps ./apps
COPY config ./config
COPY tools ./tools
COPY tests ./tests
COPY scenarios ./scenarios
RUN npm ci --ignore-scripts
# Success profile is required for a deployable image; CI benchmark remains build-config by default.
RUN npm run scenario -- success && npm run build && npm test
FROM node:20-bookworm-slim AS production
ENV NODE_ENV=production PORT=8080
WORKDIR /app
COPY --from=build /app /app
USER node
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s CMD node -e "fetch('http://127.0.0.1:8080/health/ready').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "apps/api/src/main.mjs"]
