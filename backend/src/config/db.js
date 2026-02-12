const { Pool } = require('pg');
const mysql = require('mysql2/promise');

// Load environment variables
const POSTGRES_USER = process.env.POSTGRES_USER || 'admin';
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || 'password123';
const POSTGRES_DB = process.env.POSTGRES_DB || 'monitoring_db';

const MYSQL_ROOT_PASSWORD = process.env.MYSQL_ROOT_PASSWORD || 'password123';
const MYSQL_DATABASE = process.env.MYSQL_DATABASE || 'monitoring_db';

// Determine if we are running in Docker or Local
// If env var RUNNING_IN_DOCKER is set, use service names, else use localhost and exposed ports
const isDocker = process.env.RUNNING_IN_DOCKER === 'true';

const config = {
    postgres: [
        {
            id: 'pg-master',
            role: 'primary',
            host: isDocker ? 'postgres-master' : 'localhost',
            port: isDocker ? 5432 : 5432,
            user: POSTGRES_USER,
            password: POSTGRES_PASSWORD,
            database: POSTGRES_DB,
        },
        {
            id: 'pg-replica-1',
            role: 'replica',
            host: isDocker ? 'postgres-replica-1' : 'localhost',
            port: isDocker ? 5432 : 5433,
            user: POSTGRES_USER,
            password: POSTGRES_PASSWORD,
            database: POSTGRES_DB,
        },
        {
            id: 'pg-replica-2',
            role: 'replica',
            host: isDocker ? 'postgres-replica-2' : 'localhost',
            port: isDocker ? 5432 : 5434,
            user: POSTGRES_USER,
            password: POSTGRES_PASSWORD,
            database: POSTGRES_DB,
        },
        {
            id: 'pg-replica-3',
            role: 'replica',
            host: isDocker ? 'postgres-replica-3' : 'localhost',
            port: isDocker ? 5432 : 5435,
            user: POSTGRES_USER,
            password: POSTGRES_PASSWORD,
            database: POSTGRES_DB,
        }
    ],
    mysql: [
        {
            id: 'mysql-master',
            role: 'primary',
            host: isDocker ? 'mysql-master' : 'localhost',
            port: isDocker ? 3306 : 3306,
            user: 'root',
            password: MYSQL_ROOT_PASSWORD,
            database: MYSQL_DATABASE,
        },
        {
            id: 'mysql-slave-1',
            role: 'replica',
            host: isDocker ? 'mysql-slave-1' : 'localhost',
            port: isDocker ? 3306 : 3307,
            user: 'root',
            password: MYSQL_ROOT_PASSWORD,
            database: MYSQL_DATABASE,
        },
        {
            id: 'mysql-slave-2',
            role: 'replica',
            host: isDocker ? 'mysql-slave-2' : 'localhost',
            port: isDocker ? 3306 : 3308,
            user: 'root',
            password: MYSQL_ROOT_PASSWORD,
            database: MYSQL_DATABASE,
        },
        {
            id: 'mysql-slave-3',
            role: 'replica',
            host: isDocker ? 'mysql-slave-3' : 'localhost',
            port: isDocker ? 3306 : 3309,
            user: 'root',
            password: MYSQL_ROOT_PASSWORD,
            database: MYSQL_DATABASE,
        }
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
