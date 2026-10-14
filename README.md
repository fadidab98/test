# Containerized invoice-processing service

Multi-stage Dockerfile, service modules, stage checker and integration tests. The Dockerfile COPY --from stage does not exist. The test checks container configuration without needing Docker daemon or image downloads.

## Platform use

1. Upload the files in this directory to a separate GitHub repository.
2. Choose **Build and test**, **All detected tests**, **Strict lockfile install**, Node 20; Docker build is optional and not required for detection.
3. The app deliberately contains ONE root-cause defect; keep it unchanged during initial classification experiments.
4. Run `npm ci`, `npm run build`, `npm test` locally to reproduce.

No external npm dependencies. There are successful unit tests and a targeted failing integration/configuration test. No credentials or external network access required.

**Research note:** A deliberately constructed fixture is not an independent accuracy benchmark.
