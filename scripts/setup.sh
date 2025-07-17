#!/bin/bash

# TODO Monorepo Setup Script
# This script sets up the complete development environment

set -e

echo "🚀 Setting up TODO Monorepo Template..."

# Check if required tools are installed
check_tool() {
    if ! command -v $1 &> /dev/null; then
        echo "❌ $1 is not installed. Please install $1 first."
        exit 1
    fi
}

echo "📋 Checking prerequisites..."
check_tool node
check_tool pnpm
check_tool docker

echo "📦 Installing dependencies..."
pnpm install

echo "🔧 Setting up environment variables..."
if [ ! -f .env.local ]; then
    cp .env.example .env.local
    echo "✅ Created .env.local from .env.example"
    echo "📝 Please update .env.local with your configuration"
fi

echo "🐳 Starting Docker services..."
if docker-compose -f docker-compose.dev.yml ps | grep -q Up; then
    echo "✅ Docker services are already running"
else
    docker-compose -f docker-compose.dev.yml up -d database redis elasticsearch
    echo "✅ Started database services"
fi

echo "🗃️ Setting up database..."
sleep 10  # Wait for database to be ready
pnpm db:migrate
pnpm db:seed

echo "🔨 Building packages..."
pnpm build:packages

echo "🧪 Running tests..."
pnpm test

echo "✅ Setup complete!"
echo ""
echo "🎉 Your TODO Monorepo is ready!"
echo ""
echo "📖 Next steps:"
echo "  1. Update .env.local with your configuration"
echo "  2. Run 'pnpm dev' to start development"
echo "  3. Visit http://localhost:3000 for the web app"
echo "  4. Visit http://localhost:3001/docs for API documentation"
echo ""
echo "📚 Documentation: https://github.com/yourcompany/todo-monorepo"
echo "💬 Support: support@yourcompany.com"
