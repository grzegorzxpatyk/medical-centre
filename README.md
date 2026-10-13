# Medical Centre Monorepo

Turborepo monorepo (pnpm 11.15.0) with:

- **`apps/cms`** — [Payload CMS 3](https://payloadcms.com) headless backend on PostgreSQL. Since Payload 3.x runs inside Next.js, this is a minimal Next.js app hosting the admin panel (`/admin`) and REST API (`/api/*`) on port **3001**.
- **`apps/web`** — Next.js 16 + Tailwind 4 frontend consuming the CMS REST API, port **3000**.
- **`packages/shared-types`** — `@medical-centre/shared-types`, auto-generated TypeScript types shared by both apps.
- **`packages/typescript-config`** — shared tsconfig presets.

## Prerequisites

- Node.js ≥ 20.9
- pnpm 11.15.0 (pinned via `packageManager`; corepack or pnpm ≥ 10 auto-switches)
- Docker (for PostgreSQL and production builds)

## Development

```sh
cp .env.example .env
cp apps/cms/.env.example apps/cms/.env      # set a real PAYLOAD_SECRET
cp apps/web/.env.example apps/web/.env

pnpm install
docker compose up -d        # PostgreSQL only
pnpm dev                    # both apps via turbo

pnpm --filter @medical-centre/cms seed   # load the practice's content
```

`seed` is a declarative sync (`apps/cms/src/seed.ts`): it writes the `dane-ogolne`
global, the poradnie and the personnel list, and removes any poradnia or person
not listed in the script. `news`, `pages` and `media` are left to editors.

- Admin panel: http://localhost:3001/admin (create the first user on first visit)
- REST API: http://localhost:3001/api/doctors, `/api/poradnie`, `/api/pages`
- Frontend: http://localhost:3000

In development Payload pushes schema changes to Postgres automatically (drizzle `push`), so no migrations are needed locally.

## Shared types (backend → frontend)

`apps/cms/src/payload.config.ts` configures type generation:

```ts
typescript: {
  outputFile: '<repo>/packages/shared-types/src/payload-types.ts',
  declare: false, // so the file compiles without Payload installed
}
```

After changing any collection, regenerate:

```sh
pnpm generate:types
```

The frontend imports the results with full type safety and **zero Payload dependency**:

```ts
import type { Doctor, Poradnia, Page } from '@medical-centre/shared-types'
```

See `apps/web/src/lib/api.ts` for a typed REST client using them. The generated file is committed so the frontend always builds.

## Production (Docker)

Each app has a multi-stage `Dockerfile` using `turbo prune` and Next.js standalone output. `docker-compose.prod.yml` orchestrates:

1. `caddy` — the only service bound to the host (80/443). Terminates TLS with a Cloudflare origin certificate and proxies `SITE_DOMAIN` → web (`www.` redirects to the apex), `CMS_DOMAIN` → cms. Config in `deploy/Caddyfile`.
2. `postgres` — PostgreSQL 17 with a named volume
3. `cms-migrate` — one-shot job running `payload migrate` (production does **not** auto-push schema)
4. `cms-seed` — one-shot job loading the practice's content; skips anything already
   present, so it is safe on every deploy. `SEED_FORCE=1` re-asserts the canonical
   content and deletes poradnie/personnel not listed in `seed.ts`.
5. `cms` — slim standalone runtime, media uploads on a named volume
6. `web` — slim standalone runtime, reaches the CMS over the docker network

`cms-migrate` and `cms-seed` share one image (`cms-tools`), which is the full ~2 GB
build stage — worth knowing, since it gets pulled onto the server like the others.

Three env vars need care:

- `SITE_INDEXABLE` (default `false`) — serves a `Disallow: /` robots.txt and a
  `noindex` meta tag. Read at runtime, so promoting a preview to production needs no
  rebuild.
- `NEXT_PUBLIC_CMS_URL` — inlined into the web bundle **at build time** and also used
  for `next/image` remote patterns, so changing it requires rebuilding the `web`
  image, not just restarting it. In CI it comes from the `NEXT_PUBLIC_CMS_URL`
  repository variable.
- `CMS_PUBLIC_URL` — Payload's `serverURL`. Compose derives it from
  `NEXT_PUBLIC_CMS_URL`; without it Payload would emit `http://` media URLs that
  `next/image` then refuses to load.

### Hosting

Production runs on a mikr.us 3.0 VPS (2 GB RAM, x86_64, LXC). It has no public IPv4
of its own, only IPv6, so the domain's DNS is on Cloudflare: proxied AAAA records for
`@`, `www` and `cms` point at the server's IPv6 and Cloudflare serves IPv4 visitors.
SSL/TLS mode is **Full (strict)**; the origin leg uses a Cloudflare Origin CA
certificate (SSL/TLS → Origin Server, covering the apex and `*.` domain) saved on the
server as `deploy/certs/origin.pem` and `deploy/certs/origin.key`.

2 GB is enough to run the stack but not to build it, so images are never built on the
server.

### Deploying

`scripts/deploy.sh` builds the three images locally, copies the runtime files
(compose file, Caddyfile, backup script) and the images over SSH, and runs
`up -d`:

```sh
DEPLOY_HOST=root@srvXX.mikr.us DEPLOY_PORT=10XXX ./scripts/deploy.sh
```

One-time server setup before the first run — Docker with the compose plugin, then in
`/srv/medical-centre`: a `.env` based on `.env.example` (strong `PAYLOAD_SECRET` and
`POSTGRES_PASSWORD`, `NEXT_PUBLIC_CMS_URL=https://cms.gabinetzielonki.pl`,
`FRONTEND_URL=https://gabinetzielonki.pl`, and **no** `REGISTRY`, so compose uses the
locally loaded `medical-centre/*` tags) and the origin certificate in `deploy/certs/`.

Uploading `cms-tools` (~2 GB) dominates deploy time. `SKIP_BUILD=1` re-ships existing
images, e.g. after a dropped connection.

### Images in CI (alternative)

`.github/workflows/images.yml` builds the same images on every push to `main` and
pushes them to GHCR, tagged `latest` and the commit SHA. To deploy from there instead,
set `REGISTRY=ghcr.io/grzegorzxpatyk/medical-centre` in the server's `.env`,
`docker login ghcr.io` once, and run `docker compose -f docker-compose.prod.yml pull &&
docker compose -f docker-compose.prod.yml up -d`. Pin a build (or roll back) by
setting `IMAGE_TAG` to a commit SHA. The `NEXT_PUBLIC_CMS_URL` repository variable must
be set before the first run.

### Backups

`scripts/backup.sh` dumps the database and archives the media volume into
`BACKUP_DIR` (default `/var/backups/medical-centre`), keeping `RETENTION_DAYS`
(default 14) of history. Restore instructions are in the comments at the bottom of the
script.

```sh
20 3 * * * cd /srv/medical-centre && ./scripts/backup.sh 2>&1 | logger -t mc-backup
```

The script writes to local disk only; uncomment the `rclone copy` line once a remote is
configured, so the backups survive losing the server itself. mikr.us takes no
snapshots, so an off-server copy is the only protection against losing the VPS.

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Run both apps in dev mode |
| `pnpm build` | Build both apps |
| `pnpm check-types` | Type-check all packages |
| `pnpm generate:types` | Regenerate shared Payload types |
| `pnpm --filter @medical-centre/cms seed` | Load the practice's content (contact details, poradnie, personnel) into the database |
