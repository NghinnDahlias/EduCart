#!/bin/bash
set -euo pipefail
SQLCMD="/opt/mssql-tools18/bin/sqlcmd"
DB_HOST="${DB_HOST:-db}"
DB_USER="${DB_USER:-sa}"
DB_NAME="${DB_NAME:-EduCart}"
if [[ -z "${DB_PASSWORD:-}" ]]; then
  echo "DB_PASSWORD is not set"
  exit 1
fi
db_exists="$($SQLCMD -S "$DB_HOST" -U "$DB_USER" -P "$DB_PASSWORD" -C -h -1 -W -Q "SET NOCOUNT ON; SELECT COUNT(*) FROM sys.databases WHERE name='${DB_NAME}';")"
if [[ "$db_exists" == "0" ]]; then
  echo "Creating database and schema..."
  $SQLCMD -S "$DB_HOST" -U "$DB_USER" -P "$DB_PASSWORD" -C -i /docker-entrypoint-initdb.d/educart_schema.sql
else
  echo "Database ${DB_NAME} already exists; skipping schema creation."
fi
echo "Applying stored procedures..."
$SQLCMD -S "$DB_HOST" -U "$DB_USER" -P "$DB_PASSWORD" -C -d "$DB_NAME" -i /docker-entrypoint-initdb.d/stored_procedures.sql
echo "Applying triggers..."
$SQLCMD -S "$DB_HOST" -U "$DB_USER" -P "$DB_PASSWORD" -C -d "$DB_NAME" -i /docker-entrypoint-initdb.d/triggers.sql
echo "Seeding data..."
$SQLCMD -S "$DB_HOST" -U "$DB_USER" -P "$DB_PASSWORD" -C -d "$DB_NAME" -i /docker-entrypoint-initdb.d/seed_data.sql
echo "Database initialization complete."
