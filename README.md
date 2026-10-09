# Controlled missing npm test script experiment

Node.js with the built-in node:test runner; no external test packages.
Dataset provenance: intentionally induced test configuration failure.
Template: node-test-template (or the available template executing npm test)
Environment: node-20
Install: npm ci
Test: npm test
Expected category: TEST_CONFIGURATION_FAILURE

A valid test is present in test/pricing.test.mjs, but package.json deliberately
omits the test script. Expected evidence: Missing script: "test".
A valid lockfile is included and installation should succeed.
The test itself passes when invoked with node --test.
Review actual pipeline command and Runner logs before verifying the label.

Control: after preserving the failed revision, add
"test": "node --test" to scripts and rerun the same pipeline.
This isolates missing test command configuration from test assertion failures.
