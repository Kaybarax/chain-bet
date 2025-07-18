#!/bin/bash
set -e

echo "🚀 Setting up ChainBet Development Environment"
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

# Check if running from project root
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2)
REQUIRED_NODE_VERSION="18.0.0"
if [ "$(printf '%s\n' "$REQUIRED_NODE_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_NODE_VERSION" ]; then
    print_error "Node.js version $REQUIRED_NODE_VERSION or higher is required. Current version: $NODE_VERSION"
    exit 1
fi
print_status "Node.js version check passed ($NODE_VERSION)"

# Check pnpm
if ! command -v pnpm &> /dev/null; then
    print_warning "pnpm not found. Installing..."
    npm install -g pnpm
fi
print_status "pnpm is available"

# Check Docker
if ! command -v docker &> /dev/null; then
    print_error "Docker is required but not installed. Please install Docker first."
    exit 1
fi
print_status "Docker is available"

# Check Docker Compose
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is required but not installed. Please install Docker Compose first."
    exit 1
fi
print_status "Docker Compose is available"

# Setup environment file
if [ ! -f ".env.local" ]; then
    print_info "Creating .env.local from .env.example..."
    cp .env.example .env.local
    print_warning "Please edit .env.local with your configuration values"
else
    print_status ".env.local already exists"
fi

# Install dependencies
print_info "Installing dependencies..."
pnpm install --frozen-lockfile
print_status "Dependencies installed"

# Build shared packages
print_info "Building shared packages..."
pnpm build --filter='./packages/*'
print_status "Shared packages built"

# Start infrastructure services
print_info "Starting infrastructure services..."
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

# Setup git hooks
if [ -d ".git" ]; then
    print_info "Setting up git hooks..."
    pnpm prepare
    print_status "Git hooks configured"
fi

# Run database migrations
print_info "Running database migrations..."
pnpm db:migrate || print_warning "Database migrations failed - this is normal if this is the first setup"

# Seed database
print_info "Seeding database..."
pnpm db:seed || print_warning "Database seeding failed - this is normal if this is the first setup"

echo ""
echo "============================================="
echo -e "${GREEN}🎉 Setup completed successfully!${NC}"
echo ""
echo "Available commands:"
echo "  pnpm dev              - Start all development servers"
echo "  pnpm dev:web          - Start web app only"
echo "  pnpm dev:api          - Start API server only"
echo "  pnpm dev:mobile       - Start mobile app only"
echo "  pnpm build            - Build all applications"
echo "  pnpm test             - Run all tests"
echo "  pnpm lint             - Run linting"
echo "  pnpm docker:dev       - Start full Docker development environment"
echo ""
echo "Next steps:"
echo "1. Edit .env.local with your configuration"
echo "2. Run 'pnpm dev' to start development servers"
echo "3. Visit http://localhost:3000 for the web app"
echo "============================================="
