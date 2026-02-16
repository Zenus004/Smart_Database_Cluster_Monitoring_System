# Smart Database Cluster Monitoring System

A production-grade, full-stack observability platform designed to monitor, visualize, and manage heterogeneous database clusters (PostgreSQL and MySQL).

## 🚀 Features

*   **Real-Time Monitoring**: Live visualization of CPU, Memory, Active Connections, and Query Load for every node.
*   **Heterogeneous Support**: Unified interface for both **PostgreSQL** (Streaming Replication) and **MySQL** (Binlog Replication).
*   **Cluster Topology**: Now supports **Master + 3 Replicas** for both SQL flavors, visualizing the entire replication chain.
*   **Precision Lag Tracking**: 
    *   **PostgreSQL**: Uses LSN difference & time lag, handling idle connection edge cases.
    *   **MySQL**: Tracks `Seconds_Behind_Master` and IO/SQL thread status.
*   **Chaos Engineering**: Built-in **Admin Controls** to simulate node failures (stop/start containers) and verify self-healing resilience.
*   **Event-Driven Alerts**: Intelligent alert engine with state tracking (Node Down, High Load, Recovery) and deduplication.

## 🛠️ Tech Stack

*   **Frontend**: React (Vite), TailwindCSS, Recharts, Lucide Icons
*   **Backend**: Node.js, Express, Socket.io, `pg` and `mysql2` drivers
*   **Infrastructure**: Docker, Docker Compose
*   **Communication**: REST API + WebSockets for real-time updates

## 🔧 Service & Port Reference

| Service | Host Port | Internal Port | Description |
| :--- | :--- | :--- | :--- |
| **Frontend** | `5173` | `5173` | React Dashboard |
| **Backend API** | `4000` | `4000` | Node.js Express API |
| **Postgres Master** | `5432` | `5432` | Primary R/W Node |
| **Postgres Replicas** | `5435-5437` | `5432` | Read-Only Replicas (1-3) |
| **MySQL Master** | `3306` | `3306` | Primary R/W Node |
| **MySQL Slaves** | `3309-3311` | `3306` | Read-Only Slaves (1-3) |

## 📦 Getting Started

### Prerequisites
*   Docker Desktop (Running)
*   Node.js v16+ (for local frontend dev)

### Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/Zenus004/Smart_Database_Cluster_Monitoring_System.git
    cd Smart_Database_Cluster_Monitoring_System
    ```

2.  **Configure Environment**
    Create a `.env` file in the root if it doesn't exist (see `env.example` or use defaults in `docker-compose.yml`).
    **Critical Variables:**
    *   `POSTGRES_USER` / `POSTGRES_PASSWORD`
    *   `MYSQL_ROOT_PASSWORD`
    *   `REPLICATOR_USER` / `REPLICATOR_PASSWORD` (Used for internal replication auth)

3.  **Start Infrastructure (Backend + Databases)**
    ```bash
    docker-compose up -d --build
    ```
    *Wait ~30 seconds for databases to initialize.*

4.  **Start Frontend**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

5.  **Access Dashboard**
    *   Open [http://localhost:5173](http://localhost:5173) in your browser.

## ⚠️ Troubleshooting & Maintenance

### 1. Slaves/Replicas Not Connecting?
If you see "Connecting" status or Auth errors in the logs, it likely means the Master data volume has an old user configuration that doesn't match your current `.env`.
**Fix:** You must wipe the volumes to let the initialization scripts run again:
```bash
docker-compose down -v
docker-compose up -d --build
```
*(The `-v` flag removes the named volumes, forcing a fresh database init).*

### 2. High Replication Lag on Idle Postgres?
We have implemented a fix for this by comparing LSNs (Log Sequence Numbers). If the LSNs match, lag is forced to 0s, preventing false alarms during idle periods.

### 3. "WAL Removed" Error?
If a PostgreSQL replica fails to start with "requested WAL segment ... has already been removed":
*   The Master has rotated its logs before the replica could grab them.
*   **Fix:** We have set `wal_keep_size = 128MB` in `postgresql.conf` to prevent this.
*   **Manual Recovery:** If it persists, remove just that replica's container and volume:
    ```bash
    docker rm -f postgres-replica-N
    docker volume rm smart_database_cluster_monitoring_system_pg_replicaN_data
    docker-compose up -d postgres-replica-N
    ```

## 🎮 Usage Guide

### 1. View Cluster Health
Navigate to **Overview** to see the aggregate health of both clusters.
*   **Green Check**: All nodes healthy.
*   **Yellow/Red**: Degradation (High Lag, High CPU, or Down) detected.
*   **Event History**: Scrollable log of recent alerts.

### 2. Simulate Failures (Admin Controls)
Test the alert system without CLI access:
1.  Go to the **Admin Controls** page.
2.  Find a node (e.g., `postgres-replica-1`).
3.  Click the **Red Stop Button**.
4.  Observe the dashboard:
    *   Node turns Red in Topology.
    *   Alert triggers on Overview.
5.  Click **Green Start Button** to recover.

## 📈 Scaling the Cluster

You can easily add more nodes (e.g., `postgres-replica-4` or `mysql-slave-4`).

### 1. Update `docker-compose.yml`
Copy an existing replica/slave service block and update:
-   **Service Name**: e.g., `postgres-replica-4`
-   **Environment**: Ensure `REPLICATOR_USER` and `REPLICATOR_PASSWORD` are included.
-   **Ports**: Increment the host port (e.g., `"5438:5432"`)
-   **MySQL Only**: Increment `--server-id` (e.g., `--server-id=5`)

### 2. Register in Backend
Update `backend/src/config/db.js` to let the monitor know about the new node ID and connection details.

### 3. Restart
```bash
docker-compose up -d --build
```

## 🔌 API Reference

### Monitor
*   `GET /api/monitor/status` - Get full cluster topology and metrics (CPU, Memory, Lag, Connections).

### Alerts
*   `GET /api/alerts` - Get active alert history.

### Admin Controls
*   `POST /api/admin/stop` - Stop a container to simulate failure.
    *   Body: `{ "name": "postgres-replica-1" }`
*   `POST /api/admin/start` - Start a container.
    *   Body: `{ "name": "postgres-replica-1" }`
*   `POST /api/admin/restart` - Restart a container.
    *   Body: `{ "name": "postgres-replica-1" }`

##