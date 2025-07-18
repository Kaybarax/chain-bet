#!/bin/bash
set -e

echo "🚀 Starting ChainBet Development Servers..."
echo "============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Check if services are running
print_info "Checking if services are running..."
if ! docker-compose -f docker-compose.dev.yml ps | grep -q "Up"; then
    print_info "Starting services first..."
    .devcontainer/start-dev.sh
fi

# Start development servers
print_info "Starting all development servers..."
echo ""
echo "Starting servers in parallel:"
echo "  🌐 Web App:    http://localhost:3000"
echo "  🔌 API Server: http://localhost:3001"
echo "  📱 Mobile App: Metro bundler for React Native"
echo ""
echo "Press Ctrl+C to stop all servers"
echo "============================================="

# Trap SIGINT to gracefully shut down
trap 'echo "Shutting down development servers..."; kill 0' INT

# Start all development servers using pnpm in parallel
pnpm dev
