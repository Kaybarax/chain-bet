# ChainBet Development Container

This directory contains the development container configuration for ChainBet, which provides a consistent development environment using Docker.

## 📁 Files

- `devcontainer.json` - VS Code devcontainer configuration
- `Dockerfile` - Custom Docker image for the development environment
- `start-dev.sh` - Script to start all Docker services (MongoDB, Redis, Elasticsearch)
- `run-dev.sh` - Script to start all development servers
- `run-web.sh` - Script to start only the web application

## 🚀 Getting Started

### Prerequisites

- Docker Desktop installed and running
- VS Code with the "Dev Containers" extension

### Using the Development Container

1. **Open in VS Code**: Open the ChainBet project in VS Code
2. **Reopen in Container**: Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac) and select "Dev Containers: Reopen in Container"
3. **Wait for Setup**: The container will build and install dependencies automatically
4. **Start Development**: Once ready, the services will start automatically

### Manual Commands

If you need to run commands manually:

```bash
# Start all Docker services (MongoDB, Redis, Elasticsearch)
./.devcontainer/start-dev.sh

# Start all development servers
./.devcontainer/run-dev.sh

# Start only the web application
./.devcontainer/run-web.sh

# Or use pnpm directly
pnpm dev              # Start all development servers
pnpm dev:web          # Start web app only
pnpm dev:api          # Start API server only
pnpm dev:mobile       # Start mobile app only
```

## 🛠️ Services

The development environment includes:

- **MongoDB**: Database (port 27017)
- **Redis**: Cache (port 6379)
- **Elasticsearch**: Search engine (port 9200)
- **Web App**: Next.js application (port 3000)
- **API Server**: Fastify API (port 3001)

## 🔧 Configuration

### Environment Variables

The devcontainer automatically sets up these environment variables:

```bash
NODE_ENV=development
DATABASE_URL=mongodb://admin:password@localhost:27017/chainbet?authSource=admin
REDIS_URL=redis://localhost:6379
ELASTICSEARCH_URL=http://localhost:9200
```

1. **Open in DevContainer**:
   - Open VS Code in the project root
   - Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
   - Select "Dev Containers: Reopen in Container"

2. **Wait for Setup**:
   - The container will build automatically
   - Dependencies will be installed (`pnpm install`)
   - Backing services will start (MongoDB, Redis, Elasticsearch)
   - Database will be migrated and seeded

3. **Start Development**:
   ```bash
   # Start the web application
   pnpm dev:web
   
   # Start the API server
   pnpm dev:api
   
   # Start both in parallel
   pnpm dev
   ```

## Available Services

When the devcontainer starts, the following services will be available:

- **Web App**: http://localhost:3000
- **API Server**: http://localhost:3001
- **Storybook**: http://localhost:3002
- **Grafana**: http://localhost:3003
- **MongoDB**: localhost:27017
- **Redis**: localhost:6379
- **Elasticsearch**: http://localhost:9200
- **Prometheus**: http://localhost:9090

## Development Commands

```bash
# Install dependencies
pnpm install

# Start development servers
pnpm dev              # All services
pnpm dev:web          # Web app only
pnpm dev:api          # API only
pnpm dev:mobile       # Mobile app
pnpm dev:ingestion    # Data ingestion service

# Build
pnpm build            # Build all
pnpm build:web        # Build web app only

# Testing
pnpm test             # Run all tests
pnpm test:e2e         # Run E2E tests
pnpm test:web         # Test web app only

# Database
pnpm db:migrate       # Run migrations
pnpm db:seed          # Seed database
pnpm db:reset         # Reset database

# Blockchain
pnpm contracts:compile    # Compile smart contracts
pnpm contracts:deploy     # Deploy contracts
pnpm contracts:test       # Test contracts

# Linting and formatting
pnpm lint             # Lint all code
pnpm lint:fix         # Fix linting issues
pnpm format           # Format code
```

## Managing Backing Services

```bash
# Start services
docker-compose -f .devcontainer/docker-compose.yml up -d

# Stop services
docker-compose -f .devcontainer/docker-compose.yml down

# View logs
docker-compose -f .devcontainer/docker-compose.yml logs -f

# Reset data
docker-compose -f .devcontainer/docker-compose.yml down -v
```

## Customization

### Adding Extensions
Edit `.devcontainer/devcontainer.json` and add extension IDs to the `extensions` array.

### Modifying the Container
Edit `.devcontainer/Dockerfile` to add additional tools or system packages.

### Environment Variables
Update the `remoteEnv` section in `devcontainer.json` or create a `.env` file.

## Troubleshooting

### Container Won't Start
- Ensure Docker Desktop is running
- Check for port conflicts
- Try rebuilding: "Dev Containers: Rebuild Container"

### Database Connection Issues
- Verify backing services are running: `docker ps`
- Check connection strings in environment variables
- Restart backing services if needed

### Performance Issues
- Allocate more memory to Docker Desktop
- Consider using Docker volumes for node_modules
- Enable file system caching if available

### Permission Issues
- The devcontainer runs as the `node` user (non-root)
- File permissions should be handled automatically
- If issues persist, check Docker Desktop file sharing settings

## Benefits

- **Consistency**: Same environment for all developers
- **Isolation**: No need to install tools on host machine
- **Portability**: Works on any machine with Docker
- **Speed**: Pre-built image with all dependencies
- **Integration**: Seamless VS Code experience with extensions and debugging
