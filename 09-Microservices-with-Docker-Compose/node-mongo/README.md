# Use Case 2: Node.js + MongoDB + Nginx

> A production-style REST API with a NoSQL database and Nginx reverse proxy.

---

## 🏗️ Architecture

```
Browser
   │
   ▼
Nginx Reverse Proxy (Port 80)
   │
   ▼
Node.js REST API (Port 3000 — internal)
   │
   ▼
MongoDB Database (Port 27017 — internal)
   │
Mongo Express Admin UI (Port 8081)
```

---

## 📁 Project Structure

```
node-mongo/
├── docker-compose.yml
├── README.md
├── app/
│   ├── Dockerfile
│   ├── package.json
│   └── app.js
└── nginx/
    └── nginx.conf
```

---

## 📋 Practical: Deploy Node.js + MongoDB

### Step-by-Step

```bash
# Step 1: Navigate to the folder
cd node-mongo
```

```bash
# Step 2: Build and start all services
docker-compose up -d --build
```
> `--build` forces Docker to build the Node.js image from the Dockerfile.

```bash
# Step 3: Verify all services are running
docker-compose ps
```

### Expected Output

```
    Name            Command            State           Ports
--------------------------------------------------------------------
nginx-proxy    nginx -g daemon off;   Up      0.0.0.0:80->80/tcp
node-api       node app.js            Up      3000/tcp
mongodb        mongod                 Up (healthy)  27017/tcp
mongo-express  ...                    Up      0.0.0.0:8081->8081/tcp
```

```bash
# Step 4: Test the API
curl http://localhost/
# Output: {"message":"Node.js + MongoDB Microservice is running!"}

# Create an item
curl -X POST http://localhost/items \
  -H "Content-Type: application/json" \
  -d '{"name": "DevOps Item 1"}'

# Get all items
curl http://localhost/items
```

```bash
# Step 5: Open Mongo Express UI
# Visit: http://localhost:8081
# Login: admin / admin123
```

```bash
# Step 6: View logs
docker-compose logs app      # Node.js logs
docker-compose logs mongo    # MongoDB logs
```

```bash
# Step 7: Stop everything
docker-compose down

# Full reset (removes data)
docker-compose down -v
```

---

## 🔑 Key Concepts Demonstrated

| Concept | Where used |
|---------|-----------|
| Multi-network isolation | Frontend and backend on separate networks |
| `build:` field | Node.js image built from local Dockerfile |
| Nginx reverse proxy | Nginx routes traffic to Node.js |
| MongoDB healthcheck | Node.js waits for DB to be ready |
| Mongo Express | Web-based DB admin tool |
| Named volumes | MongoDB data persists across restarts |

---

> [← Back to Microservices README](../README.md)
