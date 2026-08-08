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

1. `postgres` — PostgreSQL 17 with a named volume
2. `cms-migrate` — one-shot job running `payload migrate` (production does **not** auto-push schema)
3. `cms-seed` — one-shot job loading the practice's content; skips anything already
   present, so it is safe on every deploy. `SEED_FORCE=1` re-asserts the canonical
   content and deletes poradnie/personnel not listed in `seed.ts`.
4. `cms` — slim standalone runtime, media uploads on a named volume
5. `web` — slim standalone runtime, reaches the CMS over the docker network

`cms-migrate` and `cms-seed` share one image (`medical-centre-prod-cms-tools`), which
is the full ~2 GB build stage — worth knowing if you push images to a registry rather
than building on the host.

Two env vars matter for a preview deploy:

- `SITE_INDEXABLE` (default `false`) — serves a `Disallow: /` robots.txt and a
  `noindex` meta tag. Read at runtime, so promoting a preview to production needs no
  rebuild.
- `NEXT_PUBLIC_CMS_URL` — inlined into the web bundle **at build time** and also used
  for `next/image` remote patterns, so changing it requires rebuilding the `web`
  image, not just restarting it.

Before the first production deploy, create the initial migration (with dev Postgres running):

```sh
pnpm --filter @medical-centre/cms migrate:create initial
```

Then:

```sh
# .env must define PAYLOAD_SECRET (and optionally POSTGRES_* overrides)
docker compose -f docker-compose.prod.yml up --build -d
```

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Run both apps in dev mode |
| `pnpm build` | Build both apps |
| `pnpm check-types` | Type-check all packages |
| `pnpm generate:types` | Regenerate shared Payload types |
| `pnpm --filter @medical-centre/cms seed` | Load the practice's content (contact details, poradnie, personnel) into the database |
