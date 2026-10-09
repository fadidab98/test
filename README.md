# Java 17 — Surefire Test JVM Configuration Failure

A deliberately failing **Maven / JUnit 5** project for a controlled CI/CD failure-labeling dataset.

## Expected classification

`TEST_CONFIGURATION_FAILURE` (taxonomy v1).

## Root cause

The Java source code and JUnit test are valid. However, `pom.xml` configures
`maven-surefire-plugin` with an **invalid JVM option**:

```xml
<argLine>-XX:ThisIsNotARealJVMOption=1</argLine>
```

Maven Surefire launches a separate JVM to run the test; that JVM rejects the
invalid option and exits before the test can run. This is intentionally a
**different failure mechanism** from the previous Surefire `includes` / "No
tests were executed" example.

## Running through the platform

- Runtime: `maven-java17`
- Template: `maven-test-template`
- Command: `mvn -B test`
- Expected stage: **TEST** / Surefire test JVM startup
- Expected symptom: `Unrecognized VM option 'ThisIsNotARealJVMOption=1'`
  and/or `The forked VM terminated without properly saying goodbye`
- Expected outcome: pipeline `FAILED`, `TEST_CONFIGURATION_FAILURE` as the
  moderator-verified category after reviewing the run logs

No production credentials, remote network failures, or infrastructure changes
are required. Standard Maven Central access is used for dependencies.

## If you want the project to succeed later

Remove the deliberately invalid `<argLine>` from `pom.xml` and rerun.

**Dataset provenance:** intentionally induced failure in a controlled test repository.
