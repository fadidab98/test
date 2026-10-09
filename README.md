# Controlled Docker COPY source path failure

Dataset provenance: intentionally induced container build configuration failure.
Environment: node-20 for install/build, Docker build profile for image creation.
Pipeline: npm ci -> npm run build -> docker build .
Expected category: CONTAINER_CONFIGURATION_FAILURE

Node build writes dist/index.html successfully. Dockerfile deliberately requests
COPY dist/order-dashboard.html /index.html instead. That file is absent.
Expected Docker evidence: COPY source not found / failed to compute cache key /
failed to calculate checksum for dist/order-dashboard.html.
FROM scratch avoids downloading a base image. This is an artifact packaging
experiment, not a runnable web server or deployment. No registry push is needed.
Enable Docker build, disable Docker push and deployment, use repository root as
build context and Dockerfile as the Dockerfile path.
Review actual failing step and logs before verifying the category.

Control: after recording the failed revision, change COPY source to dist/index.html
and rerun with the same context and pipeline. Build output must be available in
the Docker build context; inspect workspace handling if even dist/index.html is missing.
