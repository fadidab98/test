# Node.js + TypeScript ML Dataset Lab (scenario switcher)

A **dedicated test repository** for intentionally induced real Runner failures. This is **not** the DevOps platform source repository and must not be extracted over it. Work through **all Node scenarios first**, then move on to a separate React lab and later a Spring Boot lab.

**16 independent failure scenarios + 1 passing baseline**, selected with `node tools/activate-scenario.mjs`. Activating any scenario first resets previously modified, lab-owned files to baseline. One failure is active per Git commit/pipeline run.

## Setup — Windows Git Bash

1. Extract the ZIP. Open the `node-ml-failure-lab` directory, or copy **its contents** into the root of a **dedicated GitHub test repository** (not a subfolder). The directory should contain `package.json`, `package-lock.json`, `src/`, `tests/`, `tools/`, `scenarios/`, and `vendor/`.
2. Connect the test repository to your own GitHub remote (for a new repository):

   ```bash
   git init
   git branch -M main
   git remote add origin https://github.com/YOUR_ACCOUNT/YOUR_TEST_REPO.git
   ```

   If using your existing dedicated Node test repository, use its current branch and remote; do **not** repeat `git init` or change its remote. Back up unrelated test files before replacing them.
3. Start with a passing control:

   ```bash
   node tools/activate-scenario.mjs --reset
   npm ci
   npm test
   npm run build
   git add -A
   git commit -m "test: node baseline"
   git push -u origin main  # first push ONLY for a new main branch
   ```

4. List all experiments: `node tools/activate-scenario.mjs --list`.
5. Activate the first failure:

   ```bash
   node tools/activate-scenario.mjs n01-ts2322
   git add -A
   git commit -m "test: n01-ts2322"
   git push                       # normal pushes after upstream is set
   ```

6. In your DevOps platform: ensure **repository URL and branch** match the pushed test repository; **re-analyze** if the platform caches repository fingerprints/plans; select `node-install`, `node-test`, and **`node-build`** stages (names may vary in your deployment); launch a **new pipeline run**. Confirm the actual failure stage and the redacted diagnostic log (e.g. `TS2322`), then review the classifier's proposed category and verify the label as a moderator **only when supported by evidence**.
7. For the next case, run `node tools/activate-scenario.mjs n02-ts2307`, commit, push, and start a fresh pipeline. You do **not** need to manually reset between scenarios: activation always resets first. `--reset` returns to the passing baseline after the final scenario.

**Important:** pushing the project to GitHub does **not** create dataset samples. A sample requires a real failed Runner execution, persisted Incident and evidence, and an explicitly reviewed category. `experiment.json` records the *expected* answer for the experiment operator; it is not a verified category in the ML dataset.

## Scenarios (run in order; all Node.js/TypeScript)

| ID | Expected category (not verified) | Expected stage | Real diagnostic |
|---|---|---|---|
| `n01-ts2322` | COMPILATION_FAILURE | node-build | `TS2322` incorrect variable type |
| `n02-ts2307` | COMPILATION_FAILURE | node-build | `TS2307` nonexistent local import |
| `n03-ts2345` | COMPILATION_FAILURE | node-build | `TS2345` invalid function argument type |
| `n04-ts7006` | COMPILATION_FAILURE | node-build | `TS7006` implicit any in strict mode |
| `n05-npm-integrity` | DEPENDENCY_FAILURE | node-install | npm `EINTEGRITY` wrong lockfile checksum |
| `n06-npm-missing-tarball` | DEPENDENCY_FAILURE | node-install | npm `ENOENT` missing local package artifact |
| `n07-runtime-engine` | RUNTIME_MISMATCH | node-install | npm `EBADENGINE` requires Node 24 (select Node 20) |
| `n08-build-missing-tsconfig` | BUILD_CONFIGURATION_FAILURE | node-build | `TS5058` nonexistent tsconfig |
| `n09-build-missing-script` | BUILD_CONFIGURATION_FAILURE | node-build | npm missing `build:release` script |
| `n10-test-invalid-json` | TEST_CONFIGURATION_FAILURE | node-test | malformed runner configuration JSON |
| `n11-test-missing-file` | TEST_CONFIGURATION_FAILURE | node-test | missing configured test suite |
| `n12-registry-connection-refused` | NETWORK_OR_REGISTRY_FAILURE | node-install | npm `ECONNREFUSED` to runner-local `127.0.0.1:9` |
| `n13-docker-missing-copy` | CONTAINER_CONFIGURATION_FAILURE | docker-build | `Dockerfile` COPY path missing |
| `n14-docker-invalid-directive` | CONTAINER_CONFIGURATION_FAILURE | docker-build | unknown Dockerfile instruction |
| `n15-ts2588` | COMPILATION_FAILURE | node-build | `TS2588` reassignment of const |
| `n16-build-unknown-tsc-flag` | BUILD_CONFIGURATION_FAILURE | node-build | `TS5023` unknown compiler option |

### Pipeline-stage rules

- **Node install is first** (`npm ci`). Baseline packages are vendored: TypeScript 5.8.3 is bundled as a local `.tgz` in `vendor/` and referenced by lockfile, so normal install/test/build scenarios **do not need public npm registry access**. Its upstream license is included inside the package archive.
- **Node test** is `npm test` using `node --test` and its `tests/test-settings.json` configuration. Build scenarios keep tests passing.
- **Node build** is `npm run build` using the actual TypeScript compiler (`tsc --noEmit`) followed by Node source parsing. The compiler produces real `TS####` messages; no fake error text or artificially raised `Error('TS2322')` is used.
- **N07** must run in the Node 20 environment; preflight/runtime selection may reject Node >=24 before the Runner. **Only count it if the real failure occurred where claimed.**
- **N12** changes `.npmrc` to enable fetch and points one lockfile artifact to runner-local loopback port 9. It simulates an unreachable dependency artifact, **not a real external npm outage**; real logs should show `ECONNREFUSED`.
- **N13 / N14** are optional Docker Build scenarios, **not Node build failures**. They require a selected Docker Build template and a working Docker builder. `FROM scratch` avoids pulling a base image, but platform security/engine restrictions may still prevent the build. If unavailable, **skip** them; do not create fake failures or labels.
- The platform may auto-select only install and test; ensure **the intended step is present**. Always inspect the actual PipelinePlan before executing.
- If your Runner has a different node execution image or a preset `NODE_ENV=production`, ensure `devDependencies` are installed: the build needs vendored TypeScript.

## Dataset quality (important)

- Set `provenance=CONTROLLED_INDUCED` and `scenario_group` using the actual dataset metadata mechanism **when available**. `experiment.json` does not persist this metadata by itself. The current dataset historically has 36 `UNKNOWN` provenance values; do not silently change past records.
- Record the scenario ID, Git commit SHA, failure step, exact diagnostic, and the verified category in moderator notes. Do not verify the label solely because the catalog says so.
- Every scenario is a genuine failed Runner attempt, but repeated runs of the same change are not independent new training examples. Distinct TypeScript compiler codes often share the same general class; a larger number alone does not prove model generalization.
- Keep the saved `experimental-v1` model immutable. Accumulate a batch of verified samples, then create a separately versioned new model. Do not evaluate accuracy on training examples as if held out.
- Never use the project repository ID, `expected_category`, scenario ID, or moderator notes as model features.

## Useful commands

```bash
node tools/activate-scenario.mjs --list
node tools/activate-scenario.mjs --status
node tools/activate-scenario.mjs n01-ts2322
node tools/activate-scenario.mjs --reset

# Baseline check only
npm ci && npm test && npm run build

# New distinct scenario on SAME branch after prior commit
node tools/activate-scenario.mjs n02-ts2307
git add -A
git commit -m "test: n02-ts2307"
git push
```

`--reset` rewrites only these lab-owned files: `package.json`, `package-lock.json`, `.npmrc`, `src/main.ts`, `src/app.cjs`, `tests/test-settings.json`, `Dockerfile`, and `experiment.json`. It does not delete your Git history, `vendor/`, tests, or node_modules. Use this only in the dedicated test repository.
