import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    timeout: 15000,
});

export const getClusterStatus = async () => {
    const response = await api.get('/monitor/status');
    return response.data;
};

export const getAlerts = async () => {
    const response = await api.get('/alerts');
    return response.data;
};

export const stopContainer = async (name) => {
    return api.post('/admin/stop', { name });
};

export const startContainer = async (name) => {
    return api.post('/admin/start', { name });
};

export const restartContainer = async (name) => {
    return api.post('/admin/restart', { name });
};

export const provisionReplica = async (type) => {
    return api.post('/admin/provision', { type });
};

export default api;
