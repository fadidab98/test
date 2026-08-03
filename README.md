# CI/CD Platform Demo Repository

Small repository for testing the CI/CD Automation Platform.

It intentionally contains:

- Node.js project at repository root
- npm lockfile after `npm install --package-lock-only`
- Node test script using the built-in test runner
- Root Dockerfile
- Nested Dockerfiles for Docker build candidate detection
- docker-compose.yml with service build contexts

Useful platform test choices:

- Build/test only: should run `npm ci`, `npm test`, and `npm run build`
- Docker build root app: `Dockerfile`, context `.`
- Docker build web service: `apps/web/Dockerfile`, context `apps/web`
- Docker build api service: `services/api/Dockerfile`, context `services/api`
# test
