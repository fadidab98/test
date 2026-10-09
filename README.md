# Controlled missing project artifactId experiment

Java 17 / Maven. Intentionally induced build configuration failure.

Template: maven-build-template
Environment: maven-java17
Command: mvn -B package -DskipTests
Expected category: BUILD_CONFIGURATION_FAILURE

The root project artifactId is intentionally omitted from pom.xml.
The XML is well-formed, but the Maven project model is invalid.
The plugin artifactId remains present; it is not the project artifactId.
Expected evidence: 'artifactId' is missing / problems processing the POMs.
Maven should stop during project model validation before source compilation.
Review actual Runner evidence before verifying a label.

Control: after recording the failed revision, add
<artifactId>java17-missing-artifactid-failure</artifactId>
directly after the root groupId and rerun the same command.
No deployment, repository mirror, or custom JVM flags are configured.
