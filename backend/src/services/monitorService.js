const { config, getPgPool, getMysqlConnection } = require('../config/db');
const { getContainerStats } = require('./dockerService');

const MonitorService = {
    // ----------------------------------
    // PostgreSQL Monitoring
    // ----------------------------------
    async getPostgresClusterStatus() {
        const results = await Promise.all(config.postgres.map(async (node) => {
            const nodeStatus = {
                id: node.id,
                role: node.role,
                containerName: node.host, // Expose actual docker name for admin controls
                metrics: { connections: 0, active_queries: 0 },
                replication: {},
                system: await getContainerStats(node.host) // Get Docker stats using hostname
            };

            try {
                const pool = getPgPool(node.id);
                // Basic Health & Metrics
                const client = await pool.connect();
                client.on('error', err => console.error('Active client error:', err.message));
                try {
                    // Check connections
                    const resConn = await client.query('SELECT count(*) as count FROM pg_stat_activity');
                    nodeStatus.metrics.connections = parseInt(resConn.rows[0].count);

                    // Check active queries (excluding idle)
                    const resQueries = await client.query("SELECT count(*) as count FROM pg_stat_activity WHERE state = 'active'");
                    nodeStatus.metrics.active_queries = parseInt(resQueries.rows[0].count);

                    if (node.role === 'primary') {
                        // Check Replication Status (seen from Master)
                        // This gives us info about CONNECTED replicas
                        const resRep = await client.query(`
                            SELECT client_addr, state, sync_state, replay_lag 
                            FROM pg_stat_replication
                        `);
                        nodeStatus.replication.connected_replicas = resRep.rows;
                    } else {
                        // Check Replication Status (seen from Replica)
                        const resLsn = await client.query('SELECT pg_last_wal_receive_lsn() as receive_lsn, pg_last_wal_replay_lsn() as replay_lsn, pg_is_in_recovery() as in_recovery');
                        const { receive_lsn, replay_lsn, in_recovery } = resLsn.rows[0];

                        nodeStatus.replication.in_recovery = in_recovery;
                        nodeStatus.replication.last_lsn = replay_lsn;

                        // Robust Lag Calculation:
                        // 1. If LSNs match, we are fully synced -> 0 lag.
                        // 2. If calculated time lag is negative (clock skew), treat as 0.
                        // 3. Otherwise use time difference.
                        if (receive_lsn === replay_lsn) {
                            nodeStatus.replication.lag_seconds = 0;
                        } else {
                            const resTime = await client.query("SELECT EXTRACT(EPOCH FROM (now() - pg_last_xact_replay_timestamp()))::int as lag_seconds");
                            nodeStatus.replication.lag_seconds = Math.max(0, resTime.rows[0].lag_seconds || 0);
                        }

                        // Get real sync state from the replica itself
                        try {
                            const resWal = await client.query("SELECT status, last_msg_receipt_time FROM pg_stat_wal_receiver");
                            if (resWal.rows.length > 0) {
                                nodeStatus.replication.state = resWal.rows[0].status;
                                nodeStatus.replication.last_msg = resWal.rows[0].last_msg_receipt_time;
                            }
                        } catch (e) {
                            console.warn('Could not query pg_stat_wal_receiver', e.message);
                        }
                    }

                    // Determine Node Health
                    let health = 'healthy';
                    let errorMsg = null;

                    if (nodeStatus.system.cpu > 80 || nodeStatus.system.memoryPercent > 90) {
                        health = 'warning';
                        errorMsg = 'High Resource Usage';
                    }

                    // Check lag (if replica)
                    if (node.role === 'replica' && nodeStatus.replication.lag_seconds > 10) {
                        health = 'warning';
                        errorMsg = 'High Replication Lag';
                    }

                    nodeStatus.health = health;
                    if (errorMsg) nodeStatus.error = errorMsg;

                } finally {
                    client.release();
                }
            } catch (err) {
                console.error(`Error monitoring PG node ${node.id}:`, err.message);
                nodeStatus.health = 'down';
                nodeStatus.error = err.message;
            }

            return nodeStatus;
        }));

        return results;
    },

    // ----------------------------------
    // MySQL Monitoring
    // ----------------------------------
    async getMysqlClusterStatus() {
        const results = await Promise.all(config.mysql.map(async (node) => {
            const nodeStatus = {
                id: node.id,
                role: node.role,
                containerName: node.host,
                metrics: { connections: 0, active_queries: 0 },
                replication: {},
                system: await getContainerStats(node.host) // Get Docker stats using hostname which matches container name
            };

            let conn;
            try {
                conn = await getMysqlConnection(node.id);

                // Connections
                const [rowsConn] = await conn.execute("SHOW STATUS LIKE 'Threads_connected'");
                nodeStatus.metrics.connections = parseInt(rowsConn[0].Value);

                // Running threads
                const [rowsRun] = await conn.execute("SHOW STATUS LIKE 'Threads_running'");
                nodeStatus.metrics.active_queries = parseInt(rowsRun[0].Value);

                if (node.role === 'primary') {
                    // Check Master Status
                    const [rowsMaster] = await conn.execute('SHOW MASTER STATUS');
                    if (rowsMaster.length > 0) {
                        nodeStatus.replication.file = rowsMaster[0].File;
                        nodeStatus.replication.position = rowsMaster[0].Position;
                    }
                    // MySQL Master doesn't show detailed connected slave lag directly in 'SHOW SLAVE HOSTS' easily without config.
                    // We mostly rely on slaves to report their lag.
                } else {
                    // Check Slave Status
                    const [rowsSlave] = await conn.execute('SHOW SLAVE STATUS');
                    if (rowsSlave.length > 0) {
                        const s = rowsSlave[0];
                        nodeStatus.replication = {
                            io_running: s.Slave_IO_Running,
                            sql_running: s.Slave_SQL_Running,
                            seconds_behind_master: s.Seconds_Behind_Master,
                            last_error: s.Last_Error
                        };
                    }
                }
                // Determine Node Health
                let health = 'healthy';
                let errorMsg = null;

                if (nodeStatus.system.cpu > 80 || nodeStatus.system.memoryPercent > 90) {
                    health = 'warning';
                    errorMsg = 'High Resource Usage';
                }

                const lag = nodeStatus.replication?.lag_seconds || nodeStatus.replication?.seconds_behind_master || 0;
                if (lag > 10) {
                    health = 'warning';
                    errorMsg = 'High Replication Lag';
                }

                nodeStatus.health = health;
                if (errorMsg) nodeStatus.error = errorMsg; // Optional info

                await conn.end();

            } catch (err) {
                console.error(`Error monitoring MySQL node ${node.id}:`, err.message);
                nodeStatus.health = 'down';
                nodeStatus.error = err.message;
                if (conn) await conn.end().catch(() => { });
            }

            return nodeStatus;
        }));

        return results;
    }
};

module.exports = MonitorService;
