# Build from the monorepo root:
#   docker build -f apps/web/Dockerfile .
FROM node:24-alpine AS base
RUN apk add --no-cache libc6-compat \
  && corepack enable \
  && corepack prepare pnpm@11.15.0 --activate

# Prune the monorepo to only what @medical-centre/web needs
FROM base AS pruner
WORKDIR /app
COPY . .
RUN pnpm dlx turbo@^2.10.5 prune @medical-centre/web --docker

# Install deps and build
FROM base AS builder
WORKDIR /app
COPY --from=pruner /app/out/json/ .
RUN pnpm install --frozen-lockfile
COPY --from=pruner /app/out/full/ .
# NEXT_PUBLIC_* vars are inlined into the client bundle at build time
ARG NEXT_PUBLIC_CMS_URL=http://localhost:3001
ENV NEXT_PUBLIC_CMS_URL=$NEXT_PUBLIC_CMS_URL
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm dlx turbo@^2.10.5 run build --filter=@medical-centre/web

# Slim production runtime using Next.js standalone output
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
CMD ["node", "apps/web/server.js"]
