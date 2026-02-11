const ALERTS = []; // In-memory store for demo. Real app should use DB.

const generateAlert = (type, message, severity = 'warning') => {
    // Deduplication: Don't add if the last alert with same type/message exists in the last 1 minute
    const duplicate = ALERTS.findLast(a => a.type === type && a.message === message);
    if (duplicate && (Date.now() - duplicate.id < 60000)) {
        return null; // Skip duplicate
    }

    const alert = {
        id: Date.now(),
        timestamp: new Date(),
        type,
        message,
        severity,
        acknowledged: false
    };
    ALERTS.push(alert);
    // Keep only last 100 alerts
    if (ALERTS.length > 100) ALERTS.shift();
    return alert;
};

const getAlerts = () => ALERTS;

const NODE_STATES = {}; // Track previous health: { 'node-id': 'healthy' }

const checkThresholds = (clusterStatus) => {
    const newAlerts = [];

    const processtNode = (node, typePrefix) => {
        const prevStatus = NODE_STATES[node.id] || 'healthy';

        // 1. Check Down/Recovery Transitions
        if (node.health === 'down') {
            if (prevStatus !== 'down') {
                const alert = generateAlert('NODE_DOWN', `${typePrefix} Node ${node.id} is DOWN`, 'critical');
                if (alert) newAlerts.push(alert);
            }
        } else if (node.health === 'healthy') {
            if (prevStatus === 'down') {
                const alert = generateAlert('NODE_RECOVERED', `${typePrefix} Node ${node.id} has RECOVERED`, 'success');
                if (alert) newAlerts.push(alert);
            } else if (prevStatus === 'warning') {
                const alert = generateAlert('LOAD_NORMALIZED', `${typePrefix} Node ${node.id} load has NORMALIZED`, 'success');
                if (alert) newAlerts.push(alert);
            }
        }

        // Update state
        NODE_STATES[node.id] = (node.health === 'warning') ? 'warning' : node.health;

        // 2. Resource Thresholds (still use time-based dedup)
        if (node.system.cpu > 80) {
            const alert = generateAlert('HIGH_LOAD', `${typePrefix} Node ${node.id} CPU usage high: ${node.system.cpu.toFixed(1)}%`, 'warning');
            if (alert) newAlerts.push(alert);
            // Ensure we track this as warning next time
            NODE_STATES[node.id] = 'warning';
        }

        // Check Lag
        const lag = node.replication?.lag_seconds || node.replication?.seconds_behind_master || 0;
        if (lag > 10) {
            const alert = generateAlert('REPLICATION_LAG', `${typePrefix} Node ${node.id} high lag: ${lag}s`, 'warning');
            if (alert) newAlerts.push(alert);
            NODE_STATES[node.id] = 'warning';
        }
    };

    clusterStatus.postgres.forEach(n => processtNode(n, 'Postgres'));
    clusterStatus.mysql.forEach(n => processtNode(n, 'MySQL'));

    return newAlerts;
};

module.exports = { getAlerts, checkThresholds, generateAlert };
