# Professor Demo: Four Independent Failures

Dedicated JavaScript ESM repository, Node >=20 <25, no external packages in the baseline. Docker commands use node:22-alpine. All application/test sources use .js. No Dockerfile is included: demonstrate Install, Test and Build.

## Scenarios

| ID | Controlled change | Expected reference | Desired platform behavior |
|---|---|---|---|
| 01 | Duplicate const in src/ledger.js | COMPILATION_FAILURE | Notify developer, do not automatically edit source |
| 02 | Invalid dependency name in package.json | DEPENDENCY_FAILURE | Propose removal/correction of invalid dependency, validate supported repair |
| 03 | Missing configured test reporter | TEST_CONFIGURATION_FAILURE | Propose valid reporter configuration, validate supported repair |
| 04 | Test expects 99 instead of actual 5 | UNKNOWN in taxonomy-v1 | Notify developer, do not change assertions to manufacture success |

These are expected behaviors for the demonstration, NOT a platform policy patch. This ZIP creates evidence; it cannot enforce whether your platform proposes/executes repairs. Check the current platform behavior before presenting. If it offers repairs for 01/04, record that deviation and stop that repair path. This ZIP does not alter the platform.

02 is an invalid package name, not a peer-version conflict. It is deterministic and requires no dependency-registry availability. Its local reference repair removes the deliberately unnecessary dependency. A real dependency must be corrected to the intended package, not blindly deleted.

## 1. Rehearse before Git setup (Git Bash, Docker Desktop running)

```bash
bash demo.sh rehearse
```

Runs baseline, each fault independently, then repair. Every application first restores all four controlled files. Expected nonzero pipeline exits count as confirmed fault tests. An unrelated error or timeout fails verification. Reports: results/*.json. No ML/RAG calls happen locally. The baseline is restored on exit. Initial Docker image pull needs internet.

## 2. New empty GitHub repository

Extract into a NEW folder. Create an empty GitHub repo without a README. In Git Bash inside the extracted directory:

```bash
git init -b main
git add .
git commit -m "Working baseline for four professor scenarios"
git remote add origin https://github.com/YOUR_ACCOUNT/professor-four-scenarios.git
git push -u origin main
```

Replace YOUR_ACCOUNT. Do not force-push. In the platform, create a project for this URL and branch main. Re-analyze, create a NEW run and confirm Install/Test/Build pass.

## 3. Publish each scenario separately

```bash
bash demo.sh publish 01
```

Re-analyze and create a NEW run. Verify CHECKED_OUT_COMMIT matches the published SHA. Wait for both predictions. Preserve evidence and review the cause independently. For 01 show developer notification and no source repair. If that notification/route does not exist in the platform, do not claim it does.

Then:

```bash
bash demo.sh publish 02
```

Re-analyze, NEW run, both classifications, then actual fix recommendation. Inspect whether it corrects/removes the invalid package entry. Execute validation only if the platform supports that candidate. Save all required stage results. Preview is not validation.

Then:

```bash
bash demo.sh publish 03
```

Re-analyze, NEW run, both predictions and recommendation. Suitable reference: restore the normal Node test reporter by removing the invalid --test-reporter option. Validate if supported.

Finally:

```bash
bash demo.sh publish 04
```

Re-analyze and create a NEW run. Actual=5, expected=99. This is ordinary assertion failure, not runner configuration. UNKNOWN is the reference under the current taxonomy. Show notification/manual investigation. Do not treat a change from 99 to 5 as an automatic repair success.

Each publish requires a clean working tree and commits/pushes only the controlled files on the current branch. Every scenario restores baseline first, so errors do not accumulate.

## 4. Manual reference repair, if needed

```bash
bash demo.sh publish repair
```

Create another new analysis/run. This restores all baseline files. It is a MANUAL control repair, not evidence of platform automatic fixing. Automatic repair requires platform repair-workflow execution and successful required validation stages.

## Local commands

```bash
bash demo.sh list
bash demo.sh 01
bash demo.sh check 01
bash demo.sh baseline
```

For other faults replace 01 with 02, 03 or 04. check verifies the current state and does not apply a fault. Generated results/dist files are ignored by Git.

## Scientific interpretation

Four demonstrations do not prove model superiority. They share one project and are correlated. Record model version, prompt/retrieval state, commit SHA, reference label and actual outcome. A reviewed case may later enter RAG retrieval; report exposure rather than claiming an independent test. Keep true evaluation groups out of training and retrieval.

Source-error notification and repair eligibility must come from explicit platform policy, not merely confidence or model agreement. CodeBERT v4 cannot output UNKNOWN directly. A correct RAG UNKNOWN on 04 must remain in evaluation.

See PROFESSOR-GUIDE-DE.md for German explanation and REVIEW-REFERENCE.md for review reasons. These guide labels are reviewer material, not inserted into runtime logs or model input by this project.
