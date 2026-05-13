# 10 — Shell Scripting

> Automate tasks and processes with Bash shell scripts.

---

## 📖 What is Shell Scripting?

A **shell script** is a text file containing a series of commands that the shell can execute. It allows you to automate repetitive tasks, system administration, and DevOps workflows.

In DevOps, shell scripts are used to:
- Automate server setup
- Deploy applications
- Run CI/CD steps
- Backup databases
- Monitor system health

---

## 📋 Practical 1: Your First Shell Script

### Objective
Write and execute a basic shell script.

```bash
# Create the script file
touch hello-devops.sh
```

```bash
#!/bin/bash
# hello-devops.sh — My first shell script

echo "==============================="
echo "   Welcome to DevOps Scripting  "
echo "==============================="
echo ""
echo "Current user: $(whoami)"
echo "Current date: $(date)"
echo "Hostname: $(hostname)"
echo "OS: $(uname -o)"
```

```bash
# Make it executable
chmod +x hello-devops.sh

# Run the script
./hello-devops.sh
```

### Expected Output

```
===============================
   Welcome to DevOps Scripting
===============================

Current user: ubuntu
Current date: Thu May 14 10:00:00 UTC 2026
Hostname: devops-server
OS: GNU/Linux
```

---

## 📋 Practical 2: Variables and User Input

```bash
#!/bin/bash
# variables.sh — Working with variables

# ── Variable Declaration ──────────────────────────────────
NAME="DevOps"
VERSION=1.0
ENVIRONMENT="production"

# Access variables with $
echo "App: $NAME v$VERSION running in $ENVIRONMENT"

# ── User Input ────────────────────────────────────────────
read -p "Enter your name: " USER_NAME
echo "Hello, $USER_NAME!"

read -sp "Enter password: " PASSWORD    # -s hides input
echo ""
echo "Password received (length: ${#PASSWORD})"

# ── Command Substitution ──────────────────────────────────
CURRENT_DATE=$(date +%Y-%m-%d)
DOCKER_VERSION=$(docker --version 2>/dev/null || echo "Not installed")

echo "Date: $CURRENT_DATE"
echo "Docker: $DOCKER_VERSION"

# ── Environment Variables ─────────────────────────────────
echo "Home directory: $HOME"
echo "PATH: $PATH"
```

---

## 📋 Practical 3: Conditionals

```bash
#!/bin/bash
# conditionals.sh — if/else statements

# ── Basic if/else ─────────────────────────────────────────
CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)

if [ "$CPU_USAGE" -gt 80 ]; then
    echo "⚠️  WARNING: High CPU usage: ${CPU_USAGE}%"
elif [ "$CPU_USAGE" -gt 60 ]; then
    echo "⚡ NOTICE: Moderate CPU usage: ${CPU_USAGE}%"
else
    echo "✅ CPU usage is normal: ${CPU_USAGE}%"
fi

# ── File checks ───────────────────────────────────────────
FILE="/etc/nginx/nginx.conf"

if [ -f "$FILE" ]; then
    echo "Nginx config found"
elif [ -d "/etc/nginx" ]; then
    echo "Nginx directory exists but config missing"
else
    echo "Nginx not installed"
fi

# ── Common test operators ─────────────────────────────────
# [ -f file ]    → file exists and is a regular file
# [ -d dir ]     → directory exists
# [ -e path ]    → path exists (file or directory)
# [ -z "$var" ]  → variable is empty
# [ -n "$var" ]  → variable is not empty
# [ "$a" = "$b" ]  → strings are equal
# [ $num -gt 5 ]   → number greater than 5
# [ $num -lt 5 ]   → number less than 5
# [ $num -eq 5 ]   → number equals 5

# ── String comparison ─────────────────────────────────────
ENV="production"
if [ "$ENV" = "production" ]; then
    echo "Running in PRODUCTION mode"
fi
```

---

## 📋 Practical 4: Loops

```bash
#!/bin/bash
# loops.sh — for and while loops

# ── For loop over a list ──────────────────────────────────
echo "Installing packages..."
PACKAGES=("curl" "wget" "vim" "git" "htop")

for pkg in "${PACKAGES[@]}"; do
    echo "Installing: $pkg"
    sudo apt install -y "$pkg" 2>/dev/null
done

# ── For loop with range ───────────────────────────────────
echo "Creating backup directories..."
for i in {1..5}; do
    mkdir -p "backup_day_$i"
    echo "Created: backup_day_$i"
done

# ── While loop ────────────────────────────────────────────
echo "Checking if service is up..."
MAX_RETRIES=5
COUNT=0

while [ $COUNT -lt $MAX_RETRIES ]; do
    if curl -s http://localhost:8080 > /dev/null; then
        echo "✅ Service is up!"
        break
    fi
    COUNT=$((COUNT + 1))
    echo "Attempt $COUNT/$MAX_RETRIES — waiting..."
    sleep 5
done

if [ $COUNT -eq $MAX_RETRIES ]; then
    echo "❌ Service failed to start after $MAX_RETRIES attempts"
fi

# ── Loop over files ───────────────────────────────────────
echo "Log files found:"
for logfile in /var/log/*.log; do
    size=$(du -sh "$logfile" 2>/dev/null | cut -f1)
    echo "  $logfile ($size)"
done
```

---

## 📋 Practical 5: Functions

```bash
#!/bin/bash
# functions.sh — Reusable functions

# ── Function definition ───────────────────────────────────
log_info() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] INFO:  $1"
}

log_error() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: $1" >&2
}

log_success() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] OK:    $1"
}

# ── Function with return value ────────────────────────────
check_service() {
    local service_name="$1"
    if systemctl is-active --quiet "$service_name"; then
        return 0    # Success
    else
        return 1    # Failure
    fi
}

# ── Function with output ──────────────────────────────────
get_disk_usage() {
    local path="${1:-/}"
    df -h "$path" | tail -1 | awk '{print $5}'
}

# ── Main script ───────────────────────────────────────────
log_info "Starting system check..."

SERVICES=("nginx" "ssh" "docker")
for svc in "${SERVICES[@]}"; do
    if check_service "$svc"; then
        log_success "$svc is running"
    else
        log_error "$svc is NOT running"
    fi
done

DISK=$(get_disk_usage "/")
log_info "Disk usage: $DISK"
```

---

## 📋 Practical 6: Real-World DevOps Scripts

### Script 1: Docker Cleanup

```bash
#!/bin/bash
# docker-cleanup.sh — Remove unused Docker resources

echo "=== Docker Cleanup Script ==="

# Remove stopped containers
echo "Removing stopped containers..."
docker container prune -f

# Remove dangling images
echo "Removing dangling images..."
docker image prune -f

# Remove unused networks
echo "Removing unused networks..."
docker network prune -f

# Show disk space saved
echo ""
echo "Docker disk usage after cleanup:"
docker system df

echo "Cleanup complete!"
```

### Script 2: Application Deployment

```bash
#!/bin/bash
# deploy.sh — Deploy application with Docker Compose

set -e                        # Exit on any error
set -o pipefail               # Exit on pipe failure

APP_NAME="devops-app"
COMPOSE_FILE="docker-compose.yml"
BACKUP_DIR="/backups/$(date +%Y%m%d_%H%M%S)"

log() { echo "[$(date +%H:%M:%S)] $1"; }

log "Starting deployment of $APP_NAME..."

# Create backup
log "Creating backup..."
mkdir -p "$BACKUP_DIR"
docker-compose logs > "$BACKUP_DIR/pre-deploy.log" 2>&1 || true

# Pull latest images
log "Pulling latest images..."
docker-compose pull

# Deploy with zero downtime
log "Deploying new version..."
docker-compose up -d --remove-orphans

# Health check
log "Waiting for services to start..."
sleep 10

if docker-compose ps | grep -q "Up"; then
    log "✅ Deployment successful!"
else
    log "❌ Deployment failed! Rolling back..."
    docker-compose down
    exit 1
fi
```

### Script 3: System Health Check

```bash
#!/bin/bash
# health-check.sh — Monitor system resources

echo "===== System Health Check ====="
echo "Date: $(date)"
echo ""

# CPU usage
CPU=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}')
echo "CPU Usage:    $CPU"

# Memory usage
MEM=$(free -h | awk '/^Mem:/ {printf "%s / %s (%.0f%%)", $3, $2, $3/$2*100}')
echo "Memory:       $MEM"

# Disk usage
DISK=$(df -h / | awk 'NR==2 {print $5 " used of " $2}')
echo "Disk (/)      $DISK"

# Load average
LOAD=$(uptime | awk -F'load average:' '{print $2}')
echo "Load Average: $LOAD"

# Check critical services
echo ""
echo "=== Service Status ==="
for svc in docker nginx ssh; do
    STATUS=$(systemctl is-active "$svc" 2>/dev/null || echo "unknown")
    printf "%-10s %s\n" "$svc" "$STATUS"
done
```

---

## 📌 Bash Quick Reference

| Concept | Syntax |
|---------|--------|
| Variable | `NAME="value"` |
| Use variable | `$NAME` or `${NAME}` |
| Command output | `$(command)` |
| If/else | `if [ condition ]; then ... fi` |
| For loop | `for i in list; do ... done` |
| While loop | `while [ condition ]; do ... done` |
| Function | `my_func() { ... }` |
| Exit on error | `set -e` |
| String length | `${#VAR}` |
| Default value | `${VAR:-default}` |
| Arithmetic | `$((a + b))` |
| Redirect stderr | `2>/dev/null` |
| Append to file | `echo "text" >> file.log` |
| Read file lines | `while IFS= read -r line; do ... done < file` |

---

> 🎉 You have completed the DevOps Master Repository!
> 
> [← Back to Main README](../README.md)
