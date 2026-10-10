N07 runtime mismatch patch for node-ml-failure-lab

Unzip the relative files at the root of your existing Node test repository, preserving your own scenario commits. Patch contains ONLY:
- tools/activate-scenario.mjs (revised N07 activation)
- tools/check-node-runtime.cjs (new runtime requirement guard)
- scenarios/catalog.json (N07 expected_stage corrected to node-build)

Then run:
node tools/activate-scenario.mjs n07-runtime-engine
node tools/activate-scenario.mjs --status
cat package.json
npm ci
npm run build  # Succeeds locally with Node 22+, but fails in your Runner configured to Node 20.
git add -A
git commit -m "test: n07-runtime-mismatch-in-build"
git push

In the platform, re-analyze/compose and run a NEW pipeline with node-20 and node-build.
Expected: node-install successful; node-build fails with ERR_UNSUPPORTED_NODE_VERSION.
Ground-truth category after checking actual evidence: RUNTIME_MISMATCH.
Keep classifier output and verified category distinct; correct the proposed label before Verify if needed.
