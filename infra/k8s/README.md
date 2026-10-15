# Kubernetes deployment notes

These manifests document a deployment-oriented layout and must not be used as-is in production.

1. Build/push your image and replace `YOUR_REGISTRY` in `api-deployment.yaml`.
2. Create an authentic Kubernetes Secret named `aegis-api-secrets` with key `auth-secret`; it is intentionally not included.
3. Apply namespace, config, deployment, and service.
4. Important: the demo uses **in-memory state**. Two replicas do NOT share state. Replace repositories with a database before running a distributed production deployment. These manifests are for CI/Kubernetes analysis and learning only.
