# Controlled malformed Maven POM experiment

Dataset provenance: intentionally induced build configuration failure.
Template: maven-build-template
Environment: maven-java17
Command: mvn -B package -DskipTests
Expected category: BUILD_CONFIGURATION_FAILURE

The properties element is deliberately closed with </property> instead of
</properties>. Maven should report Non-parseable POM / mismatched end tag
before dependency resolution or source compilation.
This is an XML syntax failure, unlike a well-formed POM missing artifactId.
Review actual Runner evidence before verifying a label.

Control: after preserving the failed revision, change </property> to
</properties> and rerun the same command.
No deployment, registry mirror or custom JVM settings are configured.
