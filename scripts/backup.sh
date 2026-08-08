#!/usr/bin/env bash
#
# Backs up the two things that exist only on this server: the Postgres database
# and the media uploads volume. Everything else can be rebuilt from git and the
# registry, these cannot.
#
# Usage:
#   ./scripts/backup.sh
#   BACKUP_DIR=/mnt/backups RETENTION_DAYS=30 ./scripts/backup.sh
#
# Cron (daily 03:20, output to syslog):
#   20 3 * * * cd /srv/medical-centre && ./scripts/backup.sh 2>&1 | logger -t mc-backup
#
# Restore instructions are at the bottom of this file.

set -euo pipefail

REPO_ROOT=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
cd "$REPO_ROOT"

COMPOSE_FILE=${COMPOSE_FILE:-docker-compose.prod.yml}
BACKUP_DIR=${BACKUP_DIR:-/var/backups/medical-centre}
RETENTION_DAYS=${RETENTION_DAYS:-14}

# Must match `name:` in the compose file — docker derives volume names from it.
PROJECT=medical-centre-prod
MEDIA_VOLUME="${PROJECT}_cms_media"

# Same .env the stack itself reads, for POSTGRES_USER / POSTGRES_DB.
if [ -f .env ]; then
  set -a
  # shellcheck disable=SC1091
  . ./.env
  set +a
fi
POSTGRES_USER=${POSTGRES_USER:-payload}
POSTGRES_DB=${POSTGRES_DB:-medical_centre}

timestamp=$(date +%Y%m%d-%H%M%S)
db_file="$BACKUP_DIR/db-$timestamp.sql.gz"
media_file="$BACKUP_DIR/media-$timestamp.tar.gz"

mkdir -p "$BACKUP_DIR"

# Fail here rather than silently producing an empty archive if the compose
# project name ever drifts from the constant above.
docker volume inspect "$MEDIA_VOLUME" >/dev/null

# Each artefact is written under a .partial name and renamed only on success,
# so an interrupted run can never leave a truncated file that looks valid.
echo "==> dumping database $POSTGRES_DB"
docker compose -f "$COMPOSE_FILE" exec -T postgres \
  pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" --clean --if-exists \
  | gzip >"$db_file.partial"
mv "$db_file.partial" "$db_file"

echo "==> archiving media volume $MEDIA_VOLUME"
docker run --rm \
  -v "$MEDIA_VOLUME":/media:ro \
  -v "$BACKUP_DIR":/backup \
  alpine:3 tar czf "/backup/$(basename "$media_file").partial" -C /media .
mv "$media_file.partial" "$media_file"

echo "==> pruning backups older than $RETENTION_DAYS days"
find "$BACKUP_DIR" -maxdepth 1 -name 'db-*.sql.gz' -mtime +"$RETENTION_DAYS" -delete
find "$BACKUP_DIR" -maxdepth 1 -name 'media-*.tar.gz' -mtime +"$RETENTION_DAYS" -delete
find "$BACKUP_DIR" -maxdepth 1 -name '*.partial' -mtime +1 -delete

# Off-site copy. A backup sitting on the same disk as the database survives a
# bad migration but not a dead server. Uncomment once `rclone config` has a
# remote (Backblaze B2 and any S3 work fine):
#
#   rclone copy "$BACKUP_DIR" "${RCLONE_REMOTE:?set RCLONE_REMOTE}" --max-age "${RETENTION_DAYS}d"

echo "==> done"
ls -lh "$db_file" "$media_file"

# ---------------------------------------------------------------------------
# Restore
#
#   # database — the dump is --clean, so it drops the existing objects first
#   gunzip -c db-YYYYMMDD-HHMMSS.sql.gz \
#     | docker compose -f docker-compose.prod.yml exec -T postgres \
#         psql -U payload -d medical_centre
#
#   # media — wipes the volume first so deleted files don't come back
#   docker compose -f docker-compose.prod.yml stop cms
#   docker run --rm -v medical-centre-prod_cms_media:/media -v "$PWD":/backup alpine:3 \
#     sh -c 'rm -rf /media/* && tar xzf /backup/media-YYYYMMDD-HHMMSS.tar.gz -C /media'
#   docker compose -f docker-compose.prod.yml start cms
#
# Restoring a database from before the current migration state? Run
# `docker compose -f docker-compose.prod.yml up cms-migrate` afterwards.
# ---------------------------------------------------------------------------
