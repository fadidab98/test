# Maven Missing Artifact — RAG Classification Test

A deliberately broken **standalone Maven / Java 17** repository used to evaluate the
**AI-Driven DevOps Platform** (repository analysis, pipeline execution, RAG classification,
RAG recommendation, and the safe Moderator fallback).

## What is intentionally broken?

The `pom.xml` declares a dependency that is **not published**:

```xml
<dependency>
    <groupId>example.invalid</groupId>
    <artifactId>missing-library-demo</artifactId>
    <version>99.99.99</version>
</dependency>
```

The Java class and JUnit tests are valid. On a Maven runner with access to Maven Central,
a build should fail during dependency resolution. The exact error text varies with
Maven and repository settings, but typically contains:

```text
Could not find artifact example.invalid:missing-library-demo:jar:99.99.99 in central
```

Do not interpret a network, proxy, or authentication failure as an absent artifact.

## Upload to a new GitHub repository

Create a new empty GitHub repository, e.g. `maven-missing-artifact-rag-test`.
Extract the ZIP, then run these commands from **inside the extracted folder**:

```bash
git init
git add .
git commit -m "Add Maven dependency resolution test project"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/maven-missing-artifact-rag-test.git
git push -u origin main
```

Alternatively, use GitHub's **Add file → Upload files** and upload the extracted
contents (`pom.xml`, `src/`, `README.md`, `.gitignore`) to the repository root.

## Run in the AI-Driven DevOps Platform

1. Add the new repository URL as a **new project**.
2. Analyze it and let the platform detect **Maven / Java**.
3. Compose a Java/Maven pipeline and execute it.
4. Inspect the failed step's **actual runner logs** and open the new incident.
5. Test **RAG Classification** and **Fix Now**.

Expected RAG behavior:

| Property | Expected |
| --- | --- |
| Failure category | `DEPENDENCY_FAILURE` |
| Technology | `JAVA` / Maven |
| Error evidence | Missing `example.invalid:missing-library-demo:99.99.99` artifact |
| Recommendation | Check coordinates, repository configuration, artifact availability |
| Automatic npm patch | **Must not** be suggested or executed |
| Automatic repair without an approved Maven patch | Safe Moderator fallback |

**Important:** A retrieval result or a guessed RAG answer is not proof of actual
classification. Judge it using the incident's **Suggested Category**, explanation,
and runner logs.

## Optional control case: make this project pass

**After** recording the failed case, remove only the intentionally broken dependency
block from `pom.xml`; leave the legitimate JUnit dependency in place. Commit the change
and run the pipeline again. Assuming the environment can reach Maven Central and has a
compatible Java/Maven setup, `mvn -B -ntp clean verify` should then compile and run two tests.

## Safety

This is an educational failure fixture; don't copy the broken dependency into a real service.
No repository files, credentials, or database data in your platform are modified by this ZIP.
