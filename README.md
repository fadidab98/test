# Failure Lab 100 — Runtime mismatch inside runner (Node 20-compatible manifest)

This is a deliberate integration failure for the DevOps platform. The repository itself declares Node >=20, so the pipeline planner can select `node-20`. A specific production worker requires Node >=24 according to `config/runtime.policy.json`, and integration tests deliberately catch that mismatch at runtime. No external dependencies. All implementation and test files are JavaScript.

```sh
npm ci
npm run build
npm test
```

Expected on Node 20: `npm ci` succeeds; `npm run build` succeeds; most unit tests pass; `npm test` fails the runtime compatibility and worker bootstrap integration tests with `ERR_UNSUPPORTED_NODE_VERSION`, and exit code 1.

**Expected failure classification:** `RUNTIME_MISMATCH` (provisional test oracle). The fault is not a JavaScript syntax, missing dependency, or build target problem. The worker-level runtime requirement is intentionally stricter than the repository-wide minimum to make the incompatibility observable inside a real run.

This version intentionally differs from the earlier ZIP that requested Node >=24 in `package.json` and was rejected by Template Composition before execution. Do not alter the runtime policy or skip tests. Use a fresh repository/run to observe RAG vs CodeBERT v4.

Complexity 100% is a relative scenario label, not a measured difficulty percentage.
