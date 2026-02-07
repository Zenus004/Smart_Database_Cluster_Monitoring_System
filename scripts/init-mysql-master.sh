#!/bin/bash
set -e

# Create replication user
echo "Creating replication user..."

# Connect to MySQL and create the replication user
mysql -u root -p"$MYSQL_ROOT_PASSWORD" <<-EOSQL
    CREATE USER '$REPLICATOR_USER'@'%' IDENTIFIED BY '$REPLICATOR_PASSWORD';
    GRANT REPLICATION SLAVE ON *.* TO '$REPLICATOR_USER'@'%';
    GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY '$MYSQL_ROOT_PASSWORD' WITH GRANT OPTION;
    FLUSH PRIVILEGES;
EOSQL

echo "Replication user created."
