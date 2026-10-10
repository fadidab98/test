FROM eclipse-temurin:17-jre
WORKDIR /app
COPY missing-spring-app.jar /app/app.jar
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
