# DevOps ML Failure Lab — One GitHub Repository

A self-contained Node.js test repository for **actual, intentionally induced** CI/CD failures in the project's Runner. One active scenario at a time. It is **not** part of the production `apps/ml-service`; create/upload a *separate small GitHub repository* for test inputs, or replace the contents of an existing **dedicated test repository**. Never overwrite your DevOps platform repository.

## Quick start (Git Bash)

1. Unzip this folder; put its **contents at the root** of your dedicated GitHub test repository (do not leave a nested `devops-ml-failure-lab/` folder).
2. From the test repository root, establish the control:
   ```bash
   node tools/activate-scenario.mjs --reset
   npm ci
   npm test
   npm run build
   git add -A && git commit -m "test: baseline" && git push
   ```
3. List the scenario IDs:
   ```bash
   node tools/activate-scenario.mjs --list
   ```
4. Start with this **non-Docker, installation-stage** failure:
   ```bash
   node tools/activate-scenario.mjs dependency-no-lockfile
   git add -A && git commit -m "test: dependency-no-lockfile" && git push
   ```
5. In **your DevOps platform**: (re)analyze the repository **after the push**, compose/choose the required templates, execute a **new** pipeline, review logs and the actual root cause, then use **moderator verification** for the label. Confirm the record in `/api/ml/dataset` and the Streamlit dashboard.
6. Activate the next scenario and repeat. Each activation reverts all previous faults to baseline **before** applying the selected fault. A single ZIP upload without activation only gives the passing baseline.

## Why package-lock.json is supplied

The platform Node Install step runs `npm ci` (not `npm install`). A correct lockfile is mandatory for baseline, test, build, and Docker scenarios. Only lockfile-specific scenarios intentionally break it. This ensures the error you intended is the error reached by the Runner.

## Scenario table

| ID | Target label | Stage | Caution |
|---|---|---|---|
| `runtime-node24-engine` | RUNTIME_MISMATCH | node-install | Requires older Node selected. Platform preflight may reject unsupported Node 24 requirements before the runner executes. |
| `runtime-openssl-md4` | RUNTIME_MISMATCH | node-build | Reproduces OpenSSL unsupported MD4. |
| `dependency-no-lockfile` | DEPENDENCY_FAILURE | node-install | npm ci EUSAGE. |
| `dependency-stale-lockfile` | DEPENDENCY_FAILURE | node-install | npm ci rejects unsynced lockfile. |
| `dependency-missing-module` | DEPENDENCY_FAILURE | node-build | Runtime import missing; review taxonomy. |
| `build-missing-nested-script` | BUILD_CONFIGURATION_FAILURE | node-build | `npm run build` calls absent script. |
| `build-wrong-entrypoint` | BUILD_CONFIGURATION_FAILURE | node-build | Build points to a nonexistent repository file. |
| `test-missing-suite` | TEST_CONFIGURATION_FAILURE | node-test | Misconfigured test file path. |
| `test-invalid-runner-flag` | TEST_CONFIGURATION_FAILURE | node-test | Invalid Node test runner option. |
| `compilation-syntax-token` | COMPILATION_FAILURE | node-build | Real source syntax error. |
| `compilation-unclosed-source` | COMPILATION_FAILURE | node-build | Different real parser error. |
| `network-unreachable-package` | NETWORK_OR_REGISTRY_FAILURE | node-install | npm fetches a tarball at **127.0.0.1:9 inside runner**, which is intentionally unreachable. Does not test a real public outage. |
| `container-missing-copy` | CONTAINER_CONFIGURATION_FAILURE | docker-build | You must **enable Docker Build** and have a working Docker builder; `FROM scratch` prevents a base image pull. |

## Pipeline routing

- Repository Intelligence detects `package.json`, NPM, `tests/app.test.js` and test/build scripts.
- Ensure template composition **includes `node-install-template`, `node-test-template`, `node-build-template` as appropriate**. If a template isn't selected, a fault in that stage will never execute. No Dockerfile exists except in the container scenario.
- Docker builds are optional. The container scenario **will not** fail at the container stage unless that template is explicitly enabled and a Docker builder is available.
- The build step **follows** tests in the platform's default ordering, so test failures take precedence; these scenarios leave the test baseline healthy unless explicitly testing test setup.

## ML data integrity / provenance

Each new push creates a **real runner event** but the failure is **CONTROLLED_INDUCED**, not a natural production incident. In moderator review, record the scenario ID, git commit SHA, actual diagnostic lines, chosen execution environment, and factual explanation. `experiment.json` documents the intended scenario **for humans**; the platform does **not automatically ingest it as verified provenance**.

A new run, a repeated commit, or a second fingerprint does not automatically create an independent training example. Do **not** count reruns of the same fault as new independent samples. Do not pass `expected_category` or reviewer notes into model features; they are labels/explanations, not pre-failure signals. Similar errors from this same repository must be grouped for evaluation. Do not use the original holdout as a new independent test after inspecting it.

### Local quick verification

```bash
npm ci && npm test && npm run build  # success in baseline
node tools/activate-scenario.mjs compilation-syntax-token
npm ci && npm test && npm run build  # build should fail from source syntax
node tools/activate-scenario.mjs --reset
```

### Troubleshooting

- Pipeline fails during `node-install` for a build scenario: check lockfile and `npm ci` log; reset and activate the correct scenario.
- Expected Node mismatch doesn't reach the runner: the platform may select Node 22 or block Node >=24 before execution. Do not label a preflight rejection as an observed runner failure.
- You see only successful install/test: ensure `node-build-template` is present in the pipeline.
- GitHub UI uploads files without executing scripts. Locally activate first, then push the modified files to the same remote branch used by your platform.
