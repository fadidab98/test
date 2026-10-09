# Java 17 — Incompatible Types Compilation Failure

This is a **controlled CI/CD failure fixture** for collecting real Maven runner diagnostics. The repository intentionally contains a Java type error. Do not use it as production application code.

## Environment

- Maven project, Java 17 (`maven.compiler.release=17`)
- No external application dependencies
- Expected runner environment: `maven-java17`
- Pipeline template: `maven-build-template`
- Pipeline command: `mvn -B package -DskipTests`

## Intentional failure

`src/main/java/dev/cicd/samples/pricing/OrderRequest.java` exposes `String quantity()`.

`src/main/java/dev/cicd/samples/pricing/OrderPricingService.java` tries to assign that text value directly to an `int`:

```java
int quantity = request.quantity();
```

Java does not implicitly convert a `String` to an `int`. Therefore the Maven compilation phase fails, typically with:

```text
[ERROR] incompatible types: String cannot be converted to int
[INFO] BUILD FAILURE
```

This failure is **not** caused by mismatched Java versions. Java 17 is sufficient. It is a source-code type incompatibility.

## Running this fixture in the CI/CD platform

1. Push **the contents of this folder** to a new GitHub repository. `pom.xml` must be at the repository root.
2. Register that repository as a new project in the platform.
3. Generate/select a pipeline with the `maven-build-template` step, execution environment `maven-java17`.
4. Execute `mvn -B package -DskipTests` through the actual runner.
5. Inspect the Maven error excerpt, automatically created incident, and Ollama proposal.
6. After assessing the evidence, let a moderator verify the category with a rationale. Do not solve/apply a fix during dataset collection.

## Ground-truth note (for experiment documentation only)

Target taxonomy category: `COMPILATION_FAILURE` (Taxonomy v1).
Root cause: assignment of a `String` expression to an `int` variable in Java source code.
This differs from the earlier `cannot find symbol` compilation sample, demonstrating **within-category diversity**.

For ML experiments, **do not include this README, the intended category, or moderator notes as model input**. Model inputs should reflect only the evidence available when a failure originally occurred, and related variants of the same fixture must be kept together in train/test splits.
