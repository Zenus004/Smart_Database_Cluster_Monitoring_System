const Docker = require('dockerode');
const docker = new Docker({ socketPath: '/var/run/docker.sock' });


const getContainerStats = async (containerName) => {
    try {
        const containers = await docker.listContainers({ all: true });
        const containerInfo = containers.find(c => c.Names.some(n => n.includes(containerName)));

        if (!containerInfo) {
            return { status: 'down', cpu: 0, memory: 0 };
        }

        if (containerInfo.State !== 'running') {
            return { status: 'down', cpu: 0, memory: 0 };
        }

        const container = docker.getContainer(containerInfo.Id);
        const stats = await container.stats({ stream: false });

        // Calculate CPU %
        const cpuDelta = stats.cpu_stats.cpu_usage.total_usage - stats.precpu_stats.cpu_usage.total_usage;
        const systemDelta = stats.cpu_stats.system_cpu_usage - stats.precpu_stats.system_cpu_usage;
        let cpuPercent = 0.0;
        if (systemDelta > 0 && cpuDelta > 0) {
            cpuPercent = (cpuDelta / systemDelta) * stats.cpu_stats.online_cpus * 100.0;
        }

        // Calculate Memory Usage
        const memoryUsage = stats.memory_stats.usage;
        const memoryLimit = stats.memory_stats.limit;
        const memoryPercent = (memoryUsage / memoryLimit) * 100.0;

        return {
            status: 'running',
            cpu: parseFloat(cpuPercent.toFixed(2)),
            memory: parseFloat((memoryUsage / 1024 / 1024).toFixed(2)), // MB
            memoryPercent: parseFloat(memoryPercent.toFixed(2))
        };
    } catch (error) {
        console.error(`Error fetching stats for ${containerName}:`, error.message);
        return { status: 'unknown', cpu: 0, memory: 0, error: error.message };
    }
};

module.exports = { getContainerStats };
