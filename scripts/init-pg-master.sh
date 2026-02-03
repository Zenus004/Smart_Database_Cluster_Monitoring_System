#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE USER replicator WITH REPLICATION ENCRYPTED PASSWORD 'password123';
    SELECT * FROM pg_create_physical_replication_slot('replica_1_slot');
    SELECT * FROM pg_create_physical_replication_slot('replica_2_slot');
EOSQL
