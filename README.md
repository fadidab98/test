# Failure Lab 80 — Build configuration (JavaScript only)

Layered invoice service with a four-stage offline release build, configuration profiles, targets, adapters, and standalone passing unit tests. Node.js >=20, no dependencies.

```sh
npm ci
npm run build
npm test
```

Expected: installation succeeds; **build fails** in stage 3 with `BUILD_CONFIG_UNSUPPORTED_MODULE_FORMAT`; the release-profile contract test also fails under `npm test` (six other tests pass).

**Expected category:** `BUILD_CONFIGURATION_FAILURE` (provisional test oracle). Root cause: `config/release.profile.json` requests `target.moduleFormat=esm-v2` but `config/supported-targets.json` supports `esm`. Source syntax and entrypoint checks succeed. Fix the release profile to `esm` only in a disposable copy to prove the causal link; don't fix before running the DevOps pipeline.
