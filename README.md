# Spring Boot Pipeline Check

Java 17 / Maven / Spring Boot 3.3.13. Includes genuine JUnit tests.

## Local baseline

```bash
node tools/activate-scenario.mjs --reset
mvn -B -ntp clean verify
```

## Single controlled CI scenario

```bash
node tools/activate-scenario.mjs tc01-surefire-invalid-java-path
mvn -B -ntp clean verify
```

This scenario changes only the Maven Surefire test-fork JVM executable path. It does not modify the Java target release or the main application. Build steps that skip tests may not surface the intended failure; execute Maven `verify` or `test` without skipping tests.

Run a new repository analysis and pipeline on the exact pushed commit. Do not place private credentials in the repository.
