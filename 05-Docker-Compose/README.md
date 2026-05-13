# 05 — Docker Compose

> Manage multi-container Docker applications with a single YAML file.

---

## 📖 What is Docker Compose?

**Docker Compose** is a tool for defining and running multi-container Docker applications. Instead of running multiple `docker run` commands manually, you define all services in a single `docker-compose.yml` file and start them with one command.

---

## 🆚 Docker vs Docker Compose

| Feature | Docker (CLI) | Docker Compose |
|---------|-------------|---------------|
| Single container | ✅ Easy | ✅ Easy |
| Multiple containers | ❌ Multiple commands | ✅ One command |
| Service dependencies | ❌ Manual | ✅ `depends_on` |
| Networking | ❌ Manual | ✅ Auto-created |
| Configuration | Flags in command | YAML file |
| Reproducibility | Medium | High |

---

## 🔧 Docker Compose File Structure

```yaml
version: "3.8"           # Compose file format version

services:                # Define each container as a service
  service-name:          # Service name (used as hostname too)
    image: image-name    # Docker image to use
    build: ./path        # Or build from local Dockerfile
    ports:               # Port mapping (host:container)
      - "8080:80"
    environment:         # Environment variables
      - KEY=VALUE
    volumes:             # Mount volumes
      - ./local:/container/path
    depends_on:          # Wait for another service first
      - db
    networks:            # Attach to named networks
      - app-network

networks:                # Define custom networks
  app-network:
    driver: bridge

volumes:                 # Define named volumes
  db-data:
```

---

## 📋 Practical 1: WordPress + MySQL Stack

### Objective
Run a complete WordPress website with a MySQL database using Docker Compose.

### docker-compose.yml

```yaml
version: "3.8"

services:
  db:
    image: mysql:8.0
    container_name: wordpress-db
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: wordpress
      MYSQL_USER: wpuser
      MYSQL_PASSWORD: wppassword
    volumes:
      - db-data:/var/lib/mysql
    networks:
      - wp-network

  wordpress:
    image: wordpress:latest
    container_name: wordpress-app
    restart: always
    ports:
      - "8080:80"
    environment:
      WORDPRESS_DB_HOST: db:3306
      WORDPRESS_DB_USER: wpuser
      WORDPRESS_DB_PASSWORD: wppassword
      WORDPRESS_DB_NAME: wordpress
    depends_on:
      - db
    volumes:
      - wp-data:/var/www/html
    networks:
      - wp-network

volumes:
  db-data:
  wp-data:

networks:
  wp-network:
    driver: bridge
```

### Commands

```bash
# Start all services in detached mode
docker-compose up -d
```
> `up -d` → Creates and starts all services defined in the file, in the background.

```bash
# View running services
docker-compose ps
```

```bash
# View logs for all services
docker-compose logs
docker-compose logs wordpress    # Logs for specific service
docker-compose logs -f           # Follow logs
```

```bash
# Stop all services (containers are preserved)
docker-compose stop

# Stop and remove containers, networks
docker-compose down

# Stop and remove containers, networks, AND volumes
docker-compose down -v
```

### Expected Output

```
$ docker-compose ps
      Name                     Command               State          Ports
---------------------------------------------------------------------------
wordpress-db       docker-entrypoint.sh mysqld      Up      3306/tcp
wordpress-app      docker-entrypoint.sh apach ...   Up      0.0.0.0:8080->80/tcp
```

Visit `http://localhost:8080` to see the WordPress setup wizard.

---

## 📋 Practical 2: Multi-Container App (Node.js + Redis + Nginx)

### Objective
Build a web app with a Node.js backend, Redis for caching, and Nginx as a reverse proxy.

### Project Structure

```
multi-container-app/
├── docker-compose.yml
├── nginx/
│   └── nginx.conf
└── app/
    ├── Dockerfile
    ├── package.json
    └── index.js
```

### app/index.js

```javascript
const express = require('express');
const redis = require('redis');

const app = express();
const client = redis.createClient({ url: 'redis://redis:6379' });

client.connect();

app.get('/', async (req, res) => {
  let visits = await client.get('visits') || 0;
  visits = parseInt(visits) + 1;
  await client.set('visits', visits);
  res.send(`<h1>Welcome to DevOps App!</h1><p>Visits: ${visits}</p>`);
});

app.listen(3000, () => console.log('App running on port 3000'));
```

### app/Dockerfile

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "index.js"]
```

### nginx/nginx.conf

```nginx
events {}

http {
  upstream app {
    server app:3000;
  }

  server {
    listen 80;

    location / {
      proxy_pass http://app;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
    }
  }
}
```

### docker-compose.yml

```yaml
version: "3.8"

services:
  app:
    build: ./app
    container_name: node-app
    restart: always
    networks:
      - app-network
    depends_on:
      - redis

  redis:
    image: redis:alpine
    container_name: redis-cache
    networks:
      - app-network

  nginx:
    image: nginx:alpine
    container_name: nginx-proxy
    ports:
      - "80:80"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - app
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

### Running the Stack

```bash
# Build and start all services
docker-compose up -d --build
```
> `--build` → Forces rebuilding of images defined with `build:`.

```bash
# Scale the app service (run 3 instances)
docker-compose up -d --scale app=3
```

```bash
# Execute a command in a running service
docker-compose exec app sh
docker-compose exec redis redis-cli ping
```

---

## 📋 Practical 3: Override Files (Dev vs Prod)

### Objective
Use override files to manage different environments.

### docker-compose.yml (base)

```yaml
version: "3.8"
services:
  app:
    image: my-app:latest
    ports:
      - "5000:5000"
```

### docker-compose.override.yml (development)

```yaml
version: "3.8"
services:
  app:
    build: .
    volumes:
      - .:/app          # Live code reload in dev
    environment:
      - DEBUG=true
```

### docker-compose.prod.yml (production)

```yaml
version: "3.8"
services:
  app:
    restart: always
    environment:
      - DEBUG=false
      - NODE_ENV=production
```

```bash
# Development (auto-uses override.yml)
docker-compose up -d

# Production
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

---

## 📌 Docker Compose Quick Reference

| Command | Description |
|---------|-------------|
| `docker-compose up -d` | Start all services |
| `docker-compose up -d --build` | Rebuild and start |
| `docker-compose down` | Stop and remove containers |
| `docker-compose down -v` | Also remove volumes |
| `docker-compose ps` | List service status |
| `docker-compose logs -f` | Follow logs |
| `docker-compose exec <svc> sh` | Enter service shell |
| `docker-compose stop` | Stop without removing |
| `docker-compose restart <svc>` | Restart a service |
| `docker-compose pull` | Pull latest images |
| `docker-compose --scale app=3` | Scale a service |

---

> Next: [06 — Jenkins](../06-Jenkins/README.md)
