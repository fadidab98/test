# Aegis Enterprise — High-Complexity CI/CD & RAG Classification Stress Lab

**A real, executable Node.js 20 enterprise-style monorepo with 11 workspaces, 96 automated tests, a live API and browser dashboard, modular application architecture, Docker/Kubernetes/CI manifests, and 7 deterministic test profiles.**

This is a **benchmark/demo**, not an actual financial platform. The sample is intentionally designed to include controlled failures, not to imitate production-scale load. Payments and notifications are simulated. There is no external database, payment account, API key or cloud requirement. All runtime features are built on Node.js 20 standard APIs for fast, reliable `npm ci`.

## Quick start — default intentionally fails

```bash
node --version      # use Node 20.x or 22.x
npm ci
npm run build       # EXPECTED FAILURE: build configuration error (by design)
```

The first experiment should be a `BUILD_CONFIGURATION_FAILURE`, different from the previous JSX compiler test.

## Switch failure and push to Git

```bash
npm run scenario -- compilation    # or dependency, runtime, test, test-config, success
npm run build
# Commit config/scenario.json and push to your Git repository before running remote CI
```

| Scenario | Build result | Test result | Expected classification |
|---|---|---|---|
| `build-config` (default) | FAIL | independent | BUILD_CONFIGURATION_FAILURE |
| `compilation` | FAIL | independent | COMPILATION_FAILURE |
| `dependency` | FAIL | independent | DEPENDENCY_FAILURE |
| `runtime` | FAIL | independent | RUNTIME_MISMATCH |
| `test` | PASS | FAIL | TEST_FAILURE |
| `test-config` | PASS | FAIL | TEST_CONFIGURATION_FAILURE |
| `success` | PASS | PASS | No incident |

Your DevOps platform must run an `npm test` step after the build to exercise test-related scenarios. The build-related scenarios work with just `npm ci` + `npm run build`.

## Normal working application

```bash
npm run scenario -- success
npm ci
npm run lint
npm run build
npm test
npm run smoke
npm start
```

Open <http://localhost:8080> — the Operations Center is a responsive working dashboard.

## Modules

| Workspace | Responsibility |
|---|---|
| `packages/contracts` | Domain contracts and error semantics |
| `packages/domain` | Money, inventory, pricing, order state machine, fraud policies |
| `packages/security` | Signed tokens, role grants, rate limiting, log redaction |
| `packages/persistence` | Versioned repository, hash-chain journal, TTL cache |
| `packages/messaging` | Async bus with retries, DLQ, transactional outbox |
| `packages/observability` | Tracing, structured logs, counters, p50/p95 |
| `packages/workflows` | Payment auth + fulfillment saga + compensation |
| `packages/analytics` | Aggregations, SLO and anomalies |
| `apps/api` | HTTP router, tenant security, REST API |
| `apps/worker` | Background notification processor |
| `apps/dashboard` | Live inventory/order/metrics UI |

Read [Architecture](docs/ARCHITECTURE.md), [Failure Matrix](docs/FAILURE-MATRIX.md), and [Arabic Quick Start](docs/QUICKSTART_AR.md).

## Import to the AI/ML DevOps platform

If your platform analyzes a **remote Git URL**, it cannot clone this ZIP directly. Extract the folder, create a new GitHub/GitLab repository, commit everything **including `package-lock.json`**, push, then enter its Git clone URL into your platform's Create Project screen. The default failure scenario is already committed in `config/scenario.json` once you push it.

```bash
git init
git add .
git commit -m "Add Aegis reproducible CI benchmark"
git branch -M main
git remote add origin https://github.com/YOUR-USER/YOUR-REPO.git
git push -u origin main
```

Do not select the synthetic ZIP as a URL. The `.git` directory is not included.

## Docker versus CI benchmark

The Dockerfile explicitly selects `success` during its image build so the dashboard can be deployed and demonstrated. The repository's default scenario is deliberately `build-config` and **fails under `npm run build`** in your DevOps platform. This difference is intentional.

## Verification

The ZIP includes all source, test, infrastructure and package-lock files. The `node_modules` and `dist` folders are intentionally excluded. `npm ci` links the workspaces using local npm metadata, with **no external dependency packages** required.

## Reproducibility notes

- First failure is **deliberate**; do not repair it unless switching to `success`.
- Ground truth in the failure matrix is guidance for reviewers, **not fed to the model by this project**.
- The platform may interpret categories differently based on its taxonomy version. Inspect the raw stderr and use Moderator verification.
- The Kubernetes example uses multiple replicas of an **in-memory demo**, therefore provides no shared persistence and is not suitable for production.
