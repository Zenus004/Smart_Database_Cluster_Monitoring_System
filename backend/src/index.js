require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { Server } = require('socket.io');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Basic Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

const monitorRoutes = require('./routes/monitorRoutes');
const authRoutes = require('./routes/authRoutes');
const alertRoutes = require('./routes/alertRoutes');
const MonitorService = require('./services/monitorService');
const AlertService = require('./services/alertService');

app.use('/api/auth', authRoutes);
app.use('/api/monitor', monitorRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/admin', require('./routes/adminRoutes'));

// Global Error Handle
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('UNHANDLED REJECTION:', reason);
});

const PORT = process.env.BACKEND_PORT || 4000;

server.listen(PORT, () => {
    console.log(`Backend Server running on port ${PORT}`);

    // Start Background Monitoring Loop
    console.log('Starting monitoring loop...');
    // Start Background Monitoring Loop
    console.log('Starting monitoring loop...');

    const runMonitoring = async () => {
        try {
            const [postgres, mysql] = await Promise.all([
                MonitorService.getPostgresClusterStatus(),
                MonitorService.getMysqlClusterStatus()
            ]);

            const clusterStatus = { postgres, mysql };

            // Cache the status globally for API access
            global.clusterStatus = {
                timestamp: new Date(),
                ...clusterStatus
            };

            const newAlerts = AlertService.checkThresholds(clusterStatus);

            // Emit via Socket.IO
            io.emit('cluster_update', global.clusterStatus);

            if (newAlerts.length > 0) {
                io.emit('new_alerts', newAlerts);
            }
        } catch (err) {
            console.error('Monitoring Loop Error:', err.message);
        } finally {
            setTimeout(runMonitoring, 2000);
        }
    };

    runMonitoring();
});

// Export io to be used in other files
module.exports = { app, io };
