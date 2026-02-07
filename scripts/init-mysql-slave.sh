#!/bin/bash
set -e

# Wait for master to be ready
echo "Waiting for MySQL Master to be ready..."
until mysql -h mysql-master -u root -p"$MYSQL_ROOT_PASSWORD" -e "SELECT 1"; do
    sleep 3
done

echo "Master is ready. Configuring replication..."

# Execute Change Master
mysql -u root -p"$MYSQL_ROOT_PASSWORD" <<-EOSQL
    STOP SLAVE;
    CHANGE MASTER TO 
        MASTER_HOST='mysql-master',
        MASTER_USER='$REPLICATOR_USER',
        MASTER_PASSWORD='$REPLICATOR_PASSWORD',
        MASTER_AUTO_POSITION=1;
    START SLAVE;
EOSQL

echo "Replication configured."
