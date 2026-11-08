FROM node:22-alpine AS base
RUN corepack enable
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
COPY apps/worker/package.json apps/worker/
COPY packages/core/package.json packages/core/
COPY packages/ui/package.json packages/ui/
COPY packages/db/package.json packages/db/
COPY packages/adapters-github/package.json packages/adapters-github/
COPY packages/adapters-railway/package.json packages/adapters-railway/
RUN pnpm install --frozen-lockfile

FROM deps AS build
COPY tsconfig.base.json turbo.json ./
COPY packages/core packages/core
COPY packages/ui packages/ui
COPY apps/web apps/web
RUN pnpm --filter @factory/web build

FROM base AS runtime
ENV NODE_ENV=production
COPY --from=build /app /app
WORKDIR /app/apps/web
EXPOSE 3000
CMD ["pnpm", "start"]
