# Controlled Node runtime requirement mismatch

Template: node-build-template
Execution environment: node-20
Install: npm ci
Build: npm run build
Expected category: RUNTIME_MISMATCH

Dataset provenance: intentionally induced conflict between the declared Node
engine (20.x) and an application startup/build guard requiring Node major >=22.
The guard reads the REAL process.version; it does not fake a runtime version.
The engine constraint is deliberately misleading for this controlled experiment,
so the platform's engine-based runtime selection is expected to choose Node 20.
The build guard should then report:
Unsupported Node.js runtime: requires Node.js >=22, detected v20.x.x.

This tests explicit runtime-version validation. It does NOT demonstrate a real
Node 22-only API failing under Node 20; no such API is used by this sample.
No external dependencies or test scripts are present. A valid lockfile is included.
Review actual selected and active runtime in Runner logs before verifying a label.
If the platform runs Node >=22, this experiment should pass instead.

Control: preserve the failed revision, then align engines with the application's
minimum runtime and select a supported Node >=22 profile. Refresh the lockfile
and repository analysis; rerun. Do not label a successful run as a failure.
