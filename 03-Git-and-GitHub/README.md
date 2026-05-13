# 03 — Git & GitHub

> Master version control with Git and collaborate using GitHub.

---

## 📖 What is Git?

**Git** is a distributed version control system that tracks changes in source code. It allows multiple developers to collaborate on a project simultaneously.

## 📖 What is GitHub?

**GitHub** is a cloud-based hosting platform for Git repositories. It adds collaboration features like pull requests, issues, and GitHub Actions (CI/CD).

---

## 🆚 Git vs GitHub

| Feature | Git | GitHub |
|---------|-----|--------|
| Type | Version control tool | Cloud hosting platform |
| Works offline | ✅ Yes | ❌ No |
| Collaboration | Limited (local) | Full (remote teams) |
| Installation | Install locally | Web-based (no install) |
| Purpose | Track code changes | Host & share repositories |
| Free | ✅ Open source | ✅ Free tier available |

---

## 🔑 Core Git Concepts

| Term | Definition |
|------|-----------|
| **Repository (Repo)** | A project folder tracked by Git |
| **Commit** | A snapshot of changes with a message |
| **Branch** | An independent line of development |
| **Merge** | Combining branches together |
| **Clone** | Copying a remote repo to local |
| **Push** | Uploading local commits to remote |
| **Pull** | Downloading remote changes to local |
| **Staging Area** | Where you prepare files before committing |

---

## 📋 Practical 1: Git Setup and First Repository

### Objective
Install Git, configure it, and create your first repository.

### Prerequisites
- Git installed: `sudo apt install git`

### Step-by-Step

```bash
# Step 1: Verify Git installation
git --version
```
> Confirms Git is installed. Expected output: `git version 2.x.x`

```bash
# Step 2: Configure your identity (one-time setup)
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```
> Sets your name and email — this appears in every commit you make.

```bash
# Step 3: Verify configuration
git config --list
```
> Shows all Git configuration settings.

```bash
# Step 4: Initialize a new repository
mkdir my-devops-project
cd my-devops-project
git init
```
> `git init` → Creates a hidden `.git` folder that makes this directory a Git repository.

```bash
# Step 5: Create a file and check status
echo "# My DevOps Project" > README.md
git status
```
> `git status` → Shows untracked, modified, and staged files.

```bash
# Step 6: Stage the file
git add README.md
# Or stage everything:
git add .
```
> `git add` → Moves files to the staging area, preparing them for a commit.

```bash
# Step 7: Commit the change
git commit -m "Initial commit: add README"
```
> `git commit -m` → Creates a snapshot of the staged files with a descriptive message.

```bash
# Step 8: View commit history
git log
git log --oneline    # Compact view
```

### Expected Output

```
$ git log --oneline
a3f5c21 Initial commit: add README
```

---

## 📋 Practical 2: Working with Branches

### Objective
Create, switch, and merge branches.

### Commands

```bash
# View all branches
git branch
git branch -a    # Include remote branches
```
> `*` marks the current active branch.

```bash
# Create a new branch
git branch feature/login
```

```bash
# Switch to the branch
git checkout feature/login
# Or create and switch in one command:
git checkout -b feature/login
```
> `git checkout -b` → Creates and immediately switches to the new branch.

```bash
# Make changes and commit on the branch
echo "Login feature code" > login.py
git add login.py
git commit -m "Add login feature"
```

```bash
# Switch back to main
git checkout main

# Merge the feature branch into main
git merge feature/login
```
> `git merge` → Integrates changes from one branch into the current branch.

```bash
# Delete the merged branch (cleanup)
git branch -d feature/login
```

---

## 📋 Practical 3: Connecting to GitHub

### Objective
Push a local repository to GitHub.

### Prerequisites
- GitHub account created at [github.com](https://github.com)

### Step-by-Step

```bash
# Step 1: Create a repo on GitHub (via the website), then:

# Step 2: Add remote origin
git remote add origin https://github.com/yourusername/my-devops-project.git
```
> `git remote add origin` → Links your local repo to the remote GitHub repo.

```bash
# Step 3: Push to GitHub
git push -u origin main
```
> `git push -u origin main` → Uploads your commits to GitHub. `-u` sets the upstream for future pushes.

```bash
# Step 4: Pull latest changes from GitHub
git pull origin main
```
> `git pull` → Downloads and merges the latest changes from GitHub.

---

## 📋 Practical 4: Cloning and Forking

### Objective
Clone an existing repository and understand forking.

```bash
# Clone a repository
git clone https://github.com/someuser/some-repo.git
cd some-repo
```
> `git clone` → Creates a complete local copy of the remote repository including all branches and history.

### Fork vs Clone

| Action | Fork | Clone |
|--------|------|-------|
| Where it happens | On GitHub | On your local machine |
| Purpose | Contribute to others' repos | Work on any repo locally |
| Creates a copy on GitHub | ✅ Yes | ❌ No |
| Use case | Open source contributions | Personal/team work |

---

## 📋 Practical 5: .gitignore File

### Objective
Prevent unnecessary files from being tracked by Git.

### Create `.gitignore`

```bash
touch .gitignore
```

### Sample `.gitignore`

```gitignore
# OS files
.DS_Store
Thumbs.db

# Logs
*.log
logs/

# Environment files (sensitive data)
.env
.env.local

# Python
__pycache__/
*.pyc
venv/

# Node.js
node_modules/
npm-debug.log

# Docker
.dockerignore

# Build artifacts
dist/
build/
*.jar
*.war
```

```bash
# Add and commit .gitignore
git add .gitignore
git commit -m "Add .gitignore"
```

---

## 📋 Practical 6: Undoing Changes

### Objective
Understand how to undo mistakes safely.

```bash
# Undo unstaged changes (restore file to last commit)
git checkout -- filename.txt
```

```bash
# Unstage a staged file (remove from staging area)
git reset HEAD filename.txt
```

```bash
# Undo the last commit (keep changes in working directory)
git reset --soft HEAD~1
```

```bash
# View differences
git diff                 # Unstaged changes
git diff --staged        # Staged changes vs last commit
```

---

## 🔄 Git Workflow Summary

```
Working Directory → git add → Staging Area → git commit → Local Repo → git push → Remote (GitHub)
```

---

## 📌 Git Command Quick Reference

| Command | Description |
|---------|-------------|
| `git init` | Initialize repo |
| `git clone <url>` | Clone remote repo |
| `git status` | Check file status |
| `git add .` | Stage all changes |
| `git commit -m "msg"` | Commit staged changes |
| `git push origin main` | Push to GitHub |
| `git pull origin main` | Pull from GitHub |
| `git branch <name>` | Create branch |
| `git checkout <branch>` | Switch branch |
| `git merge <branch>` | Merge branch |
| `git log --oneline` | View commit history |
| `git diff` | View changes |
| `git reset --soft HEAD~1` | Undo last commit |

---

> Next: [04 — Docker](../04-Docker/README.md)
