# Use Case 3: Java Spring Boot + PostgreSQL

> Enterprise-grade Java REST API with PostgreSQL database using Docker Compose.

---

## 🏗️ Architecture

```
Browser
   │
   ▼
Spring Boot REST API (Port 8080)
   │
   ▼
PostgreSQL Database (Port 5432 — internal)
   │
pgAdmin UI (Port 5050)
```

---

## 📁 Project Structure

```
springboot-postgres/
├── docker-compose.yml
├── init.sql                  ← Runs on first DB startup
├── README.md
└── app/
    └── Dockerfile            ← Multi-stage build
```

---

## 📋 Practical: Deploy Spring Boot + PostgreSQL

### Step-by-Step

```bash
# Step 1: Navigate to the folder
cd springboot-postgres
```

```bash
# Step 2: Build and start all services
docker-compose up -d --build
```
> Spring Boot will start only after PostgreSQL passes its health check.

```bash
# Step 3: Check status
docker-compose ps
```

### Expected Output

```
    Name              Command              State           Ports
------------------------------------------------------------------------
postgres-db    docker-entrypoint.sh        Up (healthy)   5432/tcp
spring-app     java -jar app.jar           Up             0.0.0.0:8080->8080/tcp
pgadmin        /entrypoint.sh              Up             0.0.0.0:5050->80/tcp
```

```bash
# Step 4: Test the API
curl http://localhost:8080/api/items
```

```bash
# Step 5: Access pgAdmin (PostgreSQL UI)
# Visit: http://localhost:5050
# Email: admin@devops.com
# Password: admin123

# Add server connection inside pgAdmin:
# Host: postgres
# Port: 5432
# Database: springdb
# Username: springuser
# Password: springpassword
```

```bash
# Step 6: View Spring Boot logs
docker-compose logs app
docker-compose logs -f app     # Follow logs
```

```bash
# Step 7: Connect to PostgreSQL directly
docker-compose exec postgres psql -U springuser -d springdb

# Inside psql:
\dt                    # List tables
SELECT * FROM items;
\q                     # Quit
```

```bash
# Step 8: Stop everything
docker-compose down

# Full reset (removes all data)
docker-compose down -v
```

---

## 🔑 Key Concepts Demonstrated

| Concept | Where used |
|---------|-----------|
| Multi-stage Docker build | Builder stage (Maven) + Runtime stage (JRE) — smaller final image |
| PostgreSQL healthcheck | Spring Boot waits for DB to be ready |
| `init.sql` volume mount | SQL runs automatically on first DB start |
| Spring datasource via env vars | DB config passed as environment variables |
| pgAdmin | Web-based PostgreSQL admin tool |
| Named volumes | Database persists across container restarts |

---

## 🔧 Multi-Stage Build Explained

The `Dockerfile` uses two stages:

| Stage | Base Image | Purpose |
|-------|-----------|---------|
| `builder` | `maven:3.9` (~500MB) | Compile Java and build JAR |
| Final | `eclipse-temurin:17-jre-alpine` (~85MB) | Run the JAR only |

This keeps the final image small — no Maven or source code included.

---

> [← Back to Microservices README](../README.md)
