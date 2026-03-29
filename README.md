# Smart Database Cluster Monitoring System

A full-stack monitoring dashboard for **PostgreSQL** and **MySQL** clusters, with real-time topology/metrics, replication lag visibility, alerting, and container-level admin controls for failure simulation.

## ✨ Features

- Real-time monitoring of:
  - CPU
  - Memory
  - Active connections
  - Replication lag
  - Query load
- Unified dashboard for:
  - PostgreSQL (1 master + replicas)
  - MySQL (1 master + slaves)
- **Dynamic Scaling**: Add or Remove PostgreSQL replicas and MySQL slaves directly from the UI without manual config edits.
- Precision Lag Tracking: 
    -   PostgreSQL: Uses LSN difference & time lag, handling idle connection edge cases.
    -   MySQL: Tracks `Seconds_Behind_Master` and IO/SQL thread status.
- Event/alert stream for degraded/down/recovered nodes
- Admin controls to stop/start/restart cluster containers with premium custom modals.

## 🛠️ Tech Stack

- **Frontend:** React + Vite + TailwindCSS + Recharts
- **Backend:** Node.js + Express + Socket.IO + `pg` + `mysql2`
- **Infrastructure:** Docker + Docker Compose
- **Communication**: REST API + WebSockets for real-time updates

## 📁 Repository Structure

- `backend/` – API server, monitoring loop, alert logic
- `frontend/` – dashboard UI
- `config/` – PostgreSQL/MySQL config files used by containers
- `scripts/` – DB initialization/replication bootstrap scripts
- `docker-compose.yml` – full multi-container stack definition
- `env.example` – environment variables template

## 🔌 Service Ports (Default)

| Service | Host Port | Notes |
|---|---:|---|
| Frontend (Vite) | `5173` | Local dev server |
| Backend API | `4000` | Express + Socket.IO |
| PostgreSQL Master | `5432` | Primary node |
| PostgreSQL Replicas | `5435`, `5436`, `5437` | Read replicas |
| MySQL Master | `3308` | Primary node |
| MySQL Slaves | `3309`, `3310`, `3311` | Read replicas |

> `3308` is the default MySQL master port from `env.example`.

## ⚙️ Environment Variables

Create `.env` in project root (or copy from `env.example`):

```bash
# PostgreSQL
POSTGRES_USER=admin
POSTGRES_PASSWORD=password123
POSTGRES_DB=monitoring_db

# MySQL
MYSQL_ROOT_PASSWORD=password123
MYSQL_DATABASE=monitoring_db

# Replication
REPLICATOR_USER=replicator
REPLICATOR_PASSWORD=password123
POSTGRES_REPLICA_COUNT=3
MYSQL_REPLICA_COUNT=3

# Ports
POSTGRES_PORT=5432
MYSQL_PORT=3308
BACKEND_PORT=4000
```

## 🚀 Getting Started

### ✅ Prerequisites

- Docker Desktop
- Node.js 18+ (recommended for frontend local dev)

### 🐳 Option A: Run with Docker (Recommended)

From project root:

```bash
docker-compose up -d --build
```

Then start frontend locally:

```bash
cd frontend
npm install
npm run dev
```

Open: [http://localhost:5173](http://localhost:5173)

### 💻 Option B: Backend + Frontend Locally (DBs in Docker)

1. Start DB containers only with compose (or full stack).
2. Run backend:

```bash
cd backend
npm install
npm run dev
```

3. Run frontend:

```bash
cd frontend
npm install
npm run dev
```

Frontend uses Vite proxy (`/api` → `http://127.0.0.1:4000`).

## 📡 API Endpoints

### ❤️ Health

- `GET /api/health`

### 📊 Monitoring

- `GET /api/monitor/status` – current cluster status snapshot

### 🚨 Alerts

- `GET /api/alerts` – alert history/events

### 🧰 Admin Controls

- `POST /api/admin/stop`
- `POST /api/admin/start`
- `POST /api/admin/restart`
- `POST /api/admin/provision` – add a new replica/slave (`{ "type": "postgres" }`)
- `POST /api/admin/deprovision` – remove the last replica/slave (`{ "type": "mysql" }`)

Request body:

```json
{ "name": "postgres-replica-1" }
```

### 🔐 Auth

- `POST /api/auth/login`

Request body:

```json
{ "username": "admin", "password": "admin123" }
```

## 🔄 Socket Events

Backend emits:

- `cluster_update` – latest full cluster payload
- `new_alerts` – newly detected alerts

## 🩺 Troubleshooting

### Replicas/slaves stuck in connecting state

Reinitialize volumes and bootstrap scripts:

```bash
docker-compose down -v
docker-compose up -d --build
```

### Backend cannot reach Docker daemon

The backend container mounts Docker socket (`/var/run/docker.sock`) for admin operations. Ensure Docker Desktop is running and socket access is available.

### Vite proxy errors

Verify backend is available on `http://127.0.0.1:4000` and no local firewall rule is blocking requests.

### High Replication Lag on Idle Postgres?
We have implemented a fix for this by comparing LSNs (Log Sequence Numbers). If the LSNs match, lag is forced to 0s, preventing false alarms during idle periods.

### "WAL Removed" Error?
If a PostgreSQL replica fails to start with "requested WAL segment ... has already been removed":
-   The Master has rotated its logs before the replica could grab them.
-   Fix: We have set `wal_keep_size = 128MB` in `postgresql.conf` to prevent this.
-   Manual Recovery: If it persists, remove just that replica's container and volume:
    ```bash
    docker rm -f postgres-replica-N
    docker volume rm smart_database_cluster_monitoring_system_pg_replicaN_data
    docker-compose up -d postgres-replica-N
    ```

## 🧭 Usage Guide

### 1) 📈 Monitor overall health (Overview)

Open the dashboard at `http://localhost:5173` and use the **Overview** page as the primary health view.

- **Healthy state:** all nodes report normal metrics and replication lag is stable.
- **Degraded state:** one or more nodes show high CPU/memory, lag spikes, or disconnects.
- **Alerts timeline:** recent events are shown so you can track failure and recovery windows.

### 2) 🗂️ Inspect cluster-specific pages

- **Postgres page:** check master/replica topology and replica lag behavior.
- **MySQL page:** verify master/slave replication and `Seconds_Behind_Master` trends.
- Use these pages to isolate which node is causing an alert seen in Overview.

### 3) 🧪 Simulate failures (Admin Controls)

Use the **Admin Controls** page to trigger controlled failure/recovery tests:

1. Select a node (for example, `postgres-replica-1` or `mysql-slave-1`).
2. Click **Stop** to simulate a node outage.
3. Confirm status changes in topology + alert feed.
4. Click **Start** (or **Restart**) to recover the node.
5. Verify alerts clear after the node is healthy again.

### 4) 🔍 Quick API validation (optional)

You can verify backend responses directly:

```bash
curl http://localhost:4000/api/health
curl http://localhost:4000/api/monitor/status
curl http://localhost:4000/api/alerts
```

## 📈 Scaling the Cluster

Scaling is now fully automated and can be managed via the **Admin Controls** dashboard.

### 🚀 Automatic Scaling (Recommended)

1.  Navigate to the **Admin Controls** page in the dashboard.
2.  Locate the **Postgres** or **MySQL** provisioning headers.
3.  Click **[+] Add** to instantly provision a new node. 
    - The system updates `topology.json`, modifies `docker-compose.yml`, and boots the container automatically.
4.  Click **[-] Remove** to safely de-provision the latest node.
    - The system gracefully shuts down the container and cleans up the configuration files.

### 🛠️ Manual Scaling (Alternative)

If you prefer manual configuration, you can still scale the cluster by editing the source files:

1.  **Update `.env`**: Change `POSTGRES_REPLICA_COUNT` or `MYSQL_REPLICA_COUNT`.
2.  **Edit `docker-compose.yml`**: Copy an existing replica service, update the name (e.g., `postgres-replica-4`), unique port, and server-id (for MySQL).
3.  **Update `topology.json`**: Ensure the `replicaCount` matches your new setup.
4.  **Restart**: Run `docker-compose up -d --build`.

## 🧾 Useful Commands

```bash
# Start stack
docker-compose up -d --build

# Stop stack
docker-compose stop

# Stop and remove containers + volumes
docker-compose down -v

# View logs
docker-compose logs -f
```
