# Fault-injection matrix (ground truth)

Activate exactly ONE fault profile at a time:

```bash
npm run scenario -- build-config
npm run build
```

Then commit `config/scenario.json` and push it to the remote repository used by your DevOps platform. A remote clone cannot see your uncommitted local scenario change.

| Scenario | Expected taxonomy family | Failing command | Root diagnostic | Notes |
|---|---|---|---|---|
| `build-config` **(DEFAULT)** | `BUILD_CONFIGURATION_FAILURE` | `npm run build` | Build manifest points to missing dashboard entry file | Multi-workspace stages pass first |
| `compilation` | `COMPILATION_FAILURE` | `npm run build` | Invalid JavaScript syntax in invoice adapter fixture | Fixture checked only when active |
| `dependency` | `DEPENDENCY_FAILURE` | `npm run build` | `ERR_MODULE_NOT_FOUND` for missing payment connector | Tests Node module resolution, not `npm ci` |
| `runtime` | `RUNTIME_MISMATCH` | `npm run build` | Requires Node >=24 but runner uses Node 20 | Controlled diagnostic; no runtime install required |
| `test` | `TEST_FAILURE` | `npm test` | Business invariant assertion fails; `actual !== expected` | Requires pipeline with a test step after build |
| `test-config` | `TEST_CONFIGURATION_FAILURE` | `npm test` | Missing test reporter module | Requires pipeline with a test step after build |
| `success` | no failure | none | Clean syntax/build/test/smoke | Baseline/control group |

Important: taxonomy labels are expected research annotations; the runtime logs do not directly emit taxonomy labels. Real classifiers may pick another category; your Moderator must assess and verify results.

## Experiment plan

1. Publish ZIP contents to a Git repository.
2. Leave `build-config` as default and choose `npm ci`, then `npm run build` in your platform.
3. Capture new run ID, incident ID, runner stderr, RAG category, CodeBERT category, grounding accepted/rejected and Moderator review state.
4. For another case, run `npm run scenario -- <name>`, commit/push, create a **new run**.
5. For `test` and `test-config`, use a pipeline including `npm test` after `npm run build`.
6. For `success`, verify the run completes without an incident.

## Expected log snippets (not exact version-dependent)

`build-config`: `Invalid build configuration ... dashboard.entryFile ... was not found`

`compilation`: `SyntaxError: Unexpected token ';'`

`dependency`: `Error [ERR_MODULE_NOT_FOUND]: Cannot find package '@aegis/payment-gateway-adapter-not-installed'`

`runtime`: `requires Node >=24.0.0, but detected v20.x`

`test`: `AssertionError [ERR_ASSERTION]: Checkout total must equal ...`

`test-config`: `configured test reporter could not be resolved`

## How to interpret outcomes

- A technically unsuccessful pipeline can have a **successful failure classification**.
- `Model Agreement = AGREE` is not proof; human Moderator review remains separate.
- Do not promote AI-generated examples to authenticated verified references.
- Reuse the same incident only if the platform's caching/experiment semantics are understood; new commits/runs give cleaner A/B comparisons.
