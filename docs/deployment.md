# Deployment

How gabinetzielonki.pl is hosted, how to deploy a new version, and how
Cloudflare is configured. Set up on 2026-10-13.

## Overview

```
visitor ──IPv4/IPv6──▶ Cloudflare (proxy, TLS) ──IPv6──▶ mikr.us VPS
                                                       └─ Caddy :443 (origin cert)
                                                            ├─ gabinetzielonki.pl      → web:3000
                                                            ├─ www.gabinetzielonki.pl  → 301 to apex
                                                            └─ cms.gabinetzielonki.pl  → cms:3001
```

| Piece | Where |
| --- | --- |
| Domain | `gabinetzielonki.pl`, registered at seohost.pl; registrant is the practice |
| DNS + proxy | Cloudflare (Free plan), nameservers `heidi` / `quentin.ns.cloudflare.com` |
| Server | mikr.us 3.0: 2 GB RAM, 25 GB disk, x86_64, Ubuntu 24.04 (LXC) |
| SSH | `tadek343.mikrus.xyz`, port `10343`, user `root`, key auth |
| Server IPv6 | `2a01:4f9:4a:1a51::343` |
| App directory | `/srv/medical-centre` |
| Backups | `/var/backups/medical-centre`, nightly at 03:20 |

The practice pays for the domain and the server, and the invoices are made out
to the practice. The accounts are only managed on its behalf.

### Why Cloudflare is required

mikr.us gives each server its own IPv6 address but **no public IPv4**, only a
handful of forwarded ports on a shared address. So the server can't serve
`:443` to IPv4 visitors directly. Cloudflare's proxy accepts both protocols
and connects to the server over IPv6.

As a result, **the DNS records must never include an A record**. If a name has
both A and AAAA records, Cloudflare connects to the origin over IPv4, and the
traffic ends up somewhere other than the server.

## Cloudflare configuration

### DNS records

Exactly three records, all **Proxied** (orange cloud):

| Type | Name | Content |
| --- | --- | --- |
| AAAA | `gabinetzielonki.pl` | `2a01:4f9:4a:1a51::343` |
| AAAA | `www` | `2a01:4f9:4a:1a51::343` |
| AAAA | `cms` | `2a01:4f9:4a:1a51::343` |

When the zone was added, Cloudflare imported seohost's parking records: A
records to `188.210.221.221` for `@`, `www` and `*`, plus NS records delegating
`www`, `mail`, `_dmarc` and similar names back to `ns*.seohost.pl`. They were
all junk (seohost answers every name with its parking IP, MX included) and were
deleted. If you ever re-add the zone, delete them again.

There is no email on the domain yet. Adding mailboxes later means adding MX
records (and SPF/DKIM/DMARC TXT) here, all **DNS only**, not proxied.

### SSL/TLS settings

| Setting | Value |
| --- | --- |
| SSL/TLS encryption mode | **Full (strict)** |
| Always Use HTTPS | On |
| Minimum TLS version | 1.2 |

### Origin certificate

The Cloudflare → server leg uses a **Cloudflare Origin CA certificate**, not
Let's Encrypt: an ACME HTTP-01 challenge through the proxy is fragile. Details:

- Covers `gabinetzielonki.pl` and `*.gabinetzielonki.pl`, ECC, valid until **2041-10-09**.
- Lives on the server only, in `/srv/medical-centre/deploy/certs/origin.pem` and
  `origin.key`. The `deploy/certs/` directory is gitignored.
- Only Cloudflare trusts it. Hitting the server directly by IPv6 gives a
  certificate warning, which is expected.

To replace the certificate:

1. In Cloudflare, go to SSL/TLS → Origin Server → Create Certificate.
2. Save the certificate and key over the two files on the server.
3. Restart Caddy:
   `docker compose -f docker-compose.prod.yml restart caddy`

The private key can't be downloaded from Cloudflare again later. If the server
is lost, issue a new certificate.

### API access

Cloudflare was set up through a temporary custom API token (Zone: Zone, DNS,
Zone Settings, SSL and Certificates, all Edit) that expired on 2026-10-15. Day
to day, nothing needs one. Create a new short-lived token if automation is
ever needed.

## Server setup (one-time)

Already done. Listed here in case the server has to be rebuilt:

1. Install Docker: `curl -fsSL https://get.docker.com | sh`
2. Create `/srv/medical-centre/.env` (mode 600) with these values:
   ```
   POSTGRES_USER=payload
   POSTGRES_PASSWORD=<openssl rand -hex 24>
   POSTGRES_DB=medical_centre
   PAYLOAD_SECRET=<openssl rand -hex 32>
   NEXT_PUBLIC_CMS_URL=https://cms.gabinetzielonki.pl
   FRONTEND_URL=https://gabinetzielonki.pl
   SITE_INDEXABLE=false
   SEED_FORCE=0
   SITE_DOMAIN=gabinetzielonki.pl
   CMS_DOMAIN=cms.gabinetzielonki.pl
   ```
   Leave `REGISTRY` unset, so compose uses the locally loaded `medical-centre/*`
   images instead of trying to pull them.
3. Put the origin certificate in `deploy/certs/` (see above).
4. Schedule the backup cron:
   ```
   20 3 * * * cd /srv/medical-centre && ./scripts/backup.sh 2>&1 | logger -t mc-backup
   ```
5. Run the first deploy from a workstation (next section).
6. Immediately create the first admin account at
   https://cms.gabinetzielonki.pl/admin. Payload lets whoever gets there first
   create it.

## Deploying a new version

From the repo root on a workstation with Docker. `~/.ssh/config` has this entry:

```
Host zielonki
    HostName tadek343.mikrus.xyz
    User root
    Port 10343
    IdentityFile ~/.ssh/id_ed25519
```

Then:

```sh
DEPLOY_HOST=zielonki ./scripts/deploy.sh
```

`scripts/deploy.sh` does the following:

1. Builds `web`, `cms` and `cms-tools` locally for `linux/amd64`, with
   `NEXT_PUBLIC_CMS_URL=https://cms.gabinetzielonki.pl` inlined into the web
   bundle. The local `.env` is ignored.
2. Copies `docker-compose.prod.yml`, `deploy/Caddyfile` and `scripts/backup.sh`
   to `/srv/medical-centre`. The server never holds a git checkout.
3. Streams the images over SSH (`docker save | docker load`). `cms-tools` is
   about 2 GB, so this step takes the longest.
4. Runs `docker compose up -d --no-build` and prunes old images.

On startup, the stack runs `cms-migrate` (Payload migrations) and `cms-seed`
(fills in missing practice data, never overwrites editors' changes) before
`cms` and `web` start.

If an upload is interrupted, `SKIP_BUILD=1` re-sends the existing images
without rebuilding.

Never build on the server: 2 GB RAM without swap isn't enough for the Next.js
build. If memory ever gets tight at runtime, upgrade to mikr.us 3.5 (4 GB).
After warm-up, the stack uses about 300 MB.

## Going live for search engines

`SITE_INDEXABLE=false` serves `Disallow: /` and `noindex`. Once the practice
approves the site:

```sh
ssh zielonki "cd /srv/medical-centre && sed -i 's/^SITE_INDEXABLE=.*/SITE_INDEXABLE=true/' .env \
  && docker compose -f docker-compose.prod.yml up -d web"
```

No rebuild is needed, because the value is read at runtime.

## Operations

```sh
ssh zielonki
cd /srv/medical-centre
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f --tail=100 cms web caddy
docker stats --no-stream
```

**Backups:** `scripts/backup.sh` writes a database dump and a media archive
every night and keeps 14 days. Restore steps are at the bottom of the script.
mikr.us takes no snapshots and the copies sit on the same server, so set up
an off-server copy (the `rclone` line in the script).

**DNS after changes:** seohost's old records had a 1 h TTL. If a browser shows
seohost's "domena została zdelegowana" page, it's a stale cache: run
`ipconfig /flushdns` on Windows and clear `chrome://net-internals/#dns`.

## Verification checklist

```sh
curl -sI https://gabinetzielonki.pl/          # 200
curl -sI https://www.gabinetzielonki.pl/      # 301 → https://gabinetzielonki.pl/
curl -sI http://gabinetzielonki.pl/           # 301 → https://
curl -sI https://cms.gabinetzielonki.pl/admin # 200
curl -s  https://gabinetzielonki.pl/robots.txt
```
