# 06 — Jenkins

> Automate builds, tests, and deployments with Jenkins CI/CD.

---

## 📖 What is Jenkins?

**Jenkins** is an open-source automation server used to automate the building, testing, and deployment of software. It is one of the most widely used CI/CD tools in DevOps.

Jenkins is written in Java and supports hundreds of plugins for integration with tools like Git, Docker, Maven, and Slack.

---

## 🏗️ Jenkins Architecture

```
┌─────────────────────────────────────────────┐
│                Jenkins Master               │
│  - Manages build jobs                       │
│  - Schedules builds                         │
│  - Monitors agents                          │
│  - Web UI on port 8080                      │
└──────────────────┬──────────────────────────┘
                   │
        ┌──────────┼──────────┐
        ▼          ▼          ▼
   ┌─────────┐ ┌─────────┐ ┌─────────┐
   │ Agent 1 │ │ Agent 2 │ │ Agent 3 │
   │ (Linux) │ │ (Win)   │ │ (Docker)│
   └─────────┘ └─────────┘ └─────────┘
```

---

## 📋 Practical 1: Install Jenkins on Ubuntu

### Objective
Install and access Jenkins on an Ubuntu server.

### Prerequisites
- Ubuntu 20.04 or 22.04
- Java 11 or 17

### Step-by-Step

```bash
# Step 1: Update system
sudo apt update && sudo apt upgrade -y
```

```bash
# Step 2: Install Java (Jenkins requires JDK)
sudo apt install -y openjdk-17-jdk
java -version
```
> Verify Java is installed. Expected output: `openjdk version "17.x.x"`

```bash
# Step 3: Add Jenkins repository key
curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key \
  | sudo tee /usr/share/keyrings/jenkins-keyring.asc > /dev/null
```

```bash
# Step 4: Add Jenkins to apt sources
echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
  https://pkg.jenkins.io/debian-stable binary/ \
  | sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null
```

```bash
# Step 5: Install Jenkins
sudo apt update
sudo apt install -y jenkins
```

```bash
# Step 6: Start and enable Jenkins service
sudo systemctl start jenkins
sudo systemctl enable jenkins
sudo systemctl status jenkins
```
> Jenkins runs on **port 8080** by default.

```bash
# Step 7: Get the initial admin password
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```
> Copy this password — you'll need it to unlock Jenkins in the browser.

### Access Jenkins
- Open browser: `http://your-server-ip:8080`
- Enter the initial admin password
- Install suggested plugins
- Create your admin user

---

## 📋 Practical 2: Run Jenkins with Docker

### Objective
Run Jenkins inside a Docker container (faster setup).

```bash
# Create a volume to persist Jenkins data
docker volume create jenkins-data
```

```bash
# Run Jenkins container
docker run -d \
  --name jenkins \
  -p 8080:8080 \
  -p 50000:50000 \
  -v jenkins-data:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  jenkins/jenkins:lts
```
> - `-p 8080:8080` → Jenkins web UI
> - `-p 50000:50000` → Jenkins agent communication port
> - `-v jenkins-data:/var/jenkins_home` → Persist Jenkins configuration
> - `-v /var/run/docker.sock:/var/run/docker.sock` → Allow Jenkins to run Docker commands

```bash
# Get the initial password
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

---

## 📋 Practical 3: Creating Your First Jenkins Pipeline

### Objective
Create a declarative Jenkins pipeline that builds and tests a simple application.

### What is a Jenkinsfile?

A **Jenkinsfile** defines the pipeline as code. It is stored in the repository alongside the application code.

### Declarative Pipeline Syntax

```groovy
pipeline {
    agent any          // Run on any available agent

    stages {
        stage('Stage Name') {
            steps {
                // Commands to execute
            }
        }
    }

    post {
        always { }     // Run always
        success { }    // Run on success
        failure { }    // Run on failure
    }
}
```

### Simple Jenkinsfile Example

```groovy
pipeline {
    agent any

    environment {
        APP_NAME = 'my-devops-app'
        APP_VERSION = '1.0.0'
    }

    stages {
        stage('Checkout') {
            steps {
                echo "Cloning repository..."
                checkout scm
            }
        }

        stage('Build') {
            steps {
                echo "Building ${APP_NAME} version ${APP_VERSION}..."
                sh 'echo "Build complete"'
            }
        }

        stage('Test') {
            steps {
                echo "Running tests..."
                sh 'echo "All tests passed"'
            }
        }

        stage('Deploy') {
            steps {
                echo "Deploying to staging..."
                sh 'echo "Deployment successful"'
            }
        }
    }

    post {
        success {
            echo "Pipeline succeeded! ${APP_NAME} deployed."
        }
        failure {
            echo "Pipeline failed. Check the logs."
        }
        always {
            echo "Pipeline finished."
        }
    }
}
```

### Create Pipeline in Jenkins UI
1. Go to Jenkins Dashboard → **New Item**
2. Enter name → Select **Pipeline** → Click OK
3. Under **Pipeline**, select **Pipeline script from SCM**
4. Set SCM to **Git** and enter your repo URL
5. Set Script Path to `Jenkinsfile`
6. Click **Save** then **Build Now**

---

## 📋 Practical 4: Jenkins Pipeline with Docker

### Objective
Use Jenkins to build and run Docker images as part of the pipeline.

```groovy
pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t my-app:${BUILD_NUMBER} .'
            }
        }

        stage('Run Tests') {
            steps {
                sh '''
                    docker run --rm my-app:${BUILD_NUMBER} python -m pytest tests/
                '''
            }
        }

        stage('Push to Registry') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-credentials',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                        docker tag my-app:${BUILD_NUMBER} $DOCKER_USER/my-app:${BUILD_NUMBER}
                        docker push $DOCKER_USER/my-app:${BUILD_NUMBER}
                    '''
                }
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    docker stop my-app || true
                    docker rm my-app || true
                    docker run -d --name my-app -p 5000:5000 my-app:${BUILD_NUMBER}
                '''
            }
        }
    }

    post {
        always {
            sh 'docker image prune -f'
        }
    }
}
```

---

## 📋 Practical 5: Jenkins Environment Variables

### Built-in Variables

| Variable | Description |
|----------|-------------|
| `BUILD_NUMBER` | Current build number |
| `BUILD_ID` | Build ID |
| `JOB_NAME` | Name of the pipeline |
| `WORKSPACE` | Path to the build workspace |
| `GIT_COMMIT` | Git commit hash |
| `GIT_BRANCH` | Git branch name |
| `BUILD_URL` | URL of the build in Jenkins |

```groovy
stage('Info') {
    steps {
        echo "Job: ${env.JOB_NAME}"
        echo "Build Number: ${env.BUILD_NUMBER}"
        echo "Branch: ${env.GIT_BRANCH}"
        echo "Workspace: ${env.WORKSPACE}"
    }
}
```

---

## 🔧 Important Jenkins Plugins

| Plugin | Purpose |
|--------|---------|
| **Git Plugin** | Clone Git repositories |
| **Docker Pipeline** | Use Docker in pipelines |
| **Blue Ocean** | Modern pipeline UI |
| **Credentials Plugin** | Manage secrets securely |
| **Email Extension** | Send email notifications |
| **GitHub Integration** | Trigger builds from GitHub |
| **Pipeline** | Core pipeline functionality |

---

## ✅ Summary

- Jenkins automates the CI/CD pipeline — build, test, deploy.
- **Jenkinsfile** defines the pipeline as code stored in your repo.
- Pipelines have **stages** (Checkout, Build, Test, Deploy) and **steps**.
- Jenkins integrates with Git, Docker, and many other tools.
- Use **credentials** to securely manage passwords and tokens.

---

> Next: [07 — CI/CD](../07-CI-CD/README.md)
