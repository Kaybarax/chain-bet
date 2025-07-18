# DevContainer Dockerfile for ChainBet Development Environment
ARG NODE_VERSION=18.18.0
ARG PNPM_VERSION=9.0.0

FROM node:${NODE_VERSION}-alpine AS base

# Install system dependencies
RUN apk add --no-cache \
    git \
    openssh-client \
    curl \
    wget \
    bash \
    zsh \
    fish \
    vim \
    nano \
    htop \
    build-base \
    python3 \
    py3-pip \
    libc6-compat \
    chromium \
    && apk update

# Install pnpm globally
ARG PNPM_VERSION
RUN npm install -g pnpm@${PNPM_VERSION}

# Install global development tools
RUN npm install -g \
    typescript \
    ts-node \
    nodemon \
    @turbo/gen \
    eslint \
    prettier \
    @commitlint/cli \
    husky

# Create non-root user for development
RUN addgroup -g 1000 node \
    && adduser -u 1000 -G node -s /bin/zsh -D node

# Set up workspace
WORKDIR /app
RUN chown -R node:node /app

# Switch to non-root user
USER node

# Install Oh My Zsh for better shell experience
RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended

# Set up git configuration placeholders (will be overridden by devcontainer)
RUN git config --global user.email "developer@chainbet.com" \
    && git config --global user.name "ChainBet Developer" \
    && git config --global init.defaultBranch main

# Set environment variables for development
ENV NODE_ENV=development
ENV PNPM_HOME="/home/node/.local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Set up shell
ENV SHELL=/bin/zsh

# Configure Playwright for Chromium
ENV PLAYWRIGHT_BROWSERS_PATH=/usr/bin/chromium
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1

# Expose common development ports
EXPOSE 3000 3001 3002 3003 6379 9200 9090 27017

# Default command to keep container running
CMD ["tail", "-f", "/dev/null"]
