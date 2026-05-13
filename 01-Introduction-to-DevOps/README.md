# 01 — Introduction to DevOps

> Understanding the culture, principles, and lifecycle of DevOps.

---

## 📖 What is DevOps?

**DevOps** is a combination of **Development (Dev)** and **Operations (Ops)**. It is a culture, philosophy, and set of practices that bridges the gap between software development teams and IT operations teams.

The goal of DevOps is to:
- Shorten the software development lifecycle
- Deliver features, fixes, and updates frequently and reliably
- Improve collaboration between Dev and Ops teams

---

## 🔄 DevOps Lifecycle

The DevOps lifecycle consists of the following continuous phases:

| Phase | Description | Tools |
|-------|-------------|-------|
| **Plan** | Define requirements and plan work | Jira, Trello |
| **Code** | Write and review code | Git, GitHub |
| **Build** | Compile and build the application | Maven, Gradle |
| **Test** | Automated testing | JUnit, Selenium |
| **Release** | Version and release management | Jenkins, GitHub Actions |
| **Deploy** | Deploy to environments | Docker, Ansible |
| **Operate** | Manage infrastructure | Terraform, Linux |
| **Monitor** | Track performance and errors | Prometheus, Grafana |

---

## 🆚 DevOps vs Traditional IT

| Aspect | Traditional IT | DevOps |
|--------|---------------|--------|
| Development cycle | Long (months) | Short (days/weeks) |
| Deployment frequency | Rare | Frequent |
| Team collaboration | Siloed | Unified |
| Failure recovery | Slow | Fast |
| Automation | Minimal | Extensive |
| Feedback loop | Delayed | Continuous |

---

## 🏗️ Core DevOps Principles

### 1. Continuous Integration (CI)
Developers integrate code changes frequently (multiple times a day). Each integration is verified by automated builds and tests.

### 2. Continuous Delivery (CD)
The code is always in a deployable state. Releases can happen at any time with a single click.

### 3. Continuous Deployment
Every change that passes all stages of the pipeline is automatically deployed to production.

### 4. Infrastructure as Code (IaC)
Infrastructure is managed and provisioned through code rather than manual processes.

### 5. Monitoring and Feedback
Continuous monitoring of applications and infrastructure provides fast feedback loops.

---

## 🆚 CI vs CD vs Continuous Deployment

| Concept | Definition | Goal |
|---------|-----------|------|
| **CI** | Merge code frequently, test automatically | Catch bugs early |
| **CD (Delivery)** | Always have deployable code | Ready to release anytime |
| **CD (Deployment)** | Auto-deploy every passing change | Zero-touch releases |

---

## 🔧 Essential DevOps Tools

### Version Control
- **Git** — Distributed version control
- **GitHub / GitLab** — Remote repository hosting

### Containerization
- **Docker** — Build and run containers
- **Docker Compose** — Multi-container apps

### CI/CD
- **Jenkins** — Open-source automation server
- **GitHub Actions** — Cloud-native CI/CD

### Monitoring
- **Prometheus** — Metrics collection
- **Grafana** — Metrics visualization
- **ELK Stack** — Log management

### Infrastructure as Code
- **YAML** — Configuration language
- **Ansible** — Configuration management

---

## 📊 DevOps Culture

DevOps is not just a set of tools — it is a **mindset shift**:

- **Collaboration** over silos
- **Automation** over manual processes
- **Continuous improvement** over stagnation
- **Shared responsibility** over blame
- **Feedback-driven** over assumption-driven

---

## ✅ Summary

- DevOps bridges Dev and Ops teams for faster, reliable delivery.
- The DevOps lifecycle is continuous: Plan → Code → Build → Test → Release → Deploy → Operate → Monitor.
- Core practices include CI/CD, IaC, and continuous monitoring.
- Tools like Git, Docker, Jenkins, and Prometheus are fundamental to DevOps.

---

> Next: [02 — Linux Basics](../02-Linux-Basics/README.md)
