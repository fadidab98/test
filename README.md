# Java 17 Maven compilation-failure sample

Small, self-contained repository for evaluating a CI/CD incident-classification pipeline.

## Requirements

- JDK 17 (the project's configured source/target release)
- Maven 3.8+ (or a compatible modern Maven 3.x)

## Run through your CI/CD platform

1. Push this repository to GitHub. Keep `pom.xml` at the repository root.
2. Create a project in your CI/CD platform using the GitHub HTTPS URL.
3. Run **Maven Test** using the **maven-java17** execution environment.
4. The command is `mvn -B test`. Compilation will fail **before tests run**.
5. Inspect the step's diagnostic excerpt and the moderator incident.

### Expected diagnostic message

```text
[ERROR] ... cannot find symbol
[ERROR]   symbol:   method totalCents()
[ERROR]   location: variable invoice of type dev.cicd.samples.invoice.Invoice
[INFO] BUILD FAILURE
```

## Why it fails

`InvoiceService.amountDueCents()` calls `invoice.totalCents()`, but the `Invoice` class only exposes `calculateTotalCents()`. This is a Java source-code compilation error, **not a Java runtime-version mismatch**. The project's configured Java release is 17, which matches the intended runner profile.

This error is deliberate. Do not fix the source before collecting the failed run and recording a moderator-verified classification.

## Optional repair (after collecting the failure)

Change `invoice.totalCents()` to `invoice.calculateTotalCents()` in `InvoiceService.java`. Then `mvn -B test` should complete successfully in a correctly configured Java 17 + Maven environment (no tests are included).

This project has no third-party Java dependencies or required external services.
