# Java 17 Maven build-configuration failure sample

A small controlled CI/CD failure sample for testing an incident-classification
pipeline. This project is compatible with Java 17; its Java code is valid.

## Intended failure

The `pom.xml` binds `generate-assets` to the Maven `validate` phase using
`maven-resources-plugin:3.3.1`, but that plugin does **not** offer a goal
called `generate-assets`.

The POM is valid XML, but the Maven **build configuration** is incorrect.
The build should fail during Maven lifecycle goal resolution, before Java
compilation or test execution.

Example diagnostic (wording may vary by Maven version):

```text
[ERROR] Could not find goal 'generate-assets' in plugin
org.apache.maven.plugins:maven-resources-plugin:3.3.1
```

## Run in the CI/CD platform

- Execution environment: `maven-java17`
- Template: `maven-build-template` (`maven-package`)
- Command: `mvn -B package -DskipTests`
- Alternative: `mvn -B test`
- Expected: exit code nonzero due to invalid Maven plugin goal.

## How to repair (do not repair for the data-collection run)

Remove the intentionally invalid `generate-project-assets` plugin execution,
or replace it with a real goal from an appropriate plugin. The sample then has
ordinary Java 17 source code and should build normally.

## Dataset usage note

This is a deliberately constructed failure. Record it as a **controlled
synthetic scenario executed through a real Runner**, not as an organically
occurring production incident. Store the repository commit SHA with the
incident to keep training and validation data traceable.
