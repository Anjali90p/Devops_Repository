# Use Case 1: WordPress + MySQL

> Deploy a complete WordPress CMS with MySQL database using Docker Compose.

---

## 🏗️ Architecture

```
Browser
   │
   ▼
WordPress (Port 8080)
   │
   ▼
MySQL Database (Port 3306 — internal only)
```

---

## 📁 Files

```
wordpress-mysql/
├── docker-compose.yml
└── README.md
```

---

## 📋 Practical: Deploy WordPress + MySQL

### Objective
Run a fully functional WordPress website backed by a MySQL database.

### Prerequisites
- Docker and Docker Compose installed

### Step-by-Step

```bash
# Step 1: Navigate to the folder
cd wordpress-mysql
```

```bash
# Step 2: Start all services
docker-compose up -d
```
> This pulls both images and starts MySQL first, then WordPress after MySQL passes its health check.

```bash
# Step 3: Check services are running
docker-compose ps
```

### Expected Output

```
      Name                    Command               State           Ports
-------------------------------------------------------------------------
wordpress-db     docker-entrypoint.sh mysqld      Up (healthy)   3306/tcp
wordpress-app    docker-entrypoint.sh apach ...   Up             0.0.0.0:8080->80/tcp
```

```bash
# Step 4: Open in browser
# Visit: http://localhost:8080
```

You will see the WordPress installation wizard. Fill in:
- Site title
- Admin username and password
- Admin email

```bash
# Step 5: View logs
docker-compose logs wordpress    # WordPress logs
docker-compose logs db           # MySQL logs
docker-compose logs -f           # Follow all logs
```

```bash
# Step 6: Connect to MySQL directly
docker-compose exec db mysql -u wpuser -pwppassword wordpress
```

```sql
-- Inside MySQL shell
SHOW TABLES;
EXIT;
```

```bash
# Step 7: Stop the stack
docker-compose down

# Step 8: Stop AND remove all data (full reset)
docker-compose down -v
```

---

## 🔑 Key Concepts Demonstrated

| Concept | Where used |
|---------|-----------|
| `depends_on` with healthcheck | WordPress waits for MySQL to be healthy |
| Named volumes | Database data persists across restarts |
| Internal networking | MySQL is not exposed to host — only WordPress can reach it |
| Environment variables | DB credentials passed securely via `environment:` |
| Service naming as hostname | WordPress connects to MySQL using `db` as the hostname |

---

> [← Back to Microservices README](../README.md)
