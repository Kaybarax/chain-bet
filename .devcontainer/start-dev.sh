#!/bin/bash
set -e

echo "🚀 Starting ChainBet Development Environment..."
echo "============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if Docker is available
if ! command -v docker &> /dev/null; then
    print_error "Docker is not available in the container"
    exit 1
fi

# Start essential services using Docker Compose
print_info "Starting database and cache services..."
docker-compose -f docker-compose.dev.yml up -d mongodb redis elasticsearch

# Wait for services to be ready
print_info "Waiting for services to be ready..."
sleep 15

# Check service health
print_info "Checking service health..."
for service in mongodb redis elasticsearch; do
    if docker-compose -f docker-compose.dev.yml ps | grep -q "$service.*Up"; then
        print_status "$service is running"
    else
        print_warning "$service may not be ready yet"
    fi
done

# Run database migrations
print_info "Running database migrations..."
tsx scripts/migrate.ts || print_warning "Database migrations failed - this is normal if this is the first setup"

# Seed database
print_info "Seeding database..."
tsx scripts/seed.ts || print_warning "Database seeding failed - this is normal if this is the first setup"

echo ""
echo "============================================="
echo -e "${GREEN}🎉 Development environment started successfully!${NC}"
echo ""
echo "Available commands:"
echo "  pnpm dev              - Start all development servers"
echo "  pnpm dev:web          - Start web app only (port 3000)"
echo "  pnpm dev:api          - Start API server only (port 3001)"
echo "  pnpm dev:mobile       - Start mobile app only"
echo "  pnpm build            - Build all applications"
echo "  pnpm test             - Run all tests"
echo "  pnpm lint             - Run linting"
echo ""
echo "Services running:"
echo "  MongoDB:       localhost:27017"
echo "  Redis:         localhost:6379"
echo "  Elasticsearch: localhost:9200"
echo ""
echo "Next steps:"
echo "1. Run 'pnpm dev' to start all development servers"
echo "2. Visit http://localhost:3000 for the web app"
echo "3. API available at http://localhost:3001"
echo "============================================="
