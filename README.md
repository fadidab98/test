# Intentional JSX compilation failure — RAG / CodeBERT-v4 test

This is a **deliberately broken** small React + TypeScript + Vite + Vitest repository. It is intended for a controlled CI/CD failure experiment, not for production.

## Expected result

- `npm ci`: **PASS** (the repository includes a dependency lockfile)
- `npm test`: **FAIL** while transforming `src/View.tsx`
- `npm run build`: **FAIL** while transforming `src/View.tsx`
- Expected diagnostic: `Unexpected closing "div" tag does not match opening "span" tag`
- Target failure label for manual review: `COMPILATION_FAILURE`, since the JSX source cannot be transformed, even if a pipeline reports a failed `Node Test` step.

## Usage with the CI/CD platform

1. Unzip into a **new folder** (do not overwrite the platform code).
2. Push this folder's contents to a reachable Git repository or test branch.
3. Create a project pointing to that repository/branch in the platform.
4. Select/detect a Node.js pipeline that runs `npm ci`, then `npm test` (or `npm run build`).
5. After the run fails, open **Incidents** (read-only predictions) and **AI Comparison** (review).

## How to repair after the experiment

Change `src/View.tsx`:

```tsx
return <span>RAG and CodeBERT-v4 classification check</span>;
```

Do not fix the code before the experiment or the intended failure will disappear.
