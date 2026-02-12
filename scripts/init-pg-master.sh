#!/bin/bash
set -e

# Create replication user if not exists
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
  DO \$\$
  BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '$REPLICATOR_USER') THEN
      CREATE ROLE $REPLICATOR_USER WITH REPLICATION LOGIN PASSWORD '$REPLICATOR_PASSWORD';
    ELSE
      ALTER ROLE $REPLICATOR_USER WITH REPLICATION LOGIN PASSWORD '$REPLICATOR_PASSWORD';
    END IF;
  END
  \$\$;
EOSQL

# Create main database if not exists
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" -tc "SELECT 1 FROM pg_database WHERE datname = 'monitoring_db'" | grep -q 1 || \
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" -c "CREATE DATABASE monitoring_db"
