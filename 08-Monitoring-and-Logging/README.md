# 08 — Monitoring & Logging

> Monitor your infrastructure and applications with Prometheus, Grafana, and the ELK Stack.

---

## 📖 Why Monitoring & Logging?

In production environments, monitoring and logging are essential for:
- Detecting issues **before** users are affected
- Understanding application performance
- Debugging production problems
- Capacity planning and optimization
- Meeting SLA (Service Level Agreement) requirements

---

## 🆚 Monitoring vs Logging

| Aspect | Monitoring | Logging |
|--------|-----------|---------|
| **What it captures** | Metrics (numbers over time) | Events (text records) |
| **Use case** | Detect anomalies, set alerts | Debug issues, audit trail |
| **Examples** | CPU 90%, Response time 500ms | "ERROR: DB connection failed" |
| **Tools** | Prometheus, Grafana | ELK Stack, Loki |
| **Storage** | Time-series database | Search-optimized database |

---

## 🏗️ Monitoring Stack Overview

```
Application / Server
        │
        ▼
┌──────────────────┐
│   Prometheus     │ ← Collects metrics (pulls from exporters)
│  (Port: 9090)    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│    Grafana       │ ← Visualizes metrics with dashboards
│   (Port: 3000)   │
└──────────────────┘
```

---

## 🔵 Prometheus

### What is Prometheus?
**Prometheus** is an open-source monitoring and alerting toolkit. It collects metrics by **scraping** HTTP endpoints at regular intervals and stores them in a time-series database.

### Key Concepts

| Term | Definition |
|------|-----------|
| **Metric** | A measurement at a point in time |
| **Scrape** | Prometheus pulling metrics from a target |
| **Exporter** | An agent that exposes metrics for Prometheus |
| **PromQL** | Prometheus Query Language |
| **Alert** | A rule that fires when a condition is met |

### Metric Types

| Type | Description | Example |
|------|-------------|---------|
| **Counter** | Only increases | HTTP requests total |
| **Gauge** | Can go up or down | CPU usage, memory |
| **Histogram** | Observations in buckets | Request duration |
| **Summary** | Similar to histogram | Response sizes |

---

## 📋 Practical 1: Prometheus + Grafana with Docker Compose

### Objective
Run Prometheus and Grafana together to monitor a system.

### Project Structure

```
monitoring/
├── docker-compose.yml
├── prometheus/
│   └── prometheus.yml
└── grafana/
    └── provisioning/
```

### prometheus/prometheus.yml

```yaml
global:
  scrape_interval: 15s         # Scrape every 15 seconds
  evaluation_interval: 15s     # Evaluate rules every 15 seconds

rule_files:
  # - "alert_rules.yml"        # Alerting rules (optional)

scrape_configs:
  # Prometheus monitors itself
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  # Monitor the host machine using node_exporter
  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']

  # Monitor Docker containers
  - job_name: 'cadvisor'
    static_configs:
      - targets: ['cadvisor:8080']
```

### docker-compose.yml

```yaml
version: "3.8"

services:
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus-data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.retention.time=15d'
    networks:
      - monitoring

  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_USER=admin
      - GF_SECURITY_ADMIN_PASSWORD=admin123
    volumes:
      - grafana-data:/var/lib/grafana
    depends_on:
      - prometheus
    networks:
      - monitoring

  node-exporter:
    image: prom/node-exporter:latest
    container_name: node-exporter
    ports:
      - "9100:9100"
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    command:
      - '--path.procfs=/host/proc'
      - '--path.sysfs=/host/sys'
    networks:
      - monitoring

  cadvisor:
    image: gcr.io/cadvisor/cadvisor:latest
    container_name: cadvisor
    ports:
      - "8080:8080"
    volumes:
      - /:/rootfs:ro
      - /var/run:/var/run:rw
      - /sys:/sys:ro
      - /var/lib/docker/:/var/lib/docker:ro
    networks:
      - monitoring

networks:
  monitoring:
    driver: bridge

volumes:
  prometheus-data:
  grafana-data:
```

### Running the Stack

```bash
docker-compose up -d
```

```bash
# Access Prometheus UI
open http://localhost:9090

# Access Grafana UI
open http://localhost:3000
# Login: admin / admin123
```

### Setting Up Grafana

1. Login to Grafana at `http://localhost:3000`
2. Go to **Configuration** → **Data Sources**
3. Click **Add data source** → Select **Prometheus**
4. Set URL to `http://prometheus:9090`
5. Click **Save & Test**
6. Go to **Dashboards** → **Import**
7. Enter Dashboard ID `1860` (Node Exporter Full) → Click **Load**

---

## 📋 Practical 2: Useful PromQL Queries

```promql
# CPU usage percentage
100 - (avg by(instance) (irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)

# Memory usage
(node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes * 100

# Disk usage
(node_filesystem_size_bytes - node_filesystem_free_bytes) / node_filesystem_size_bytes * 100

# HTTP request rate
rate(http_requests_total[5m])

# Error rate
rate(http_requests_total{status=~"5.."}[5m])
```

---

## 🟠 ELK Stack

### What is ELK?

The **ELK Stack** is a collection of three open-source tools for log management:

| Letter | Tool | Role |
|--------|------|------|
| **E** | Elasticsearch | Stores and searches logs |
| **L** | Logstash | Collects, parses, transforms logs |
| **K** | Kibana | Visualizes and explores logs |

Modern ELK often includes **Beats** (lightweight data shippers):
- **Filebeat** — Ships log files
- **Metricbeat** — Ships system metrics

### ELK Data Flow

```
Application Logs
      │
      ▼
┌──────────────┐
│  Filebeat    │ ← Reads log files from disk
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Logstash    │ ← Parses and enriches logs
└──────┬───────┘
       │
       ▼
┌──────────────┐
│Elasticsearch │ ← Stores indexed logs
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Kibana     │ ← Visualizes and searches logs
└──────────────┘
```

---

## 📋 Practical 3: Key Monitoring Concepts

### SLI, SLO, SLA

| Term | Full Form | Definition |
|------|-----------|-----------|
| **SLI** | Service Level Indicator | A metric measuring service performance (e.g., 99.5% uptime) |
| **SLO** | Service Level Objective | Target value for the SLI (e.g., 99.9% uptime) |
| **SLA** | Service Level Agreement | Contract with users about the SLO |

### The Four Golden Signals

Google's Site Reliability Engineering (SRE) book defines four key metrics to monitor:

| Signal | Definition | Example |
|--------|-----------|---------|
| **Latency** | Time to serve a request | API response time |
| **Traffic** | Demand on the system | Requests per second |
| **Errors** | Rate of failed requests | HTTP 5xx errors |
| **Saturation** | How full the system is | CPU, memory usage |

---

## 📌 Monitoring Quick Reference

| Tool | Port | Purpose |
|------|------|---------|
| Prometheus | 9090 | Metrics collection |
| Grafana | 3000 | Metrics visualization |
| Node Exporter | 9100 | Host system metrics |
| cAdvisor | 8080 | Container metrics |
| Elasticsearch | 9200 | Log storage |
| Kibana | 5601 | Log visualization |

---

> Next: [09 — Infrastructure as Code](../09-Infrastructure-as-Code/README.md)
