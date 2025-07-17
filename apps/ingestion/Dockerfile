# Common build args and stages
ARG NODE_VERSION=18.18.0
ARG PNPM_VERSION=9.0.0

# Base image with Node.js and pnpm
FROM node:${NODE_VERSION}-alpine AS base
ARG PNPM_VERSION
RUN npm install -g pnpm@${PNPM_VERSION}
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/ingestion/package.json ./apps/ingestion/
COPY packages/*/package.json ./packages/*/
COPY packages/config/*/package.json ./packages/config/*/
RUN pnpm install --frozen-lockfile

# Build the application
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build --filter=ingestion

# Production image
FROM base AS production
ENV NODE_ENV=production
COPY --from=builder /app/apps/ingestion/dist ./apps/ingestion/dist
COPY --from=builder /app/apps/ingestion/package.json ./apps/ingestion/
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

CMD ["node", "apps/ingestion/dist/index.js"]

# Development image
FROM base AS development
ENV NODE_ENV=development
COPY --from=deps /app/node_modules ./node_modules
COPY . .
CMD ["pnpm", "dev", "--filter=ingestion"]
