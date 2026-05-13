# 07 — CI/CD Pipeline

> Automate testing and deployment with Continuous Integration and Continuous Delivery.

---

## 📖 What is CI/CD?

**CI/CD** is a method of frequently delivering apps to customers by introducing automation into the stages of app development.

| Term | Full Form | Meaning |
|------|-----------|---------|
| **CI** | Continuous Integration | Automatically build and test on every code push |
| **CD** | Continuous Delivery | Automatically prepare code for release |
| **CD** | Continuous Deployment | Automatically deploy every passing change |

---

## 🔄 CI/CD Pipeline Flow

```
Developer pushes code
        │
        ▼
┌──────────────────┐
│    Source Code   │ ← GitHub / GitLab
│    (Trigger)     │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│      Build       │ ← Compile, package
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│      Test        │ ← Unit, integration, linting
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Security Scan   │ ← Dependency vulnerabilities
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│    Staging       │ ← Deploy to test environment
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   Production     │ ← Deploy to live environment
└──────────────────┘
```

---

## 🆚 CI vs CD

| Aspect | CI | CD (Delivery) | CD (Deployment) |
|--------|-----|--------------|-----------------|
| Trigger | Every commit | After CI passes | After CI passes |
| Goal | Catch bugs early | Ready for release | Auto-release |
| Human approval | After CI | Before deployment | Not required |
| Speed | Fast | Fast | Fastest |

---

## 📋 Practical 1: GitHub Actions CI Pipeline

### Objective
Set up automated CI using GitHub Actions — runs on every push.

### File Location
`.github/workflows/ci.yml`

### Complete GitHub Actions Workflow

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'

      - name: Install dependencies
        run: |
          pip install -r requirements.txt

      - name: Run linter
        run: |
          pip install flake8
          flake8 . --count --max-line-length=127

      - name: Run tests
        run: |
          python -m pytest tests/ -v

      - name: Build Docker image
        run: |
          docker build -t my-app:${{ github.sha }} .

      - name: Login to Docker Hub
        if: github.ref == 'refs/heads/main'
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Push Docker image
        if: github.ref == 'refs/heads/main'
        run: |
          docker tag my-app:${{ github.sha }} \
            ${{ secrets.DOCKERHUB_USERNAME }}/my-app:latest
          docker push ${{ secrets.DOCKERHUB_USERNAME }}/my-app:latest
```

### Key GitHub Actions Concepts

| Concept | Description |
|---------|-------------|
| **Workflow** | Automated process defined in YAML |
| **Event** | What triggers the workflow (`push`, `pull_request`) |
| **Job** | A set of steps that run on the same runner |
| **Step** | Individual task within a job |
| **Action** | Reusable step (`uses: actions/checkout@v4`) |
| **Runner** | The machine where the job runs |
| **Secret** | Encrypted environment variable |

---

## 📋 Practical 2: Node.js CI with GitHub Actions

```yaml
name: Node.js CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x, 20.x]    # Test on multiple Node versions

    steps:
      - uses: actions/checkout@v4

      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: test-results
          path: test-results/
```

---

## 📋 Practical 3: Docker Build and Push Workflow

```yaml
name: Docker Build and Push

on:
  push:
    branches: [main]
    tags: ['v*.*.*']

env:
  IMAGE_NAME: my-devops-app

jobs:
  docker:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ secrets.DOCKERHUB_USERNAME }}/${{ env.IMAGE_NAME }}
          tags: |
            type=semver,pattern={{version}}
            type=sha,prefix=sha-
            type=raw,value=latest,enable=${{ github.ref == 'refs/heads/main' }}

      - name: Build and Push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

---

## 🔐 Managing Secrets in GitHub Actions

### How to Add Secrets
1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN`

### Using Secrets in Workflow

```yaml
env:
  MY_SECRET: ${{ secrets.MY_SECRET_NAME }}

# Or directly in steps:
steps:
  - run: echo "User is ${{ secrets.DOCKERHUB_USERNAME }}"
```

---

## 🔧 CI/CD Best Practices

| Practice | Reason |
|----------|--------|
| Run tests on every push | Catch bugs early |
| Use caching | Speed up builds |
| Fail fast | Don't waste time on broken builds |
| Keep pipelines simple | Easier to debug |
| Use secrets for credentials | Never hardcode passwords |
| Tag Docker images properly | Track what's deployed |
| Run only on relevant branches | Avoid wasted CI minutes |

---

## 📌 GitHub Actions Quick Reference

| Trigger | YAML |
|---------|------|
| On push to main | `on: push: branches: [main]` |
| On pull request | `on: pull_request: branches: [main]` |
| On schedule (cron) | `on: schedule: - cron: '0 0 * * *'` |
| Manual trigger | `on: workflow_dispatch` |

---

> Next: [08 — Monitoring & Logging](../08-Monitoring-and-Logging/README.md)
