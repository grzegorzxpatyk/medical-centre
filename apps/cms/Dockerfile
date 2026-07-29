# Build from the monorepo root:
#   docker build -f apps/cms/Dockerfile .
FROM node:24-alpine AS base
RUN apk add --no-cache libc6-compat \
  && corepack enable \
  && corepack prepare pnpm@11.15.0 --activate

# Prune the monorepo to only what @medical-centre/cms needs
FROM base AS pruner
WORKDIR /app
COPY . .
RUN pnpm dlx turbo@^2.10.5 prune @medical-centre/cms --docker

# Install deps and build
FROM base AS builder
WORKDIR /app
COPY --from=pruner /app/out/json/ .
RUN pnpm install --frozen-lockfile
COPY --from=pruner /app/out/full/ .
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm dlx turbo@^2.10.5 run build --filter=@medical-centre/cms

# One-shot migration runner (needs the full Payload toolchain, hence built from builder)
FROM builder AS migrator
WORKDIR /app/apps/cms
CMD ["pnpm", "payload", "migrate"]

# Slim production runtime using Next.js standalone output
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs \
  && mkdir -p /app/media \
  && chown nextjs:nodejs /app/media
COPY --from=builder --chown=nextjs:nodejs /app/apps/cms/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/cms/.next/static ./apps/cms/.next/static
USER nextjs
EXPOSE 3001
ENV PORT=3001
ENV HOSTNAME=0.0.0.0
CMD ["node", "apps/cms/server.js"]
