# Network / Maven Registry Failure — Controlled CI/CD Sample

This is an intentionally failing Java 17 Maven project for collecting **real
network-or-registry failure evidence** in a CI/CD platform. The Java source and
POM are valid; the failure comes from Maven trying to download its build plugins
through an **unreachable, project-scoped registry mirror**.

## How the failure works

1. `.mvn/maven.config` makes Maven load `.mvn/settings.xml` and use a fresh local
   Maven cache at `.cicd-lab-maven-cache/`. Maven 3.9+ expects one argument per line.
2. `.mvn/settings.xml` defines a mirror for `*` Maven repositories at
   `http://127.0.0.1:65534/maven2/`, an intentionally unused loopback port.
3. When Maven runs `package`, it tries to download `maven-resources-plugin`
   or another plugin from that mirror. The connection should fail immediately.
4. The build exits non-zero. **No external internet host is contacted by the
   Maven mirror in this exercise.** The endpoint refers to the runner container
   itself, not your host, production service, or any real Maven registry.

Expected diagnostic (exact Maven wording can differ):

```text
Downloading from lab-unreachable-maven-registry: http://127.0.0.1:65534/maven2/...
Could not transfer artifact ... from/to lab-unreachable-maven-registry ...
Connection refused
BUILD FAILURE
```

This deliberately tests an **unreachable registry endpoint**, not a missing
Java dependency or a code-level build defect.

## Run in your CI/CD platform

- Unzip and push the *contents* of this folder into a new GitHub repository.
  The `.mvn/` directory and both its files **must** be committed.
- Template: `maven-build-template` (`maven-package`).
- Runner environment: `maven-java17`.
- Command: `mvn -B package -DskipTests` (no custom CLI overrides needed).
- Expected outcome: failed Maven plugin resolution due to connection refused.
- Expected taxonomy v1 label: `NETWORK_OR_REGISTRY_FAILURE`.
- Inspect Runner error excerpt and Ollama output, and let Moderator verify
  the root cause before adding this row to a verified ML dataset.

## Safety and isolation

This test does **not** edit global Maven settings, Docker Compose variables,
runner configurations, any shared network policy, or your production registry.
The mirror settings apply only when Maven is started in this particular
repository. The local Maven cache directory is ignored by Git. The sample
needs no registry credentials and should not be used as a real application.

## Repair (do not apply before capturing the failure)

Delete `.mvn/maven.config` and `.mvn/settings.xml`, or replace the test mirror
with a reachable, trusted Maven repository and use an allowed local cache.

**Caution:** keep this repository as an isolated learning/test sample. Its
project-local mirror deliberately breaks all Maven dependency and plugin
resolution, and you should not copy that setup into your main platform.
