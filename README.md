# Spring Boot ML Failure Lab (Java 17 / Maven)

Independent controlled real-failure experiments for the AI/ML DevOps Runner. Review real logs before human verifying any label.

## Baseline

```bash
node tools/activate-scenario.mjs --reset
mvn -B -ntp clean verify
```

Create a dedicated GitHub repo, push the baseline, analyze it in the DevOps platform, verify JAVA/MAVEN/SPRING_BOOT detection, and run the baseline with the `maven-java17` Runner. Baseline must succeed including the Maven Surefire tests before using scenarios.

## Scenarios

```bash
node tools/activate-scenario.mjs --list
node tools/activate-scenario.mjs s01-java-cannot-find-symbol
git add -A
git commit -m "test: S01"
git push
```

After each commit, reanalyze/run the correct revision, inspect Runner evidence, select Reviewed Category and verify. Each scenario automatically resets lab-owned files, so **do not manually --reset between scenarios**. `--status` shows the currently active case; `--reset` restores baseline.

**Important:** S09-S11 require `mvn clean package` or `mvn clean verify` to invoke tests; `mvn compile` will miss them. S15-S16 require a Docker Build step; a Maven-only plan will miss them. S17 requires the JDK 17 Runner; it keeps `java.version=17` in the POM so project preflight should allow the build and Maven Enforcer will trigger at execution. Verify runtime behavior in your platform. S14 configures a localhost registry mirror only for that scenario and uses an ignored isolated `.cicd-lab-maven-cache`. Never use these injected settings outside the dedicated lab.

This ZIP has source code only, not Maven Central dependencies or Maven executable. A working Maven install and external dependency fetch are required for the baseline. `scenarios/catalog.json` contains all expected category/stage/error signatures; actual Maven/Docker wording may vary. Predictions are not verified ground truth until the incident is reviewed.
