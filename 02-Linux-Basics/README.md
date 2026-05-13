# 02 — Linux Basics

> Essential Linux commands every DevOps engineer must know.

---

## 📖 Why Linux for DevOps?

Most servers, cloud environments, and containers run on **Linux**. As a DevOps engineer, you will work with Linux daily for:
- Managing servers
- Writing shell scripts
- Running Docker containers
- Configuring CI/CD pipelines

---

## 🗂️ Linux File System Structure

```
/                   ← Root directory (top of filesystem)
├── bin/            ← Essential user binaries (ls, cp, mv)
├── etc/            ← System configuration files
├── home/           ← User home directories
├── var/            ← Variable data (logs, databases)
├── tmp/            ← Temporary files
├── usr/            ← User programs and utilities
├── dev/            ← Device files
└── proc/           ← Virtual filesystem for process info
```

---

## 📋 Practical 1: File & Directory Operations

### Objective
Learn to create, navigate, copy, move, and delete files and directories.

### Commands

```bash
# Print current working directory
pwd
```
> `pwd` → Shows the full path of your current location.

```bash
# List files and directories
ls
ls -l       # Detailed list with permissions
ls -la      # Include hidden files
ls -lh      # Human-readable file sizes
```
> `ls` → Lists contents of a directory. `-l` for details, `-a` for hidden files, `-h` for readable sizes.

```bash
# Change directory
cd /home
cd ..       # Go up one level
cd ~        # Go to home directory
cd -        # Go to previous directory
```
> `cd` → Navigate between directories.

```bash
# Create a directory
mkdir devops-practice
mkdir -p projects/devops/docker    # Create nested directories
```
> `mkdir` → Makes a new directory. `-p` creates all parent directories that don't exist.

```bash
# Create files
touch file1.txt
touch notes.md config.yml
```
> `touch` → Creates an empty file or updates the timestamp of an existing file.

```bash
# Copy files and directories
cp file1.txt file2.txt             # Copy file
cp -r folder1/ folder2/            # Copy directory recursively
```
> `cp` → Copies files or directories. `-r` is required for directories.

```bash
# Move or rename
mv file1.txt renamed.txt           # Rename file
mv file.txt /home/user/Documents/  # Move file to another location
```
> `mv` → Moves or renames files and directories.

```bash
# Remove files and directories
rm file.txt                        # Remove a file
rm -rf foldername/                 # Force remove directory and contents
```
> `rm` → Deletes files. Use `-rf` carefully — it deletes recursively and without prompts.

### Expected Output

```
$ pwd
/home/user

$ ls -lh
total 20K
drwxr-xr-x 2 user user 4.0K May 10 10:00 devops-practice
-rw-r--r-- 1 user user  512 May 10 10:01 file1.txt
```

---

## 📋 Practical 2: File Content & Viewing

### Objective
Read, view, and manipulate file contents from the terminal.

### Commands

```bash
# View full file content
cat file.txt
```
> `cat` → Displays the entire content of a file.

```bash
# View large files page by page
less file.txt     # Scroll with arrow keys, q to quit
more file.txt     # Similar but simpler
```
> `less` → View files one screen at a time. Press `q` to exit.

```bash
# View first/last lines
head -n 10 file.txt    # Show first 10 lines
tail -n 10 file.txt    # Show last 10 lines
tail -f logfile.log    # Follow file in real time (great for logs)
```
> `head` and `tail` → View beginning or end of a file. `tail -f` is essential for monitoring logs.

```bash
# Write text to a file
echo "Hello DevOps" > file.txt     # Overwrite
echo "New line" >> file.txt        # Append
```
> `echo` with `>` overwrites; `>>` appends without deleting existing content.

```bash
# Search inside files
grep "error" logfile.log           # Find lines containing "error"
grep -i "error" logfile.log        # Case-insensitive search
grep -r "TODO" ./src/              # Recursive search in directory
```
> `grep` → Searches for patterns in files. One of the most powerful Linux tools.

---

## 📋 Practical 3: File Permissions

### Objective
Understand and manage Linux file permissions.

### Understanding Permissions

```
-rwxr-xr--
```

| Position | Meaning |
|----------|---------|
| `-` | File type (`-` = file, `d` = directory) |
| `rwx` | Owner permissions |
| `r-x` | Group permissions |
| `r--` | Others permissions |

| Symbol | Value | Meaning |
|--------|-------|---------|
| `r` | 4 | Read |
| `w` | 2 | Write |
| `x` | 1 | Execute |
| `-` | 0 | No permission |

### Commands

```bash
# View permissions
ls -l file.txt
```

```bash
# Change permissions using numbers
chmod 755 script.sh    # rwxr-xr-x
chmod 644 file.txt     # rw-r--r--
chmod 777 file.txt     # rwxrwxrwx (all permissions)
```
> `chmod` → Changes file permissions. `755` is standard for scripts; `644` for regular files.

```bash
# Change ownership
chown user:group file.txt
chown -R user:group directory/
```
> `chown` → Changes the owner and group of a file. `-R` applies recursively.

---

## 📋 Practical 4: Process Management

### Objective
Monitor and manage running processes.

### Commands

```bash
# View running processes
ps aux                 # All processes with details
ps aux | grep nginx    # Find specific process
```
> `ps aux` → Lists all running processes with CPU and memory usage.

```bash
# Interactive process viewer
top
htop                   # Enhanced version (install separately)
```
> `top` → Real-time process monitor. Press `q` to quit.

```bash
# Kill a process
kill <PID>             # Send termination signal
kill -9 <PID>          # Force kill
pkill nginx            # Kill by process name
```
> `kill` → Terminates a process by its PID. `-9` is a force kill.

```bash
# Run process in background
command &              # Run in background
jobs                   # List background jobs
fg %1                  # Bring job 1 to foreground
```

---

## 📋 Practical 5: Networking Commands

### Objective
Inspect and troubleshoot network connections.

### Commands

```bash
# Check IP address
ip addr show
ifconfig               # Older systems
hostname -I            # Quick IP display
```

```bash
# Test connectivity
ping google.com
ping -c 4 google.com   # Send exactly 4 packets
```
> `ping` → Tests if a host is reachable and measures response time.

```bash
# Check open ports
netstat -tuln
ss -tuln               # Modern replacement for netstat
```
> Shows all listening TCP/UDP ports on the system.

```bash
# Download files
curl -O https://example.com/file.tar.gz
wget https://example.com/file.tar.gz
```
> `curl` and `wget` → Download files from the internet via terminal.

---

## 📋 Practical 6: Package Management (Ubuntu/Debian)

### Objective
Install, update, and remove software packages.

### Commands

```bash
# Update package index
sudo apt update
```
> Always run this before installing packages to get the latest package list.

```bash
# Install a package
sudo apt install nginx
sudo apt install -y docker.io    # -y skips confirmation prompt
```

```bash
# Remove a package
sudo apt remove nginx
sudo apt purge nginx              # Remove with config files
```

```bash
# List installed packages
apt list --installed
dpkg -l
```

---

## 📋 Practical 7: Disk & System Info

### Commands

```bash
# Disk usage
df -h                  # Show disk space for all mounted filesystems
du -sh folder/         # Show size of a specific directory
```

```bash
# Memory usage
free -h                # Show RAM and swap usage
```

```bash
# System info
uname -a               # Kernel and OS information
uptime                 # How long system has been running
whoami                 # Current user
id                     # User ID and group info
```

---

## 🔑 Essential Linux Commands Quick Reference

| Command | Purpose |
|---------|---------|
| `pwd` | Print working directory |
| `ls -la` | List all files with details |
| `cd <dir>` | Change directory |
| `mkdir <dir>` | Create directory |
| `rm -rf <dir>` | Remove directory |
| `cp -r src dest` | Copy directory |
| `mv src dest` | Move or rename |
| `cat <file>` | Display file content |
| `grep <pattern> <file>` | Search in file |
| `chmod 755 <file>` | Set permissions |
| `ps aux` | List processes |
| `kill <PID>` | Kill a process |
| `ping <host>` | Test connectivity |
| `df -h` | Disk space |
| `free -h` | Memory usage |

---

> Next: [03 — Git & GitHub](../03-Git-and-GitHub/README.md)
