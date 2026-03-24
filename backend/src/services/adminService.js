const Docker = require('dockerode');
const docker = new Docker({ socketPath: '/var/run/docker.sock' });
const fs = require('fs');
const path = require('path');
const dbConfig = require('../config/db');

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

const provisionReplica = async (type) => {
    // type is 'postgres' or 'mysql'
    const composePath = path.join('/project', 'docker-compose.yml');
    
    // 1. Update Topology
    const topologyPath = path.join(__dirname, '../config/topology.json');
    const { getTopology, reloadConfig } = dbConfig;
    const topology = getTopology();
    
    if (!topology[type]) {
        throw new Error(`Invalid replica type: ${type}`);
    }
    
    topology[type].replicaCount += 1;
    const newCount = topology[type].replicaCount;
    
    // Save topology
    fs.writeFileSync(topologyPath, JSON.stringify(topology, null, 2));
    
    // Reload internal config so backend knows about it
    reloadConfig();
    
    // 2. Read Compose File
    if (fs.existsSync(composePath)) {
        let composeContent = fs.readFileSync(composePath, 'utf8');
        let newServiceBlock = '';
        
        if (type === 'postgres') {
            const newPort = 5434 + newCount;
            newServiceBlock = `
  postgres-replica-${newCount}:
    image: postgres:15-alpine
    container_name: postgres-replica-${newCount}
    user: postgres
    restart: unless-stopped
    depends_on:
      - postgres-master
    environment:
      PGPASSWORD: \${REPLICATOR_PASSWORD}
      REPLICATOR_USER: \${REPLICATOR_USER}
      REPLICATOR_PASSWORD: \${REPLICATOR_PASSWORD}
    volumes:
      - ./config/postgres/replica.conf:/etc/postgresql/postgresql.conf
      - ./config/postgres/pg_hba.conf:/etc/postgresql/pg_hba.conf
      - pg_replica${newCount}_data:/var/lib/postgresql/data
    command: >
      bash -c "
      echo 'Waiting for valid connection as \${REPLICATOR_USER}...' &&
      until PGPASSWORD='\${REPLICATOR_PASSWORD}' psql -h postgres-master -U \${REPLICATOR_USER} -d postgres -c 'SELECT 1' > /dev/null 2>&1; do
        echo 'Master not ready or user not created yet. Retrying...'
        sleep 2
      done &&
      echo 'Master is ready! Starting base backup...' &&
      rm -rf /var/lib/postgresql/data/* &&
      pg_basebackup -h postgres-master -D /var/lib/postgresql/data -U \${REPLICATOR_USER} -v -P -X stream -R &&
      chown -R postgres:postgres /var/lib/postgresql/data &&
      chmod 700 /var/lib/postgresql/data &&
      postgres -c config_file=/etc/postgresql/postgresql.conf -c hba_file=/etc/postgresql/pg_hba.conf"
    ports:
      - "${newPort}:5432"
    networks:
      - db-cluster-net
`;
        } else if (type === 'mysql') {
            const newPort = 3308 + newCount;
            const serverId = 1 + newCount;
            newServiceBlock = `
  mysql-slave-${newCount}:
    image: mysql:8.0
    container_name: mysql-slave-${newCount}
    restart: unless-stopped
    depends_on:
      - mysql-master
    environment:
      MYSQL_ROOT_PASSWORD: \${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: \${MYSQL_DATABASE}
      REPLICATOR_USER: \${REPLICATOR_USER}
      REPLICATOR_PASSWORD: \${REPLICATOR_PASSWORD}
    volumes:
      - mysql_slave${newCount}_data:/var/lib/mysql
      - ./scripts/init-mysql-slave.sh:/docker-entrypoint-initdb.d/init.sh
    command: >
      mysqld
      --server-id=${serverId}
      --relay-log=mysql-relay-bin
      --log-bin=mysql-bin
      --binlog-format=row
      --read-only=1
      --gtid-mode=ON
      --enforce-gtid-consistency=ON
    ports:
      - "${newPort}:3306"
    networks:
      - db-cluster-net
`;
        }
        
        // Append service definition before backend
        composeContent = composeContent.replace('  backend:', newServiceBlock + '\n  backend:');
        
        // Append volume definition at the end
        const volumeName = type === 'postgres' ? `pg_replica${newCount}_data:` : `mysql_slave${newCount}_data:`;
        composeContent += `\n  ${volumeName}`;
        
        fs.writeFileSync(composePath, composeContent);
    }
    
    return { 
        message: `${type} replica #${newCount} config added! Run 'docker-compose up -d' in your terminal to apply.`,
        success: true
    };
};

module.exports = {
    stopContainer,
    startContainer,
    restartContainer,
    provisionReplica
};
