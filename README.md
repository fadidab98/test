# React + Vite ML Failure Lab — 18 controlled scenarios

This is a **dedicated Git repository for controlled, real React pipeline failures**, not the DevOps platform source. Each activated scenario targets exactly one failure type, with a real failing `npm ci`, `npm test`, `npm run build` or optional Docker build. The scenario's expected label is **not ground truth** until a human checks actual Runner evidence.

## Baseline and repository setup

1. Extract `react-ml-failure-lab/` into a **new, separate** test GitHub repository root.
2. Commit/push on the branch configured in the platform. Use Node 20 in the Runner.
3. The baseline uses **real React 18 + ReactDOM + Vite 5 + TypeScript**. The included `package-lock.json` is pinned from dependency metadata of the existing project. Dependencies are fetched from the public npm registry on first install: an accessible registry is required for the passing control (unlike our vendored TypeScript-only Node lab). Confirm baseline before injecting failures.

```bash
node tools/activate-scenario.mjs --reset
npm ci
npm test
npm run build
node tools/activate-scenario.mjs --list
```

If tests/build do not pass at baseline, STOP and fix the passing control first. Do not submit failed installation due to internet access as an intended compilation/test scenario.

```bash
# New repository only (skip these if Git is already initialized)
git init
git branch -M main
git remote add origin https://github.com/YOUR_ACCOUNT/react-ml-failure-lab.git

git add -A
git commit -m "test: react baseline"
git push -u origin main
```

## Why Repository Intelligence should detect tests

`package.json` contains both `react` and `react-dom`, so it should detect the **REACT** framework. `tests/GreetingCard.test.js` is a genuine Node unit test for a React component rendered with `react-dom/server`. The `test` script in `package.json` enables **NODE_UNIT** detection. `npm test` exits immediately; it will not hang in watch mode.

Expected baseline platform steps: `node-install` (`npm ci`), `node-test` (`npm test`), `node-build` (`npm run build`). Depending on platform pipeline composition, you may need to enable the build/test steps manually and **regenerate the plan**. Docker Build scenarios additionally require `docker-build` and a working Docker builder.

## Each scenario

```bash
node tools/activate-scenario.mjs r01-ts2322-react-props
git add -A
git commit -m "test: r01-ts2322-react-props"
git push
```

Then re-analyze the pushed commit or refresh the locked Pipeline Plan, execute a **new Runner pipeline**, inspect the actual failed stage/logs, and verify the correct Failure Category as moderator. **No review notes required by the UI if optional**, but preserving the commit SHA and scenario ID separately is useful for research.

For next experiment, directly activate next scenario; the activator restores all lab-owned files first. Do not run `--reset` after each scenario unless you need a passing baseline.

## Experiments

| ID | Expected classification (NOT VERIFIED) | Required step | Characteristic real diagnostic |
|---|---|---|---|
| `r01-ts2322-react-props` | `COMPILATION_FAILURE` | `node-build` | TS2322: number assigned a string in React TSX |
| `r02-ts2307-missing-component` | `COMPILATION_FAILURE` | `node-build` | TS2307: missing imported React component |
| `r03-ts2345-invalid-argument` | `COMPILATION_FAILURE` | `node-build` | TS2345: invalid function argument |
| `r04-ts7006-implicit-any` | `COMPILATION_FAILURE` | `node-build` | TS7006: implicit any in component helper |
| `r05-ts2588-const-assignment` | `COMPILATION_FAILURE` | `node-build` | TS2588: reassignment to const |
| `r06-vite-missing-entry` | `BUILD_CONFIGURATION_FAILURE` | `node-build` | Vite cannot resolve missing entry module |
| `r07-build-missing-tsconfig` | `BUILD_CONFIGURATION_FAILURE` | `node-build` | TS5058: referenced tsconfig does not exist |
| `r08-build-missing-script` | `BUILD_CONFIGURATION_FAILURE` | `node-build` | npm cannot find build:release script |
| `r09-test-invalid-json` | `TEST_CONFIGURATION_FAILURE` | `node-test` | Invalid JSON in tests/test-settings.json |
| `r10-test-missing-file` | `TEST_CONFIGURATION_FAILURE` | `node-test` | Configured test file does not exist |
| `r11-npm-missing-artifact` | `DEPENDENCY_FAILURE` | `node-install` | npm ENOENT local tarball missing |
| `r12-npm-integrity` | `DEPENDENCY_FAILURE` | `node-install` | npm EINTEGRITY react archive checksum mismatch |
| `r13-registry-refused` | `NETWORK_OR_REGISTRY_FAILURE` | `node-install` | npm ECONNREFUSED runner-local artifact endpoint |
| `r14-docker-missing-copy` | `CONTAINER_CONFIGURATION_FAILURE` | `docker-build` | Docker COPY path absent |
| `r15-docker-invalid-command` | `CONTAINER_CONFIGURATION_FAILURE` | `docker-build` | Invalid Dockerfile directive |
| `r16-build-tool-node22` | `RUNTIME_MISMATCH` | `node-build` | React build tool requires Node 22; Runner uses Node 20 |
| `r17-test-unsupported-runner` | `TEST_CONFIGURATION_FAILURE` | `node-test` | Unsupported runner configured: jest instead of node:test |
| `r18-vite-broken-config-import` | `BUILD_CONFIGURATION_FAILURE` | `node-build` | Vite config import refers to nonexistent local module |


## Research and safety boundaries

- These are deliberately induced errors (`CONTROLLED_INDUCED`); the JSON file is local operator metadata **not automatically recorded** by the platform. If the dataset lacks provenance/scenario-group fields, do not claim they were stored. Do not treat related synthetic examples as independent generalization evidence.
- If a scenario unexpectedly passes, verify the fresh Git commit, selected Runner stage, and plan before labeling it. Never verify a label from the scenario name alone.
- Build scenarios: tests pass, build fails. Test configuration scenarios: install passes, test fails. Dependency/network scenarios: install fails. Container scenarios: normal Node steps pass, Docker build fails if selected. Runtime scenario r16: Node engines remain compatible; only the build tool checks Node >=22 inside the Node-20 runner.
- The Docker scenarios require an actual builder. Do not force a Docker error from another step.
- `--reset` only resets lab-owned package/config files and removes scenario Dockerfile. It does not touch `.git`, node_modules, README, or unrelated files.
- Always keep the original experimental ML model version unchanged. Use new verified samples for later separate-version model training. For future ML-vs-RAG comparison, withhold related experiment groups from the evaluation set and RAG retrieval to avoid leakage.
