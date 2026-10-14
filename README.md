# Failure Lab 100 — Runtime mismatch (JavaScript only)

Larger, modular Node.js event processing service with domain models, application services, adapter interfaces, message processing, bootstrapping, monitoring, packaging, and integration tests. No external dependencies.

```sh
npm ci
npm run build
npm test
```

**Intended target: a Node 20 CI runner** (`node-20`), which is the runner profile in your DevOps platform. `npm ci` and `npm run build` should succeed (npm may emit an `EBADENGINE` warning); unit tests pass but the runtime integration tests fail with `ERR_UNSUPPORTED_NODE_VERSION` / `Unsupported CI runtime` because `config/runtime.policy.json` and `package.json` require Node >=24. On Node 22 the same failure is observed; on Node >=24 the scenario should pass. The runner is never asked to deploy.

**Expected category:** `RUNTIME_MISMATCH` (provisional test oracle). The source code compiles and domain tests work, but the runtime profile is incompatible with the declared production policy. The error is not a dependency or JavaScript syntax failure. For causal confirmation, use a supported Node 24 environment rather than changing model labels.

Please keep the intentional runtime mismatch in your uploaded GitHub repository. Do not configure the pipeline to skip failed tests. This project is a diagnostic test asset, not a production service.
