# DevOps failure-classification test repository

Small Node.js 20+ project designed to trigger **one intentional compilation/syntax failure** in the existing DevOps runner. No third-party dependencies, Dockerfile, or GitHub Actions are required.

## Expected pipeline behavior

| Command | Expected outcome |
|---|---|
| `npm ci` | PASS (lockfile included) |
| `npm run build` | FAIL — `SyntaxError: Unexpected token ';'` |
| `npm test` | FAIL — the test cannot load the module with invalid syntax |

**Expected root-cause category:** `COMPILATION_FAILURE`.

The deliberate fault is in `src/main.mjs`: `export const pipelineMarker = ;`.

A pipeline failure occurring during `npm test` is **still a compilation/syntax problem**, not necessarily `TEST_CONFIGURATION_FAILURE`. Use this example to compare your v2/v4 model predictions and inspect RAG matches. The predicted classification is not guaranteed.

## Upload to GitHub

Extract this ZIP. Create a new, empty GitHub repository and upload the *contents* of this folder, either using **Add file → Upload files** in GitHub or using Git. Do not upload only the ZIP file to the repository: the platform needs to analyze `package.json`, `package-lock.json`, and `src/`.

In your DevOps platform, add the resulting GitHub repository URL, analyze it, compose/execute its Node.js pipeline, and inspect the failure-classification and RAG results.

**Do not fix the syntax error** until you have finished testing the failure path. No CI/CD platform configurations, datasets, or model checkpoints need changing for this standalone demo.
