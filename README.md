# Java 17 unavailable dependency version experiment

Controlled, intentionally induced failure for dataset diversity.

Run: mvn -B package -DskipTests
Template: maven-build-template
Environment: maven-java17
Expected category: DEPENDENCY_FAILURE

pom.xml requests org.apache.commons:commons-lang3 with the intentionally
unavailable version 0.0.0-dataset-intentionally-unavailable. Source code is valid.
Expected evidence: Could not resolve dependencies / Could not find artifact.
No repository mirror or connectivity failure is configured.

Review actual logs before assigning a category. Connection refused, timeout,
or HTTP access failures instead indicate a different failure in the run.
Do not treat the expected category as an observed result.

Control: after recording the failed revision, replace the dependency version with an independently verified available version and rerun.
