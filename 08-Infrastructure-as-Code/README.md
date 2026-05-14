# 09 — Infrastructure as Code & YAML

> Define infrastructure and configuration using code instead of manual processes.

---

## 📖 What is Infrastructure as Code?

**Infrastructure as Code (IaC)** is the practice of managing and provisioning infrastructure through machine-readable configuration files rather than through manual processes or interactive configuration tools.

### Benefits of IaC

| Benefit | Description |
|---------|-------------|
| **Consistency** | Same environment every time |
| **Speed** | Provision in minutes, not days |
| **Version control** | Track changes like code |
| **Reusability** | Templates for multiple environments |
| **Documentation** | Code IS the documentation |
| **Disaster recovery** | Rebuild quickly from code |

---

## 📋 YAML Fundamentals

### What is YAML?
**YAML** (YAML Ain't Markup Language) is a human-readable data serialization format. It is used extensively in DevOps for configuration files:
- Docker Compose (`docker-compose.yml`)
- GitHub Actions (`.github/workflows/*.yml`)
- Kubernetes manifests
- Ansible playbooks
- Prometheus configuration

---

## 📋 Practical 1: YAML Syntax

### Basic Data Types

```yaml
# ── Strings ──────────────────────────────────────
name: John Doe                    # Plain string
greeting: "Hello, World!"         # Quoted string
message: 'It''s a DevOps world'   # Single-quoted (escape with '')

# ── Numbers ──────────────────────────────────────
age: 25                           # Integer
price: 19.99                      # Float
port: 8080

# ── Booleans ─────────────────────────────────────
is_active: true
is_deleted: false
debug_mode: yes                   # Also valid boolean
production: no

# ── Null values ──────────────────────────────────
value: null
empty: ~

# ── Comments ─────────────────────────────────────
# This is a comment — YAML ignores this line
```

### Lists (Sequences)

```yaml
# Block style (most common)
fruits:
  - apple
  - banana
  - cherry

# Inline (flow) style
colors: [red, green, blue]

# List of objects
servers:
  - name: web-01
    ip: 10.0.0.1
    role: webserver
  - name: db-01
    ip: 10.0.0.2
    role: database
```

### Dictionaries (Mappings)

```yaml
# Block style
database:
  host: localhost
  port: 5432
  name: devopsdb
  user: admin

# Inline (flow) style
database: {host: localhost, port: 5432, name: devopsdb}
```

### Nested Structures

```yaml
application:
  name: my-devops-app
  version: "1.0.0"
  server:
    host: 0.0.0.0
    port: 8080
    debug: false
  database:
    host: db-server
    port: 5432
    name: appdb
    credentials:
      username: appuser
      password: secret123
  features:
    - authentication
    - logging
    - monitoring
```

### Multi-line Strings

```yaml
# Literal block (|) — preserves newlines
script: |
  #!/bin/bash
  echo "Hello DevOps"
  apt update
  apt install -y nginx

# Folded block (>) — newlines become spaces
description: >
  This is a long description
  that spans multiple lines
  but will be joined into one.
```

### Anchors and Aliases (Reusability)

```yaml
# Define a reusable block with & (anchor)
defaults: &defaults
  restart: always
  networks:
    - app-network

# Reuse it with * (alias)
services:
  web:
    <<: *defaults          # Merge the defaults
    image: nginx:alpine

  api:
    <<: *defaults          # Reuse again
    image: my-api:latest
```

---

## 📋 Practical 2: YAML in Docker Compose

```yaml
version: "3.8"

# Define an anchor for common settings
x-common: &common
  restart: always
  networks:
    - app-network

services:
  app:
    <<: *common
    build: ./app
    image: devops-app:latest
    ports:
      - "5000:5000"
    environment:
      APP_ENV: production
      DB_HOST: db
      DB_PORT: "5432"
    depends_on:
      db:
        condition: service_healthy

  db:
    <<: *common
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: devopsdb
      POSTGRES_USER: devuser
      POSTGRES_PASSWORD: devpassword
    volumes:
      - db-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U devuser -d devopsdb"]
      interval: 10s
      timeout: 5s
      retries: 5

  nginx:
    <<: *common
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - app

volumes:
  db-data:

networks:
  app-network:
    driver: bridge
```

---

## 📋 Practical 3: YAML in GitHub Actions

```yaml
name: DevOps CI Pipeline

on:
  push:
    branches:
      - main
      - 'release/*'           # Wildcard matching
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 0 * * 1'       # Run every Monday at midnight

env:
  REGISTRY: docker.io
  IMAGE: ${{ github.repository }}

jobs:
  test:
    name: Test on ${{ matrix.os }}
    runs-on: ${{ matrix.os }}

    strategy:
      fail-fast: false
      matrix:
        os: [ubuntu-latest, windows-latest]
        python-version: ['3.10', '3.11']

    steps:
      - uses: actions/checkout@v4

      - name: Set up Python ${{ matrix.python-version }}
        uses: actions/setup-python@v4
        with:
          python-version: ${{ matrix.python-version }}

      - name: Run tests
        run: python -m pytest tests/ -v

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production     # Requires approval in GitHub settings

    steps:
      - uses: actions/checkout@v4

      - name: Deploy
        run: echo "Deploying to production..."
```

---

## 📋 Practical 4: Ansible Playbook (YAML)

**Ansible** uses YAML to define automation tasks called **playbooks**.

```yaml
---
# ansible-playbook install-docker.yml

- name: Install Docker on Ubuntu servers
  hosts: webservers
  become: yes                   # Run as sudo

  vars:
    docker_packages:
      - docker.io
      - docker-compose
    docker_user: ubuntu

  tasks:
    - name: Update apt cache
      apt:
        update_cache: yes

    - name: Install Docker packages
      apt:
        name: "{{ docker_packages }}"
        state: present

    - name: Start and enable Docker service
      systemd:
        name: docker
        state: started
        enabled: yes

    - name: Add user to docker group
      user:
        name: "{{ docker_user }}"
        groups: docker
        append: yes

    - name: Verify Docker installation
      command: docker --version
      register: docker_version

    - name: Print Docker version
      debug:
        msg: "Docker installed: {{ docker_version.stdout }}"
```

---

## 📋 Practical 5: Prometheus Configuration (YAML)

```yaml
# prometheus.yml

global:
  scrape_interval: 15s
  evaluation_interval: 15s
  external_labels:
    environment: production
    region: us-east-1

alerting:
  alertmanagers:
    - static_configs:
        - targets:
            - alertmanager:9093

rule_files:
  - "alert_rules.yml"
  - "recording_rules.yml"

scrape_configs:
  - job_name: prometheus
    static_configs:
      - targets: ['localhost:9090']

  - job_name: node-exporter
    scrape_interval: 30s
    static_configs:
      - targets:
          - node-01:9100
          - node-02:9100

  - job_name: app-metrics
    metrics_path: /metrics
    static_configs:
      - targets: ['app:5000']
    relabel_configs:
      - source_labels: [__address__]
        target_label: instance
```

---

## 🔧 YAML Validation

```bash
# Validate YAML syntax using Python
python3 -c "import yaml; yaml.safe_load(open('config.yml'))"

# Install yamllint
pip install yamllint

# Lint a YAML file
yamllint docker-compose.yml
```

---

## ⚠️ Common YAML Mistakes

| Mistake | Problem | Fix |
|---------|---------|-----|
| Mixing tabs and spaces | YAML only allows spaces | Use 2 spaces for indentation |
| Missing colon after key | Parse error | `key: value` not `key value` |
| Incorrect indentation | Wrong structure | Be consistent |
| Unquoted special chars | Parse error | Quote values with `:`, `#`, `{` |
| Boolean ambiguity | `yes`/`no` parsed as bool | Quote strings: `"yes"` |

---

> Next: [10 — Shell Scripting](../10-Shell-Scripting/README.md)
