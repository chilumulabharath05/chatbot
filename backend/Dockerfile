# ── Stage 1: Build ──────────────────────────────────────────
FROM maven:3.9.6-eclipse-temurin-17 AS build

WORKDIR /app

# Copy pom.xml first (caches dependencies layer)
COPY backend/pom.xml ./pom.xml
COPY backend/src ./src

# Download all dependencies
RUN mvn dependency:go-offline -q

# Build the fat JAR, skip tests
RUN mvn clean package -DskipTests -q

# ── Stage 2: Run ─────────────────────────────────────────────
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy built JAR from stage 1
COPY --from=build /app/target/chatbot-1.0.0.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-Dspring.profiles.active=prod", "-jar", "app.jar"]
