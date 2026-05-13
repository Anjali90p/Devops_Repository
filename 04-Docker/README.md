# 04 — Docker

> Learn containerization with Docker from basics to advanced practicals.

---

## 📖 What is Docker?

**Docker** is an open-source platform that automates the deployment of applications inside lightweight, portable containers.

A **container** packages your application along with all its dependencies, libraries, and configuration — ensuring it runs consistently across any environment.

---

## 🆚 Docker vs Virtual Machine

| Feature | Docker Container | Virtual Machine |
|---------|----------------|----------------|
| Boot time | Seconds | Minutes |
| Size | MBs | GBs |
| OS sharing | Shares host OS kernel | Full OS per VM |
| Isolation | Process-level | Full isolation |
| Performance | Near-native | Overhead |
| Portability | High | Lower |
| Use case | Microservices, CI/CD | Full OS environments |

---

## 🏗️ Docker Architecture

```
┌─────────────────────────────────┐
│         Docker Client            │  ← You type docker commands here
│      (docker build, run, pull)   │
└────────────────┬────────────────┘
                 │ REST API
┌────────────────▼────────────────┐
│         Docker Daemon            │  ← Background service (dockerd)
│   Manages images, containers,    │
│   networks, volumes              │
└────────────────┬────────────────┘
                 │
┌────────────────▼────────────────┐
│         Docker Registry          │  ← Docker Hub (stores images)
└─────────────────────────────────┘
```

### Key Components

| Component | Description |
|-----------|-------------|
| **Docker Client** | CLI tool you use to interact with Docker |
| **Docker Daemon** | Background service managing Docker objects |
| **Docker Image** | Read-only template used to create containers |
| **Docker Container** | Running instance of an image |
| **Docker Registry** | Storage for Docker images (Docker Hub) |
| **Dockerfile** | Text file with instructions to build an image |

---

## 🔧 Core Concepts

### Namespaces
Docker uses Linux **namespaces** to isolate containers. Each container has its own:
- `pid` — Process isolation
- `net` — Network interfaces
- `mnt` — Filesystem mounts
- `uts` — Hostname isolation
- `ipc` — Inter-process communication

### cgroups (Control Groups)
**cgroups** limit and isolate resource usage (CPU, memory, I/O) for each container, preventing one container from consuming all host resources.

### Image Layering
Docker images are built in **layers**. Each instruction in a Dockerfile creates a new read-only layer. Layers are cached, so rebuilds are fast.

```
┌────────────────────────────┐
│   Container Layer (R/W)    │  ← Created when container runs
├────────────────────────────┤
│   COPY app/ /app           │  ← Layer 4
├────────────────────────────┤
│   RUN pip install -r req   │  ← Layer 3
├────────────────────────────┤
│   WORKDIR /app             │  ← Layer 2
├────────────────────────────┤
│   FROM python:3.11-slim    │  ← Layer 1 (base image)
└────────────────────────────┘
```

---

## 📋 Practical 1: Running an Ubuntu Container

### Objective
Pull and run an Ubuntu container interactively.

### Commands

```bash
# Step 1: Pull Ubuntu image from Docker Hub
docker pull ubuntu
```
> `docker pull` → Downloads the image from Docker Hub to your local machine.

```bash
# Step 2: Run Ubuntu container interactively
docker run -it ubuntu bash
```
> - `docker run` → Creates and starts a container
> - `-i` → Interactive mode (keep STDIN open)
> - `-t` → Allocate a pseudo-TTY (terminal)
> - `ubuntu` → Image name
> - `bash` → Command to run inside container

```bash
# Step 3: Inside the container — explore
ls /
cat /etc/os-release
apt update
apt install -y curl
exit
```

```bash
# Step 4: List all containers (including stopped)
docker ps -a
```
> `docker ps` → Lists running containers. `-a` includes stopped containers.

### Expected Output

```
$ docker run -it ubuntu bash
root@a1b2c3d4e5f6:/# cat /etc/os-release
NAME="Ubuntu"
VERSION="22.04.3 LTS (Jammy Jellyfish)"
```

---

## 📋 Practical 2: Running an Nginx Web Server Container

### Objective
Run an Nginx container and access it via a browser.

### Commands

```bash
# Pull Nginx image
docker pull nginx
```

```bash
# Run Nginx and map port 8080 on host to port 80 in container
docker run -d -p 8080:80 --name my-nginx nginx
```
> - `-d` → Detached mode (runs in background)
> - `-p 8080:80` → Map host port 8080 to container port 80
> - `--name my-nginx` → Assign a name to the container

```bash
# Verify it's running
docker ps
```

```bash
# Access in browser or via curl
curl http://localhost:8080
```

```bash
# View Nginx logs
docker logs my-nginx
docker logs -f my-nginx    # Follow logs in real time
```

```bash
# Stop and remove the container
docker stop my-nginx
docker rm my-nginx
```

### Expected Output
Visiting `http://localhost:8080` displays the Nginx default welcome page.

---

## 📋 Practical 3: Running an Apache Web Server Container

### Objective
Run Apache (httpd) and serve a custom HTML page.

### Commands

```bash
# Create a custom HTML file
echo "<h1>Hello from Apache on Docker!</h1>" > index.html
```

```bash
# Run Apache and mount the HTML file
docker run -d -p 8081:80 \
  -v $(pwd)/index.html:/usr/local/apache2/htdocs/index.html \
  --name my-apache \
  httpd:latest
```
> - `-v $(pwd)/index.html:/usr/local/apache2/htdocs/index.html` → Mounts local file into the container

```bash
# Verify
curl http://localhost:8081
```

### Expected Output

```
<h1>Hello from Apache on Docker!</h1>
```

---

## 📋 Practical 4: Running a MySQL Container

### Objective
Run a MySQL database container with environment variables.

### Commands

```bash
docker run -d \
  --name my-mysql \
  -e MYSQL_ROOT_PASSWORD=rootpassword \
  -e MYSQL_DATABASE=devopsdb \
  -e MYSQL_USER=devuser \
  -e MYSQL_PASSWORD=devpassword \
  -p 3306:3306 \
  mysql:8.0
```
> - `-e MYSQL_ROOT_PASSWORD` → Sets the root password via environment variable
> - `-e MYSQL_DATABASE` → Creates a database on startup

```bash
# Wait a few seconds, then connect to MySQL
docker exec -it my-mysql mysql -u devuser -pdevpassword devopsdb
```
> `docker exec -it` → Runs a command inside a running container.

```bash
# Inside MySQL shell
SHOW DATABASES;
EXIT;
```

---

## 📋 Practical 5: Running Alpine Linux Container

### Objective
Use Alpine Linux — an ultra-lightweight Docker image.

```bash
# Alpine is only ~5MB
docker pull alpine
docker images alpine
```

```bash
# Run Alpine interactively
docker run -it alpine sh
```
> Alpine uses `sh` (not bash) and `apk` (not apt) for package management.

```bash
# Inside Alpine container
apk add curl
curl --version
exit
```

### Alpine vs Ubuntu Image Size

| Image | Size |
|-------|------|
| ubuntu | ~77 MB |
| alpine | ~5 MB |
| nginx:alpine | ~23 MB |

---

## 📋 Practical 6: Copying Files Between Host and Container

### Objective
Transfer files between your host machine and a running container.

```bash
# Start an Ubuntu container
docker run -d --name file-test ubuntu sleep infinity
```
> `sleep infinity` keeps the container running without an interactive terminal.

```bash
# Copy a file FROM host TO container
echo "DevOps config" > config.txt
docker cp config.txt file-test:/tmp/config.txt
```
> `docker cp <source> <container>:<destination>`

```bash
# Verify the file is inside the container
docker exec file-test cat /tmp/config.txt
```

```bash
# Copy a file FROM container TO host
docker cp file-test:/etc/hostname ./container-hostname.txt
cat container-hostname.txt
```

---

## 📋 Practical 7: Building a Custom Docker Image

### Objective
Write a Dockerfile and build a custom image.

### Dockerfile Syntax

| Instruction | Purpose |
|------------|---------|
| `FROM` | Base image |
| `WORKDIR` | Set working directory |
| `COPY` | Copy files from host to image |
| `RUN` | Execute commands during build |
| `EXPOSE` | Document which port the app uses |
| `ENV` | Set environment variables |
| `CMD` | Default command when container starts |
| `ENTRYPOINT` | Fixed command (cannot be overridden easily) |

### Sample Dockerfile (Python App)

```dockerfile
# Use official Python slim image as base
FROM python:3.11-slim

# Set working directory inside container
WORKDIR /app

# Copy requirements file first (better layer caching)
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port 5000
EXPOSE 5000

# Default command to run the app
CMD ["python", "app.py"]
```

```bash
# Build the image
docker build -t my-python-app:1.0 .
```
> - `docker build` → Builds an image from a Dockerfile
> - `-t my-python-app:1.0` → Tags the image with a name and version
> - `.` → Build context (current directory)

```bash
# Run a container from your image
docker run -d -p 5000:5000 my-python-app:1.0
```

---

## 📋 Practical 8: Docker Volumes

### Objective
Persist data using Docker volumes.

```bash
# Create a named volume
docker volume create my-data
```

```bash
# Run a container with the volume mounted
docker run -d \
  --name data-container \
  -v my-data:/app/data \
  ubuntu
```

```bash
# Write data inside the container
docker exec data-container bash -c "echo 'Persisted data' > /app/data/test.txt"
```

```bash
# Remove container and recreate with same volume
docker stop data-container
docker rm data-container
docker run -it -v my-data:/app/data ubuntu cat /app/data/test.txt
```
> Data persists even after the container is deleted!

```bash
# List all volumes
docker volume ls

# Remove a volume
docker volume rm my-data
```

---

## 📋 Practical 9: Docker Networking

### Objective
Connect containers using Docker networks.

```bash
# List default networks
docker network ls
```
> Docker creates three default networks: `bridge`, `host`, `none`.

```bash
# Create a custom bridge network
docker network create my-network
```

```bash
# Run two containers on the same network
docker run -d --name app --network my-network nginx
docker run -it --network my-network alpine sh
```

```bash
# Inside Alpine, ping the nginx container by name
ping app
curl http://app
```
> Containers on the same custom network can communicate using container names as hostnames.

---

## 📋 Practical 10: Essential Docker Management Commands

```bash
# View container resource usage (CPU, RAM)
docker stats

# Detailed container info (JSON)
docker inspect <container_name>

# View container logs
docker logs <container_name>
docker logs -f <container_name>    # Follow in real time

# Execute command in running container
docker exec -it <container> bash
docker exec <container> ls /app

# Remove all stopped containers
docker container prune

# Remove all unused images
docker image prune

# Remove everything unused (containers, images, networks, volumes)
docker system prune -a
```
> ⚠️ `docker system prune -a` is destructive — use carefully.

---

## 🔧 .dockerignore File

Prevents files from being included in the build context (similar to `.gitignore`):

```dockerignore
# Version control
.git
.gitignore

# Documentation
*.md
docs/

# Environment files
.env

# Test files
tests/
*.test.js

# Logs
*.log
logs/

# Build artifacts
dist/
build/
node_modules/
__pycache__/
```

---

## 📌 Docker Command Quick Reference

| Command | Description |
|---------|-------------|
| `docker pull <image>` | Download image |
| `docker run -it <image> bash` | Run interactive container |
| `docker run -d -p 8080:80 <image>` | Run detached with port mapping |
| `docker ps` | List running containers |
| `docker ps -a` | List all containers |
| `docker images` | List images |
| `docker build -t name .` | Build image from Dockerfile |
| `docker stop <name>` | Stop container |
| `docker rm <name>` | Remove container |
| `docker rmi <image>` | Remove image |
| `docker logs <name>` | View logs |
| `docker exec -it <name> bash` | Enter container shell |
| `docker inspect <name>` | Detailed container info |
| `docker stats` | Resource usage |
| `docker system prune -a` | Clean up everything |
| `docker volume create <name>` | Create volume |
| `docker network create <name>` | Create network |

---

> Next: [05 — Docker Compose](../05-Docker-Compose/README.md)
