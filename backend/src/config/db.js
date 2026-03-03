const { Pool } = require('pg');
const mysql = require('mysql2/promise');

// Load environment variables
const POSTGRES_USER = process.env.POSTGRES_USER || 'admin';
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || 'password123';
const POSTGRES_DB = process.env.POSTGRES_DB || 'monitoring_db';
const POSTGRES_PORT = Number(process.env.POSTGRES_PORT || 5432);
const POSTGRES_REPLICA_COUNT = Number(process.env.POSTGRES_REPLICA_COUNT || 3);

const MYSQL_ROOT_PASSWORD = process.env.MYSQL_ROOT_PASSWORD || 'password123';
const MYSQL_DATABASE = process.env.MYSQL_DATABASE || 'monitoring_db';
const MYSQL_PORT = Number(process.env.MYSQL_PORT || 3308);
const MYSQL_REPLICA_COUNT = Number(process.env.MYSQL_REPLICA_COUNT || 3);

const isDocker = process.env.RUNNING_IN_DOCKER === 'true';

// Generate PostgreSQL replica configurations dynamically
const generatePostgresReplicas = (count) => {
    const replicas = [];
    for (let i = 1; i <= count; i++) {
        replicas.push({
            id: `pg-replica-${i}`,
            role: 'replica',
            host: isDocker ? `postgres-replica-${i}` : 'localhost',
            port: isDocker ? 5432 : POSTGRES_PORT + 3 + i,
            user: POSTGRES_USER,
            password: POSTGRES_PASSWORD,
            database: POSTGRES_DB,
        });
    }
    return replicas;
};

// Generate MySQL replica configurations dynamically
const generateMysqlReplicas = (count) => {
    const replicas = [];
    for (let i = 1; i <= count; i++) {
        replicas.push({
            id: `mysql-slave-${i}`,
            role: 'replica',
            host: isDocker ? `mysql-slave-${i}` : 'localhost',
            port: isDocker ? 3306 : MYSQL_PORT + i,
            user: 'root',
            password: MYSQL_ROOT_PASSWORD,
            database: MYSQL_DATABASE,
        });
    }
    return replicas;
};

const config = {
    postgres: [
        {
            id: 'pg-master',
            role: 'primary',
            host: isDocker ? 'postgres-master' : 'localhost',
            port: isDocker ? 5432 : POSTGRES_PORT,
            user: POSTGRES_USER,
            password: POSTGRES_PASSWORD,
            database: POSTGRES_DB,
        },
        ...generatePostgresReplicas(POSTGRES_REPLICA_COUNT)
    ],
    mysql: [
        {
            id: 'mysql-master',
            role: 'primary',
            host: isDocker ? 'mysql-master' : 'localhost',
            port: isDocker ? 3306 : MYSQL_PORT,
            user: 'root',
            password: MYSQL_ROOT_PASSWORD,
            database: MYSQL_DATABASE,
        },
        ...generateMysqlReplicas(MYSQL_REPLICA_COUNT)
    ]
};

// Connection Pools Cache
const pgPools = {};
const mysqlPools = {};

const getPgPool = (nodeId) => {
    if (!pgPools[nodeId]) {
        const node = config.postgres.find(n => n.id === nodeId);
        if (!node) throw new Error(`PG Node ${nodeId} not found`);
        pgPools[nodeId] = new Pool({
            host: node.host,
            port: node.port,
            user: node.user,
            password: node.password,
            database: node.database,
            connectionTimeoutMillis: 5000
        });

        pgPools[nodeId].on('error', (err, client) => {
            console.error(`Unexpected error on idle client for node ${nodeId}`, err);
        });
    }
    return pgPools[nodeId];
};

const getMysqlConnection = async (nodeId) => {
    const node = config.mysql.find(n => n.id === nodeId);
    if (!node) throw new Error(`MySQL Node ${nodeId} not found`);
    return await mysql.createConnection({
        host: node.host,
        port: node.port,
        user: node.user,
        password: node.password,
        database: node.database,
        connectTimeout: 5000
    });
};

module.exports = { config, getPgPool, getMysqlConnection };
