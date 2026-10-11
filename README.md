# RAG Live Search Test: npm Missing Script

This disposable repository **deliberately fails** its existing Node.js build step to test RAG live external knowledge lookup.

## How it works

- `npm ci` succeeds because `package-lock.json` is present.
- `npm run build` invokes `npm test`.
- The project deliberately **does not** define a `test` script.
- The Node build step therefore fails with `npm error Missing script: "test"` (npm wording varies by version).
- An Incident should be created, letting the RAG classifier try local reviewed knowledge and (if none matches) live npm documentation.

**Important:** This intentionally uses the build step to trigger `npm test`. The failed step will be `node-build`, not `node-test`. It avoids changes to your platform's pipeline templates or to its test detection rules.

## To test on the platform

1. Replace the files in the **disposable test repository** previously created on GitHub with these files and commit/push them. Do not put this change in the CI/CD platform's own repository.
2. Create a fresh project/plan or reanalyze the repository if your existing pipeline plan is locked to the old revision. A new run should use the updated commit.
3. Run your existing `node-install` → `node-build` pipeline.
4. Verify runner logs contain `npm ... Missing script: "test"` and an Incident was created.
5. From `infra/docker-compose`, inspect live fallback logs:
   ```bash
   docker logs --since 15m docker-compose-core-backend-1 2>&1 | grep -F 'Live knowledge fallback completed'
   ```
6. If the log is absent, external fallback may have been skipped because matching reviewed local knowledge existed or the diagnostic signature was not passed. This is not proof of a successful website lookup.

This repo is intentionally broken for a controlled experiment. No real project code should be modified.
