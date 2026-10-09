# Controlled missing React dependency experiment

Node 20+ and React static rendering; no Vite or JSX transpiler is required.
Dataset provenance: intentionally induced missing dependency in a test repo.

Install step: npm ci
Build step: npm run build
Expected: install succeeds; build fails with ERR_MODULE_NOT_FOUND for react.
Expected category: DEPENDENCY_FAILURE.

Source imports react and react-dom/server, but both packages are intentionally
absent from package.json. A valid package-lock.json is included so missing
lockfile is not the intended failure. The first missing import should be react.
Review actual Runner logs before verifying a label.

After preserving the failed revision, a control run can add mutually compatible
react and react-dom packages and update the lockfile, then rerun install/build.
The project uses React.createElement and server-side static rendering to avoid
introducing unrelated bundler, JSX, browser or test configuration failures.
