# Controlled missing npm build script experiment

Node.js project; no external packages are required.
Dataset provenance: intentionally induced build configuration failure.
Template: node-build-template
Environment: node-20
Install: npm ci
Build: npm run build
Expected category: BUILD_CONFIGURATION_FAILURE

package.json is valid JSON and defines start but deliberately omits build.
Expected evidence: Missing script: "build".
A valid package-lock.json is included; installation should succeed.
This is a Node/npm configuration experiment, not a React rendering experiment.
Review actual Runner evidence before verifying the label.

Control: after preserving the failed revision, add the build script
"build": "node src/app.mjs" and rerun the same install/build pipeline.
