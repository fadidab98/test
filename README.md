# Controlled npm registry connectivity experiment

This is a registry metadata connectivity probe, not a React app build.
Dataset provenance: intentionally induced npm registry connectivity failure.
Template: node-build-template
Environment: node-20
Install: npm ci
Build: npm run build
Expected category: NETWORK_OR_REGISTRY_FAILURE

The build script asks npm for the react package version from an intentionally
unreachable registry at http://127.0.0.1:65534/ inside the runner container.
Expected evidence: ECONNREFUSED / connect ECONNREFUSED 127.0.0.1:65534.
No service should listen on that port. The registry override is scoped to this
one command; global npm settings and the install registry remain unchanged.
Retries are disabled and the fetch timeout is limited to 3 seconds.
There are no dependencies; a valid lockfile is included.
Review actual Runner evidence before verifying the category.
This is a controlled connectivity failure, not evidence of public registry outage.
