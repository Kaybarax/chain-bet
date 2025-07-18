#!/bin/bash
set -e

echo "🌐 Starting ChainBet Web App..."
echo "============================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if services are running
print_info "Checking if services are running..."
if ! docker-compose -f docker-compose.dev.yml ps | grep -q "Up"; then
    print_info "Starting services first..."
    .devcontainer/start-dev.sh
fi

# Start web development server
print_info "Starting web development server..."
echo ""
echo "🌐 Web App will be available at: http://localhost:3000"
echo "Press Ctrl+C to stop the server"
echo "============================================="

# Start web app only
pnpm dev:web
