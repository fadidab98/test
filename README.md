# Automatic lockfile synchronization demo

This example uses an EXISTING deterministic platform repair, NpmLockfileRepairPolicy / REGENERATE_LOCK_FILE. No platform code change is included or required for this policy in the uploaded version (10).

package.json requires is-number 7.0.0. The baseline lockfile matches 7.0.0. The fault replaces only package-lock.json with a valid lockfile for 6.0.0. npm ci fails with EUSAGE and the explicit Invalid lock file diagnostic. Source code, tests and manifest remain valid. Registry access is needed to install packages.

## Git Bash

Extract into a NEW directory. Rehearse locally with Docker Desktop running:

```bash
bash demo.sh rehearse
```

Publish the working baseline to a new EMPTY GitHub repo:

```bash
git init -b main
git add .
git commit -m "Working lockfile auto-repair demo"
git remote add origin https://github.com/YOUR_ACCOUNT/professor-lockfile-autofix.git
git push -u origin main
```

Replace YOUR_ACCOUNT. Create the platform project on branch main, re-analyze, create a new run and confirm Install/Test/Build pass.

Then publish the failure:

```bash
bash demo.sh publish fault
```

Re-analyze and create a NEW run. Verify its checkout SHA. Expected reference category: DEPENDENCY_FAILURE.

The platform's existing policy recognizes the explicit npm manifest/lock mismatch and generates a pre-install command in the isolated validation workspace:

```bash
npm install --package-lock-only --ignore-scripts --no-audit --no-fund
```

It then keeps the ORIGINAL npm ci and runs the remaining pipeline. The GitHub repository is not automatically committed. Verify a real validation run and all required stages pass before calling it an automatic repair. The UI may display historical-knowledge approval separately from successful current-run resolution.

Do NOT run publish repair during the automatic-repair demonstration: it would be a manual correction. That command is only a fallback control restoring the baseline lockfile.

If the old incident already reached NEEDS_MODERATOR, make a new run after publishing this scenario rather than expecting the old terminal session to restart. Do not use the invalid-name example: it does not trigger this policy.

The project does not override platform permissions, automation configuration or run eligibility. The uploaded platform source supports this policy; live execution is still required to verify the installation. Docker is not available in the authoring environment. Node/npm local results are recorded separately.
