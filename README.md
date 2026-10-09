# Docker Container Configuration Failure — CI/CD Dataset Sample

This is a minimal, **intentionally failing** Docker build scenario to exercise the
`CONTAINER_CONFIGURATION_FAILURE` category in a CI/CD incident classification system.

## Root cause

The root-level `Dockerfile` contains **`COPYY`**, which is not a valid Dockerfile
instruction. The correct instruction is `COPY`. `index.html` is present in the
build context, so this is not a missing-file or registry/network failure.

The base image is `scratch` to avoid downloading an external image. The failure
should occur while Docker parses the Dockerfile, before an image can be built.

## Expected execution

- **Template:** `docker-build-template` (enable Docker Build explicitly in the pipeline plan)
- **Build mode:** `USER_DOCKERFILE`
- **Dockerfile path:** `Dockerfile`
- **Build context:** `.` (repository root)
- **Image name:** `cicd-container-config-sample`
- **Image tag:** `test`
- **Docker push / deployment:** disabled
- **Expected outcome:** Docker Build step fails (non-zero exit code)
- **Expected diagnostic:** Dockerfile parse error; `unknown instruction: COPYY`
- **Expected taxonomy v1 category:** `CONTAINER_CONFIGURATION_FAILURE`

A manually reproducible equivalent is:

```bash
docker build -f Dockerfile -t cicd-container-config-sample:test .
```

Do not repair the Dockerfile before capturing the original failure evidence and
moderator review. To make the Dockerfile parse, replace `COPYY` with `COPY`.

This is a controlled test fixture, not a deployable production application.
