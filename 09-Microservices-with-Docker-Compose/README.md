# 10 — Microservices with Docker Compose

> Learn Microservices Architecture and deploy real multi-container applications using Docker Compose.

---

## 📖 What are Microservices?

**Microservices** is an architectural style where an application is built as a collection of small, independent services. Each service:
- Runs in its own process
- Has its own database
- Communicates via APIs (usually HTTP/REST or message queues)
- Can be deployed independently

---

## 🆚 Monolithic vs Microservices

| Aspect | Monolithic | Microservices |
|--------|-----------|---------------|
| **Structure** | Single deployable unit | Multiple independent services |
| **Deployment** | Deploy entire app at once | Deploy each service independently |
| **Scaling** | Scale the whole app | Scale only the service that needs it |
| **Technology** | Single tech stack | Each service can use different tech |
| **Failure impact** | One bug can crash everything | Failure is isolated to one service |
| **Team size** | Works for small teams | Better for large teams |
| **Complexity** | Simple to start | More complex infrastructure |
| **Best for** | Small/simple apps | Large, scalable production apps |

---

## ✅ Advantages of Microservices

### 1. Scalability
Each service scales independently. If your payment service gets heavy traffic, scale only that — not the entire app.

### 2. Isolation
A bug or crash in one service does not bring down the others. Services are fault-tolerant by design.

### 3. Agility
Small teams can own and deploy individual services without coordinating with everyone. Faster releases.

### 4. Technology Flexibility
Use Python for one service, Node.js for another, Java for another — whatever fits best.

---

## 🔀 API Gateway

An **API Gateway** is the single entry point for all client requests. It:
- Routes requests to the correct microservice
- Handles authentication
- Manages rate limiting
- Aggregates responses

```
Client (Browser / Mobile)
          │
          ▼
  ┌──────────────┐
  │  API Gateway  │   ← Single entry point (e.g., Nginx)
  └──────┬───────┘
         │
    ┌────┼────────┐
    ▼    ▼        ▼
┌──────┐ ┌──────┐ ┌──────┐
│ User │ │Order │ │ Pay  │
│ Svc  │ │ Svc  │ │ Svc  │
└──────┘ └──────┘ └──────┘
    │        │        │
  ┌───┐    ┌───┐    ┌───┐
  │DB │    │DB │    │DB │   ← Each service has its own DB
  └───┘    └───┘    └───┘
```

---

## 🔧 Docker Compose for Microservices

Docker Compose is perfect for microservices in development. Each service runs in its own container, and Compose manages networking, volumes, and startup order.

---

## 📋 Docker Compose YAML — Complete Structure

```yaml
version: "3.8"           # Compose file version

services:                # Each microservice is defined here
  service-name:
    image: image-name    # Use a pre-built image
    build:               # OR build from Dockerfile
      context: ./path
      dockerfile: Dockerfile
    ports:
      - "host:container"
    environment:         # Environment variables
      KEY: value
    env_file:            # Load from .env file
      - .env
    volumes:
      - named-vol:/path
      - ./local:/container
    networks:
      - network-name
    depends_on:          # Start after this service
      - db
    restart: always      # Restart policy
    healthcheck:         # Container health check
      test: ["CMD", "curl", "-f", "http://localhost"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:                 # Named volumes (persistent storage)
  named-vol:

networks:                # Custom networks for isolation
  network-name:
    driver: bridge

secrets:                 # Secure sensitive values
  db_password:
    file: ./secrets/db_password.txt
```

---

## 🔑 Key Docker Compose Concepts

### Environment Variables

```yaml
# Method 1: Inline in docker-compose.yml
environment:
  DB_HOST: db
  DB_PORT: 5432
  DEBUG: "false"

# Method 2: From a .env file
env_file:
  - .env

# .env file contents:
# DB_HOST=db
# DB_PORT=5432
# DB_PASSWORD=secret123
```

### Secrets and Configs

```yaml
services:
  app:
    secrets:
      - db_password

secrets:
  db_password:
    file: ./secrets/db_password.txt    # Read from file
```
> Secrets are mounted as files inside the container at `/run/secrets/secret_name`. They never appear in environment variables — more secure than `environment:`.

### Build vs Image

| Field | When to use | Example |
|-------|------------|---------|
| `image:` | Use a pre-built Docker Hub image | `image: nginx:alpine` |
| `build:` | Build from your own Dockerfile | `build: ./app` |
| Both | Build locally, tag with image name | Use both together |

```yaml
# Using image (pulls from Docker Hub)
db:
  image: postgres:15-alpine

# Using build (builds from local Dockerfile)
app:
  build:
    context: ./backend
    dockerfile: Dockerfile

# Using both (builds and tags)
app:
  build: ./backend
  image: my-registry/my-app:latest
```

### Service Dependency Ordering

```yaml
services:
  app:
    depends_on:
      db:
        condition: service_healthy    # Wait until db passes healthcheck
      redis:
        condition: service_started   # Wait until redis starts

  db:
    image: postgres:15
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:alpine
```

---

## 📦 Use Case 1: WordPress + MySQL

> A classic CMS with a relational database backend.

**Architecture:**
```
Browser → WordPress (Port 8080) → MySQL Database
```

See full implementation: [wordpress-mysql/](./wordpress-mysql/)

---

## 📦 Use Case 2: Node.js + MongoDB

> A REST API backend with a NoSQL database.

**Architecture:**
```
Browser → Nginx (Port 80) → Node.js API (Port 3000) → MongoDB
```

See full implementation: [node-mongo/](./node-mongo/)

---

## 📦 Use Case 3: Java Spring Boot + PostgreSQL

> Enterprise-grade Java backend with a relational database.

**Architecture:**
```
Browser → Spring Boot API (Port 8080) → PostgreSQL Database
```

See full implementation: [springboot-postgres/](./springboot-postgres/)

---

## 📌 Docker Compose Quick Reference

| Command | Description |
|---------|-------------|
| `docker-compose up -d` | Start all services in background |
| `docker-compose up -d --build` | Rebuild images and start |
| `docker-compose down` | Stop and remove containers |
| `docker-compose down -v` | Also remove volumes |
| `docker-compose ps` | List running services |
| `docker-compose logs -f` | Follow logs from all services |
| `docker-compose logs app` | Logs for one service |
| `docker-compose exec app bash` | Enter a running service |
| `docker-compose restart app` | Restart one service |
| `docker-compose pull` | Pull latest images |
| `docker-compose scale app=3` | Run 3 instances of app |

---

> [← Back to Main README](../README.md)
