const Docker = require('dockerode');
const docker = new Docker({ socketPath: '/var/run/docker.sock' });

const getContainer = (name) => {
    return docker.getContainer(name);
};

const stopContainer = async (name) => {
    try {
        const container = getContainer(name);
        await container.stop();
        return { message: `Container ${name} stopped successfully.` };
    } catch (error) {
        throw new Error(`Failed to stop container ${name}: ${error.message}`);
    }
};

const startContainer = async (name) => {
    try {
        const container = getContainer(name);
        await container.start();
        return { message: `Container ${name} started successfully.` };
    } catch (error) {
        throw new Error(`Failed to start container ${name}: ${error.message}`);
    }
};

const restartContainer = async (name) => {
    try {
        const container = getContainer(name);
        await container.restart();
        return { message: `Container ${name} restarted successfully.` };
    } catch (error) {
        throw new Error(`Failed to restart container ${name}: ${error.message}`);
    }
};

module.exports = {
    stopContainer,
    startContainer,
    restartContainer
};
