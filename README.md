# Order Pipeline Demo

A small Node.js 20 order-processing repository to test external CI/CD runners.

## Commands

```bash
npm ci
npm run build
npm test
```

The project has no third-party dependencies. It contains an **intentional failure** in the test workflow. Do not correct it before analyzing the CI run in your DevOps platform.

The application itself can run with `npm start`. This repository intentionally does not include GitHub Actions because it is designed for an external pipeline runner.
