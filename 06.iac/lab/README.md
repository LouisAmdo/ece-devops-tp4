# Lab 6 - Infrastructure as Code (IaC)

## Overview

This lab demonstrates Infrastructure as Code (IaC) using both **imperative** and **declarative** approaches.  
Since this environment uses **Docker** instead of VirtualBox/Vagrant, we adapted all exercises to run with Docker and docker-compose.

---

## Part 1: Imperative - Shell Provisioning (Docker equivalent)

### Description

Instead of using Vagrant with a CentOS 7 VM, we use a Docker container based on `rockylinux:8` (CentOS 7 is EOL, Rocky 8 is the same RHEL family).  
The Dockerfile replicates the shell provisioning steps from the Vagrantfile:

1. **Hello, World** - echoed on container start
2. **`/etc/hosts` modification** - adds `127.0.0.1 mydomain-1.local`
3. **Provisioning timestamp** - writes the date to `/etc/vagrant_provisioned_at`

### How to run

```bash
cd 06.iac/lab/part-1

# Build and start (equivalent to `vagrant up`)
docker compose up -d --build

# Check the container is running (equivalent to `vagrant status`)
docker compose ps

# Enter the container (equivalent to `vagrant ssh`)
docker exec -it centos.server.local bash

# Inside the container, verify provisioning:
cat /etc/hosts
# You should see: 127.0.0.1  mydomain-1.local
cat /etc/vagrant_provisioned_at
# You should see the provisioning date

# Stop the container (equivalent to `vagrant halt`)
docker compose stop

# Destroy the container (equivalent to `vagrant destroy`)
docker compose down
```

### Verification output

```
$ docker logs centos.server.local
=== Hello, World ===

=== /etc/hosts content ===
127.0.0.1       localhost
::1     localhost ip6-localhost ip6-loopback
...
127.0.0.1  mydomain-1.local

=== Provisioned at ===
Thu Feb 12 13:39:02 UTC 2026

Container is ready. Use docker exec -it centos.server.local bash to connect.
```

---

## Part 2: Declarative - GitLab Installation (Docker equivalent)

### Description

Instead of using Vagrant + Ansible to install GitLab on a Rocky 8 VM, we use the official `gitlab/gitlab-ce` Docker image.  
This achieves the same result: a running GitLab instance accessible on `http://localhost:8888`.

The `docker-compose.yml` replicates the Vagrant configuration:
- **Port forwarding**: guest 80 → host 8888
- **Resources**: 2560 MB RAM, 2 CPUs (optimized for 8GB server)
- **Ansible playbooks**: mounted at `/vagrant/playbooks` for reference
- **Memory optimizations**: Puma worker 0, Sidekiq concurrency 2, Prometheus/KAS/Pages/Registry disabled

### How to run

```bash
cd 06.iac/lab/part-2

# Start GitLab (equivalent to `vagrant up`)
docker compose up -d

# Check status
docker compose ps

# Wait 5-10 minutes for GitLab to initialize, then check health:
docker exec gitlab.server.local curl -s http://127.0.0.1/-/health
# Expected: GitLab OK

# Access GitLab in browser
# Open: http://localhost:8888

# Get the initial root password:
docker exec gitlab.server.local cat /etc/gitlab/initial_root_password | grep Password:

# Stop GitLab (equivalent to `vagrant halt`)
docker compose stop

# Destroy GitLab (equivalent to `vagrant destroy`)
docker compose down -v
```

### Verification output

```
$ docker exec gitlab.server.local curl -s http://127.0.0.1/-/health
GitLab OK

$ docker exec gitlab.server.local curl -s http://127.0.0.1/-/readiness
{"status":"ok"}

$ docker exec gitlab.server.local curl -s http://127.0.0.1/-/liveness
{"status":"ok"}
```

---

## Part 3: Health Checks

### Description

The health check playbook (`playbooks/roles/gitlab/healthchecks/tasks/main.yml`) implements **three** types of health checks using the Ansible `uri` module:

1. **Health check** (`/-/health`) — basic "GitLab OK" response
2. **Readiness check** (`/-/readiness?all=1`) — verifies all sub-services (db, redis, cache, etc.)
3. **Liveness check** (`/-/liveness`) — confirms the application is alive

### Running health checks manually (inside the container)

```bash
# Health check
docker exec gitlab.server.local curl -s http://127.0.0.1/-/health
# Output: GitLab OK

# Readiness check (detailed with all sub-services)
docker exec gitlab.server.local curl -s "http://127.0.0.1/-/readiness?all=1"
# Output: {"status":"ok","db_check":[{"status":"ok"}],...}

# Liveness check
docker exec gitlab.server.local curl -s http://127.0.0.1/-/liveness
# Output: {"status":"ok"}
```

### Running with Ansible (inside the container)

```bash
# Install Ansible inside the container
docker exec gitlab.server.local bash -c "apt-get update && apt-get install -y ansible"

# Run the health check playbook
docker exec gitlab.server.local ansible-playbook /vagrant/playbooks/run.yml --tags check -c local -i "localhost,"
```

### Health check playbook tasks

| Task | Endpoint | Purpose |
|------|----------|---------|
| `Check GitLab health` | `/-/health` | Returns "GitLab OK" if the app is running |
| `Check GitLab readiness` | `/-/readiness` | JSON response with status of all sub-services |
| `Check GitLab liveness` | `/-/liveness` | JSON response confirming the app process is alive |

---

## Bonus: Dysfunctional Services Detection

### Description

The bonus task adds two extra Ansible tasks to the health check playbook:

1. **Identify dysfunctional services** — parses the readiness JSON response and filters services where `status != 'ok'`
2. **Print dysfunctional services** — displays a warning with the list of broken services, or "All services are healthy!" if everything is OK

### Testing with a stopped Redis service

```bash
# Stop Redis to simulate a failure
docker exec gitlab.server.local gitlab-ctl stop redis

# Run detailed readiness check — shows all failed Redis-dependent services
docker exec gitlab.server.local curl -s "http://127.0.0.1/-/readiness?all=1"
# Output: {"status":"failed","cache_check":[{"status":"failed",...}],...}

# Restart Redis
docker exec gitlab.server.local gitlab-ctl start redis
```

### Actual output with Redis stopped

```json
{
  "status": "failed",
  "db_check": [{"status": "ok"}],
  "cache_check": [{"status": "failed", "message": "...redis.socket..."}],
  "feature_flag_check": [{"status": "failed", "message": "...redis.socket..."}],
  "queues_check": [{"status": "failed", "message": "...redis.socket..."}],
  "sessions_check": [{"status": "failed", "message": "...redis.socket..."}],
  "shared_state_check": [{"status": "failed", "message": "...redis.socket..."}],
  "gitaly_check": [{"status": "ok"}]
}
```

### Expected Ansible output (bonus task)

When all services are healthy:
```
TASK [gitlab/healthchecks : Print dysfunctional services (if any)] ************
ok: [localhost] => {
    "msg": "All services are healthy!"
}
```

When Redis is stopped:
```
TASK [gitlab/healthchecks : Print dysfunctional services (if any)] ************
ok: [localhost] => {
    "msg": "WARNING: The following services are NOT healthy: redis_check"
}
```

---

## File Structure

```
lab/
├── part-1/
│   ├── Vagrantfile              # Original Vagrant config (imperative)
│   ├── Dockerfile               # Docker equivalent
│   ├── docker-compose.yml       # Docker Compose to manage the container
│   └── .gitignore
├── part-2/
│   ├── Vagrantfile              # Original Vagrant config (declarative)
│   ├── docker-compose.yml       # Docker equivalent with GitLab
│   ├── .gitignore
│   └── playbooks/
│       ├── run.yml              # Main Ansible playbook
│       └── roles/
│           └── gitlab/
│               ├── install/
│               │   └── tasks/
│               │       └── main.yml    # GitLab installation tasks
│               └── healthchecks/
│                   └── tasks/
│                       └── main.yml    # Health, readiness, liveness checks + bonus
```

---

## Tools Used

| Tool | Purpose |
|------|---------|
| Docker | Container runtime (replaces VirtualBox) |
| Docker Compose | Container orchestration (replaces Vagrant) |
| Ansible | Declarative configuration management |
| GitLab EE | Self-hosted Git platform |
| curl | HTTP health check testing |

---

## Author

ECE DevOps Lab 6 - Infrastructure as Code
