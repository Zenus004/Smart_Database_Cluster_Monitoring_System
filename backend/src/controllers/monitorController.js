const MonitorService = require('../services/monitorService');

const getClusterStatus = async (req, res) => {
    try {
        // Return cached status if available (Instant response)
        if (global.clusterStatus) {
            return res.json(global.clusterStatus);
        }

        // If Cache is not yet ready, do NOT fetch. Let the background loop handle it.
        // This prevents request pile-up from killing the DB connections.
        res.status(503).json({
            error: 'System Initializing',
            details: 'Monitoring service is warming up. Please retry in 5 seconds.'
        });

    } catch (error) {
        console.error('Cluster status error:', error);
        res.status(500).json({ error: 'Failed to fetch cluster status' });
    }
};

module.exports = { getClusterStatus };
