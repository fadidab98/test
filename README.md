# Controlled Java duplicate method experiment

Dataset provenance: intentionally induced source-code compilation error.
Template: maven-build-template
Environment: maven-java17
Command: mvn -B package -DskipTests
Expected category: COMPILATION_FAILURE

OrderPricingService declares totalCents(int, int) twice in the same class.
Expected compiler evidence: method totalCents(int,int) is already defined.
This differs from undefined methods and incompatible assignment types.
There are no project dependencies or custom registry/JVM settings.
Review actual Runner logs before verifying the category; dependency download
or infrastructure errors could occur before the intended compilation error.

Control: after preserving the failed revision, remove the second method and
rerun the same pipeline. Do not change the Java runtime or Maven configuration.
