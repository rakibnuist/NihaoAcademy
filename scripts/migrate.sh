#!/bin/bash
# ── NiHao Academy — Run all pending migrations ────────────────────────────────
# Usage: DB_PASSWORD=yourpassword bash scripts/migrate.sh
#
# Find your DB password at:
#   https://supabase.com/dashboard/project/dyutoqnmelmkktbaluyb/settings/database
#   → Connection string → URI → copy the password portion
#
set -e

PROJECT_REF="dyutoqnmelmkktbaluyb"
DB_HOST="db.${PROJECT_REF}.supabase.co"
DB_USER="postgres"
DB_NAME="postgres"
DB_PORT="5432"

if [ -z "$DB_PASSWORD" ]; then
  echo "Error: DB_PASSWORD environment variable is required."
  echo ""
  echo "Get your password from:"
  echo "  https://supabase.com/dashboard/project/${PROJECT_REF}/settings/database"
  echo ""
  echo "Then run:"
  echo "  DB_PASSWORD=yourpassword bash scripts/migrate.sh"
  exit 1
fi

MIGRATIONS_DIR="$(dirname "$0")/../supabase/migrations"
PSQL_URL="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}"

echo "🚀 Running NiHao Academy migrations..."
echo ""

for file in "$MIGRATIONS_DIR"/*.sql; do
  name=$(basename "$file")
  echo "  → Applying $name"
  PGPASSWORD="$DB_PASSWORD" psql "$PSQL_URL" -f "$file" -q
  echo "    ✓ Done"
done

echo ""
echo "✅ All migrations applied successfully!"
