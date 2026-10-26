# Scenario reference (reviewer only)

- 01: Missing npm lockfile — DEPENDENCY_FAILURE — `npm ci`
- 02: Dependency local path does not exist — DEPENDENCY_FAILURE — `npm install --ignore-scripts --no-audit --no-fund`
- 03: Node engine incompatible — RUNTIME_MISMATCH — `npm ci`
- 04: Missing build entry script — BUILD_CONFIGURATION_FAILURE — `npm run build`
- 05: Invalid build command option — BUILD_CONFIGURATION_FAILURE — `npm run build`
- 06: Syntax error in source — COMPILATION_FAILURE — `npm run build`
- 07: Broken static module import — COMPILATION_FAILURE — `npm run build`
- 08: Test runner file missing — TEST_CONFIGURATION_FAILURE — `npm test`
- 09: Invalid test runner option — TEST_CONFIGURATION_FAILURE — `npm test`
- 10: Docker COPY source missing — CONTAINER_CONFIGURATION_FAILURE — `docker build --progress=plain -t devops-error-lab:case-10 .`
- 11: Unknown Dockerfile instruction — CONTAINER_CONFIGURATION_FAILURE — `docker build --progress=plain -t devops-error-lab:case-11 .`
- 12: Invalid npm lockfile JSON — DEPENDENCY_FAILURE — `npm ci`
- 13: Malformed package manifest JSON — BUILD_CONFIGURATION_FAILURE — `npm run build`
- 14: Imported named export does not exist — COMPILATION_FAILURE — `npm run build`
- 15: Test fixture file missing — TEST_CONFIGURATION_FAILURE — `npm test`
- 16: Circular Docker build-stage dependency — CONTAINER_CONFIGURATION_FAILURE — `docker build --progress=plain -t devops-error-lab:case-16 .`
