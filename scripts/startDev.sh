#!/bin/bash
set -e

# Start development environment using Docker Compose
echo "Starting development environment..."
docker-compose -f docker-compose.dev.yml up -d

# Wait for services to be ready
echo "Waiting for services to be ready..."
sleep 5

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Start development servers using Turbo
echo "Starting development servers..."
npx turbo run dev --parallel

# Trap SIGINT to gracefully shut down
trap 'echo "Shutting down..."; docker-compose -f docker-compose.dev.yml down; exit 0' SIGINT

# Keep script running
wait
