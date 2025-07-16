#!/bin/bash
set -e

# Build all packages and applications using Turbo
echo "Building all packages and applications..."
npx turbo run build

# Build Docker images
echo "Building Docker images..."

# Build web app image
echo "Building web app image..."
docker build -t todo-web:latest -f apps/web/Dockerfile .

# Build API image
echo "Building API image..."
docker build -t todo-api:latest -f apps/api/Dockerfile .

# Build ingestion worker image
echo "Building ingestion worker image..."
docker build -t todo-ingestion:latest -f apps/ingestion/Dockerfile .

echo "All Docker images built successfully!"
