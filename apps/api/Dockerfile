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
COPY apps/api/package.json ./apps/api/
COPY packages/*/package.json ./packages/*/
COPY packages/config/*/package.json ./packages/config/*/
RUN pnpm install --frozen-lockfile

# Build the application
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build --filter=api

# Production image
FROM base AS production
ENV NODE_ENV=production
COPY --from=builder /app/apps/api/next.config.js ./apps/api/
COPY --from=builder /app/apps/api/.next/standalone ./
COPY --from=builder /app/apps/api/.next/static ./apps/api/.next/static
COPY --from=builder /app/package.json ./package.json

EXPOSE 3001
CMD ["node", "apps/api/server.js"]

# Development image
FROM base AS development
ENV NODE_ENV=development
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3001
CMD ["pnpm", "dev", "--filter=api"]
