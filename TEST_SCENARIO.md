# Test Scenario: Maven Dependency Resolution

- **Test ID:** MAVEN-MISSING-ARTIFACT-001
- **Goal:** Classify a non-existent Maven artifact correctly.
- **Expected taxonomy:** `DEPENDENCY_FAILURE`.
- **Source knowledge:** `java-maven-missing-dependency-official`, revision 1 (if REVIEWED).
- **Preferred guardrail:** No unverified JAR installation or arbitrary version substitution.
- **Expected result for Fix Now:** Safe fallback (`NEEDS_MODERATOR`) when no approved
  Java/Maven repair operation is available.

## Evidence to collect

1. Maven failure line with actual `groupId:artifactId:version`.
2. `AI Failure Classification` suggested category and explanation.
3. `Automatic Failure Resolution` status and rejection reason.
4. Confirmation no Node `npm install` command ran.

## Negative control

If logs show `Unknown host`, `401`, `403`, `PKIX`, `ETIMEDOUT`, or `Connection refused`,
this is **not** a valid demonstration of a missing published artifact. Diagnose the
repository/network problem before evaluating classification correctness.
