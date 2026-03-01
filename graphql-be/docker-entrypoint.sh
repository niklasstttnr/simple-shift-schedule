#!/bin/sh
set -e

# Wait for Postgres to be ready, then run migrations
echo "Waiting for database..."
until npx prisma migrate deploy 2>/dev/null; do
  echo "Database not ready yet, retrying in 2s..."
  sleep 2
done

echo "Migrations applied, starting server..."
exec "$@"
