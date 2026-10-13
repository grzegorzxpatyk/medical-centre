#!/usr/bin/env bash
# Builds the production images locally and ships them to the server over SSH,
# so the server never builds anything and needs no registry access.
#
#   DEPLOY_HOST=root@srv12.mikr.us DEPLOY_PORT=10123 ./scripts/deploy.sh
#
# Optional:
#   NEXT_PUBLIC_CMS_URL  inlined into the web bundle (default https://cms.gabinetzielonki.pl)
#   DEPLOY_DIR           directory on the server (default /srv/medical-centre)
#   SKIP_BUILD=1         ship the images already built, e.g. after a failed upload
#
# The server's .env must leave REGISTRY unset, so compose looks for the same
# medical-centre/* tags this script loads instead of trying to pull them.
#
# Only the files the stack needs at runtime are copied over (compose file,
# Caddyfile, backup script) — the server never holds a checkout of the repo.
# .env and deploy/certs/ are created on the server by hand and left untouched.
set -euo pipefail

: "${DEPLOY_HOST:?set DEPLOY_HOST, e.g. root@srv12.mikr.us}"
DEPLOY_PORT="${DEPLOY_PORT:-22}"
DEPLOY_DIR="${DEPLOY_DIR:-/srv/medical-centre}"
export NEXT_PUBLIC_CMS_URL="${NEXT_PUBLIC_CMS_URL:-https://cms.gabinetzielonki.pl}"
# The server is x86_64; pin it so a build from an ARM laptop still runs there.
export DOCKER_DEFAULT_PLATFORM=linux/amd64
# Must match the tags compose resolves on the server.
unset REGISTRY IMAGE_TAG

cd "$(dirname "$0")/.."

compose=(docker compose -f docker-compose.prod.yml)
ssh_cmd=(ssh -p "$DEPLOY_PORT" "$DEPLOY_HOST")
images=(medical-centre/web:latest medical-centre/cms:latest medical-centre/cms-tools:latest)

if [[ "${SKIP_BUILD:-0}" != 1 ]]; then
  echo "==> Building images (NEXT_PUBLIC_CMS_URL=$NEXT_PUBLIC_CMS_URL)"
  "${compose[@]}" build cms-migrate cms web
fi

echo "==> Copying runtime files to $DEPLOY_HOST:$DEPLOY_DIR"
"${ssh_cmd[@]}" "mkdir -p '$DEPLOY_DIR/deploy/certs' '$DEPLOY_DIR/scripts'"
tar -cz docker-compose.prod.yml deploy/Caddyfile scripts/backup.sh \
  | "${ssh_cmd[@]}" "tar -xz -C '$DEPLOY_DIR'"

echo "==> Uploading images (cms-tools is ~2 GB, this takes a while)"
docker save "${images[@]}" | gzip -1 | "${ssh_cmd[@]}" "gunzip | docker load"

echo "==> Starting the stack"
"${ssh_cmd[@]}" "cd '$DEPLOY_DIR' \
  && docker compose -f docker-compose.prod.yml up -d --no-build \
  && docker image prune -f"

echo "==> Done"
