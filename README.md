# Controlled invalid Dockerfile instruction

Pipeline: npm ci -> npm run build -> docker build .
Node profile: node-20. Enable Docker build; disable Docker push and deployment.
Context: repository root. Dockerfile path: Dockerfile.
Expected category: CONTAINER_CONFIGURATION_FAILURE
Expected evidence: unknown instruction: COPYY (wording may vary by builder).

Build generates dist/index.html. Dockerfile deliberately spells COPY as COPYY.
This is a Dockerfile instruction syntax error, unlike a missing COPY source path.
FROM scratch avoids a base image download. This packages an HTML artifact only;
it is not a running server or deployment experiment.
Dataset provenance: intentionally induced Docker configuration failure.
Review actual failing step and evidence before verifying the label.

Control: after preserving the failed revision, replace COPYY with COPY and rerun.
