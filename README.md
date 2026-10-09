# Java 17 Maven test execution example

A small Java 17 project for exercising CI/CD Maven test execution.

## Project structure

- `src/main/java/.../Calculator.java`: Java 17-compatible code.
- `src/test/java/.../CalculatorTest.java`: JUnit Jupiter test.
- `pom.xml`: Maven compiler and Surefire settings.

## Run

```bash
mvn -B test
```

The source compiles with Java 17. The configured test-selection pattern does not
select the existing test class. With `failIfNoTests` enabled, Maven Surefire
should report that no tests were executed and fail the build.

This repository is a controlled failure fixture. Do not change its Maven test
configuration before capturing the CI/CD failure and its diagnostic evidence.

This project is intentionally small and does not require a database or a
running web service.
