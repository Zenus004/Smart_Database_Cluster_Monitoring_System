#!/bin/bash
set -e

#/ Create replication user
echo "Creating replication user..."

#/ Connect to MySQL and create the replication user
mysql -u root -p"$MYSQL_ROOT_PASSWORD" <<-EOSQL
    CREATE USER '$REPLICATOR_USER'@'%' IDENTIFIED BY '$REPLICATOR_PASSWORD';
    GRANT REPLICATION SLAVE ON *.* TO '$REPLICATOR_USER'@'%';
    FLUSH PRIVILEGES;
EOSQL

echo "Replication user created."
