#!/bin/bash
set -e

echo "🚀 Starting ChainBet Development Environment..."

# Navigate to project root
cd "$(dirname "$0")/.."

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local not found. Copying from .env.example..."
    cp .env.example .env.local
    echo "✅ Please edit .env.local with your configuration values"
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    pnpm install
fi

# Start infrastructure services
echo "🐳 Starting infrastructure services..."
docker-compose -f docker-compose.dev.yml up -d mongodb redis elasticsearch prometheus grafana

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check service health
echo "🔍 Checking service health..."
docker-compose -f docker-compose.dev.yml ps

# Build packages if needed
echo "🏗️  Building packages..."
pnpm build --filter='./packages/*'

# Run database migrations
echo "🗄️  Running database migrations..."
pnpm db:migrate

# Start development servers
echo "� Starting development servers..."
pnpm dev --filter=web

# Trap SIGINT to gracefully shut down
trap 'echo "🛑 Shutting down..."; docker-compose -f docker-compose.dev.yml down; exit 0' SIGINT

# Keep script running
wait
