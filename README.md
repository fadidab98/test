# Manual Fix + Full Pipeline Validation Lab (Node.js)

**Purpose:** Test your platform's existing **Moderator → Fix Candidate → Template Fix Layer → Full Validation → Mark as Solved → Knowledge Base** workflow. The repository intentionally contains ONE missing test-time npm dependency. No source-code fix is needed during platform validation.

## Scenario (already active in this ZIP)

```bash
node tools/activate-scenario.mjs tc06-node-missing-test-dependency
```

**Expected category:** `DEPENDENCY_FAILURE`  
**Expected failed step:** `node-test` (Test)  
**Expected error:**

```text
Error: Cannot find module 'is-number'
code: 'MODULE_NOT_FOUND'
Require stack:
.../test/total.test.cjs
```

`is-number` is imported in the test but intentionally NOT listed in `package.json` or `package-lock.json`. `npm ci` must succeed; `npm test` must fail. A successful `npm run build` checks actual application logic and creates `dist/build-manifest.json`.

## 1 — Upload to GitHub and run original pipeline

Unzip and upload the **contents of `manual-fix-node-dependency-lab/`** as the root of a new GitHub repository. In your DevOps platform create a project with this repo, analyze it, and compose/lock a plan including these templates:

1. `node-install-template` → `node-install`: `npm ci`
2. `node-test-template` → `node-test`: `npm test`
3. `node-build-template` → `node-build`: `npm run build`

Do not select Docker, push or deployment steps for this lab. (The platform orders Node testing before Node building.) Run the plan. Expected: **node-install SUCCESS, node-test FAILED, node-build NOT RUN**.

## 2 — Manually create the correct fix in Moderator

Open the newly created Incident. Under **Patch Catalog**, select:

```text
Patch:                    Install Node Transient Package
Patch catalog ID:         install-node-transient-package
Failure class:            DEPENDENCY_FAILURE
Repair strategy:          Add Missing Dependency
Package Name:             is-number
Package Version:          7.0.0
Runner requirement:       node-20
Solution explanation:     The test imports is-number, but it is missing from package.json.
What pipeline should do next time:
                           Install is-number@7.0.0 before node-test.
```

Click **Create Template Fix Layer** and select the created Fix Candidate. The platform should insert a step before the original `node-test`:

```bash
npm install --no-save is-number@7.0.0
```

The original test command `npm test` stays unchanged. Do NOT use `Skip Tests` or replace test with a no-op.

## 3 — Full Pipeline Validation

Start **Deployment-Free Pipeline Validation** for the Fix Candidate. Expected workflow:

```text
node-install                         SUCCESS (npm ci)
node-test-fix-before-1 (synthetic)   SUCCESS (npm install --no-save is-number@7.0.0)
node-test                            SUCCESS (npm test; real tests execute)
node-build                           SUCCESS (npm run build)
FULL_VALIDATION                     SUCCESS
```

If the platform has different synthetic step naming, follow the displayed step labels. This is an expected outcome, not independently verified in your deployment.

## 4 — Approve and store the solution

Only after the FULL_VALIDATION run is SUCCESS: review the fix and use **Mark as Solved**. Then inspect the Knowledge Entry. Enable Auto Apply only if you deliberately want to test preflight reuse.

## 5 — Optional local checks

```bash
npm ci                    # succeeds (lockfile included)
npm test                  # expected MODULE_NOT_FOUND
npm install --no-save is-number@7.0.0
npm test                  # now passes (requires access to npm registry)
npm run build             # passes
```

To reset to a healthy repository **without installing any extra dependency**:

```bash
node tools/activate-scenario.mjs reset
npm ci
npm test
npm run build
```

To recreate the original failing scenario:

```bash
node tools/activate-scenario.mjs tc06-node-missing-test-dependency
```

**Notes:** Do not commit `node_modules` or `dist`. The patch is deliberately transient and does NOT amend the repository's package manifest. Production dependency repair would normally update `package.json` and `package-lock.json`; this lab tests the available catalog operation and the validation/knowledge flow. Any `npm ci` performed *after* the transient installation removes the extraneous package again.
