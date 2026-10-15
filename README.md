# RAG vs CodeBERT-v4 – intended JSX compilation failure

This is a minimal React + TypeScript fixture for testing failure classification in a CI/CD pipeline.

## Expected sequence

- `npm ci` → **SUCCESS** (the lockfile has no Vite / esbuild / native optional packages).
- `npm test` → **FAILURE** because of an intentionally mismatched JSX tag in `src/View.tsx`.
- `npm run build` → **FAILURE** for the same JSX syntax error.

**Expected category:** `COMPILATION_FAILURE` (not `DEPENDENCY_FAILURE`).

> Do not fix `src/View.tsx` until after creating the failed pipeline and reviewing RAG and CodeBERT-v4 results.

The failed test command invokes the real TypeScript compiler (`tsc --noEmit`). This fixture does not use Vite or Vitest intentionally to avoid unrelated dependency-install failures.

## Example errors

`TS17002: Expected corresponding JSX closing tag for 'span'.`

Upload these files to a new test repository and run the Node install and test steps of your CI/CD platform.
