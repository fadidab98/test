# Failure Lab 50 — Test configuration (JavaScript only)

Controlled repository for classification evaluation. Node.js >= 20, no dependencies or network access.

```sh
npm ci
npm run build
npm test
```

Expected: `npm ci` succeeds, `npm run build` succeeds, `npm test` fails with `ENOENT` in the fixture-backed contract test. Four tests pass and one fails.

**Expected category:** `TEST_CONFIGURATION_FAILURE` (provisional test oracle). Root cause: `config/test.profile.json` specifies a fixture directory that does not exist; the actual fixture is under `test/fixtures/`. This is not a missing npm dependency or a source-code syntax issue. For a controlled confirmation, replace the config's `baseDirectory` value with `test/fixtures` in a disposable copy.

Push project files to GitHub (not this ZIP). No fixes should be applied before testing the platform's initial prediction. Compare RAG/CodeBERT v4 classifications with the observed failure log, not the README label alone.
