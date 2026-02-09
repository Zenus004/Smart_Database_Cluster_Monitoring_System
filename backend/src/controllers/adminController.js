const AdminService = require('../services/adminService');

const stopContainer = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ error: 'Container name is required' });

        const result = await AdminService.stopContainer(name);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const startContainer = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ error: 'Container name is required' });

        const result = await AdminService.startContainer(name);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const restartContainer = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ error: 'Container name is required' });

        const result = await AdminService.restartContainer(name);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    stopContainer,
    startContainer,
    restartContainer
};
