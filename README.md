# Four Maven failure scenarios for CI/CD + RAG

هذا المستودع يحتوي على **4 سيناريوهات مستقلة** لاختبار تصنيف الأخطاء في منصتك.
يمكن تفعيل واحد في كل مرة باستخدام Node، بدون تثبيت npm packages.

> Required: Java 17 runner (`maven-java17`), Maven, Node.js locally for activation, and Maven Central network access for dependencies/plugins.

## Quick start

1. Extract the ZIP, enter `maven-four-failure-scenarios`.
2. Activate **one** scenario using the command below.
3. Commit/push the changed `pom.xml` and Java source file to **GitHub**.
4. In your platform, run `mvn -B test` using **maven-java17**.
5. Compare the RAG category against the expected category shown below.

**Important:** The platform clones the GitHub repository, not your local files. Each scenario change MUST be pushed before starting a new pipeline run.

## 4 scenarios

### 1) Missing Maven dependency

```bash
node tools/activate-scenario.mjs tc02-maven-unresolved-dependency
```

Expected Category: `DEPENDENCY_FAILURE`

Expected Error Pattern:

```text
Could not resolve dependencies for project ...
Could not find artifact dev.cicd.lab.nonexistent:missing-dependency-for-rag-test:jar:99.99.99
```

Meaning: `pom.xml` declares an artifact that does not exist in Maven Central. Some Maven versions may say `The following artifacts could not be resolved` or mention a locally cached missing artifact.

### 2) Java syntax / compilation error

```bash
node tools/activate-scenario.mjs tc03-java-syntax-error
```

Expected Category: `COMPILATION_FAILURE`

Expected Error Pattern:

```text
[ERROR] COMPILATION ERROR
[ERROR] .../Calculator.java:[...] ';' expected
```

Meaning: `Calculator.java` contains a `return a + b` statement without `;`.

### 3) Java runtime mismatch

```bash
node tools/activate-scenario.mjs tc04-java-version-mismatch
```

Expected Category: `RUNTIME_MISMATCH`

Expected Error Pattern:

```text
Rule ... RequireJavaVersion failed
This project requires Java 21 or later.
```

Or Maven Enforcer reporting that current Java `17` does not satisfy range `[21,)`.

Meaning: The POM requires Java 21+, while the **selected runner MUST use Java 17**. Using Java 21 will not reproduce this failure.

### 4) Invalid Maven build configuration

```bash
node tools/activate-scenario.mjs tc05-invalid-pom-xml
```

Expected Category: `BUILD_CONFIGURATION_FAILURE`

Expected Error Pattern:

```text
Non-parseable POM ...
end tag name </wrongDependencies> must match start tag name <dependencies>
```

Meaning: Invalid XML in `pom.xml` prevents Maven from reading the project model at all.

## Commit & push each scenario

When already connected to GitHub:

```bash
git add pom.xml src/main/java/dev/cicd/lab/Calculator.java
git commit -m "test: activate Maven RAG failure scenario"
git push
```

On the first upload to a **new** empty GitHub repository:

```bash
git init
git add .
git commit -m "test: initialize four Maven failure scenarios"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

Use one GitHub commit per scenario if you want to correlate expected categories with pipeline runs.

## Reset to working project

```bash
node tools/activate-scenario.mjs reset
mvn -B test
```

Expected reset result: `BUILD SUCCESS` with a passing `CalculatorTest`.

### Troubleshooting

- If you get a network or registry error before the scenario-specific error, check Maven Central connectivity.
- If the pipeline fails on `git clone` or image startup, the scenario is not being tested yet.
- Do not run multiple scenarios at the same time in one branch: activating a scenario overwrites the previous scenario's POM and Calculator.java.
- The POM validation failure can make some repository analyzers reject Maven metadata early; if your platform never reaches `mvn -B test`, use your existing Maven template/plan instead of auto-detection for that test.
- RAG is probabilistic: the Expected Category is the ground truth for testing, not a guarantee of the model output.
