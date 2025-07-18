#!/bin/bash
set -e

# Docker Management Script for ChainBet
# Provides utilities for Docker operations

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Function to check if Docker is running
check_docker() {
    if ! docker info >/dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker first."
        exit 1
    fi
}

# Function to check if docker-compose is available
check_docker_compose() {
    if ! command -v docker-compose >/dev/null 2>&1; then
        print_error "docker-compose is not installed. Please install Docker Compose first."
        exit 1
    fi
}

# Function to start development environment
start_dev() {
    print_info "Starting development environment..."
    
    local profile=${1:-all}
    
    docker-compose -f docker-compose.dev.yml --profile "$profile" up -d
    
    print_status "Development environment started"
    print_info "Services available:"
    echo "  - MongoDB: mongodb://localhost:27017"
    echo "  - Redis: redis://localhost:6379"
    echo "  - Elasticsearch: http://localhost:9200"
    echo "  - Prometheus: http://localhost:9090"
    echo "  - Grafana: http://localhost:3003"
}

# Function to stop development environment
stop_dev() {
    print_info "Stopping development environment..."
    
    docker-compose -f docker-compose.dev.yml down
    
    print_status "Development environment stopped"
}

# Function to restart development environment
restart_dev() {
    print_info "Restarting development environment..."
    
    stop_dev
    start_dev "$1"
}

# Function to show logs
show_logs() {
    local service=$1
    
    if [ -z "$service" ]; then
        docker-compose -f docker-compose.dev.yml logs -f
    else
        docker-compose -f docker-compose.dev.yml logs -f "$service"
    fi
}

# Function to show status
show_status() {
    print_info "Docker Service Status:"
    echo "======================"
    
    docker-compose -f docker-compose.dev.yml ps
    
    print_info "Docker resource usage:"
    docker stats --no-stream
}

# Function to clean up
cleanup() {
    print_warning "This will remove all stopped containers, unused networks, and dangling images."
    echo "Continue? (y/N)"
    read -r response
    
    if [[ ! "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        print_info "Cleanup cancelled"
        return 0
    fi
    
    print_info "Cleaning up Docker resources..."
    
    # Remove stopped containers
    docker container prune -f
    
    # Remove unused networks
    docker network prune -f
    
    # Remove dangling images
    docker image prune -f
    
    # Remove unused volumes (optional)
    echo "Also remove unused volumes? (y/N)"
    read -r response
    
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        docker volume prune -f
    fi
    
    print_status "Cleanup completed"
}

# Function to build images
build_images() {
    print_info "Building Docker images..."
    
    local tag=${1:-latest}
    
    # Build web application
    print_info "Building web application..."
    docker build -t chainbet-web:$tag -f apps/web/Dockerfile .
    
    # Build API server
    print_info "Building API server..."
    docker build -t chainbet-api:$tag -f apps/api/Dockerfile .
    
    # Build ingestion service
    print_info "Building ingestion service..."
    docker build -t chainbet-ingestion:$tag -f apps/ingestion/Dockerfile .
    
    print_status "All images built successfully"
}

# Function to run tests
run_tests() {
    print_info "Running tests in Docker..."
    
    # Start test environment
    docker-compose -f docker-compose.test.yml up --build --abort-on-container-exit
    
    # Clean up test environment
    docker-compose -f docker-compose.test.yml down
    
    print_status "Tests completed"
}

# Function to reset development environment
reset_dev() {
    print_warning "This will stop all services and remove all data volumes."
    echo "Continue? (y/N)"
    read -r response
    
    if [[ ! "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        print_info "Reset cancelled"
        return 0
    fi
    
    print_info "Resetting development environment..."
    
    # Stop all services
    docker-compose -f docker-compose.dev.yml down
    
    # Remove volumes
    docker-compose -f docker-compose.dev.yml down -v
    
    # Remove images
    docker rmi chainbet-web:latest chainbet-api:latest chainbet-ingestion:latest 2>/dev/null || true
    
    print_status "Development environment reset"
}

# Function to backup data
backup_data() {
    local backup_dir="backups/docker"
    local timestamp=$(date +"%Y%m%d_%H%M%S")
    
    print_info "Creating Docker volume backup..."
    
    mkdir -p "$backup_dir"
    
    # Backup MongoDB data
    docker run --rm -v chainbet_mongodb_data:/data -v "$(pwd)/$backup_dir":/backup ubuntu:latest tar czf "/backup/mongodb_backup_$timestamp.tar.gz" -C /data .
    
    # Backup Redis data
    docker run --rm -v chainbet_redis_data:/data -v "$(pwd)/$backup_dir":/backup ubuntu:latest tar czf "/backup/redis_backup_$timestamp.tar.gz" -C /data .
    
    # Backup Elasticsearch data
    docker run --rm -v chainbet_elasticsearch_data:/data -v "$(pwd)/$backup_dir":/backup ubuntu:latest tar czf "/backup/elasticsearch_backup_$timestamp.tar.gz" -C /data .
    
    print_status "Data backup completed in $backup_dir"
}

# Function to restore data
restore_data() {
    local backup_file=$1
    
    if [ -z "$backup_file" ]; then
        print_error "Please provide a backup file"
        return 1
    fi
    
    if [ ! -f "$backup_file" ]; then
        print_error "Backup file not found: $backup_file"
        return 1
    fi
    
    print_warning "This will overwrite existing data. Are you sure? (y/N)"
    read -r response
    
    if [[ ! "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        print_info "Restore cancelled"
        return 0
    fi
    
    print_info "Restoring data from $backup_file..."
    
    # Stop services
    docker-compose -f docker-compose.dev.yml stop
    
    # Extract backup based on filename
    if [[ "$backup_file" == *mongodb* ]]; then
        docker run --rm -v chainbet_mongodb_data:/data -v "$(pwd)":/backup ubuntu:latest tar xzf "/backup/$backup_file" -C /data
    elif [[ "$backup_file" == *redis* ]]; then
        docker run --rm -v chainbet_redis_data:/data -v "$(pwd)":/backup ubuntu:latest tar xzf "/backup/$backup_file" -C /data
    elif [[ "$backup_file" == *elasticsearch* ]]; then
        docker run --rm -v chainbet_elasticsearch_data:/data -v "$(pwd)":/backup ubuntu:latest tar xzf "/backup/$backup_file" -C /data
    else
        print_error "Unknown backup file type"
        return 1
    fi
    
    # Restart services
    docker-compose -f docker-compose.dev.yml start
    
    print_status "Data restored successfully"
}

# Function to exec into container
exec_container() {
    local service=$1
    local command=${2:-/bin/bash}
    
    if [ -z "$service" ]; then
        print_error "Please specify a service name"
        return 1
    fi
    
    docker-compose -f docker-compose.dev.yml exec "$service" "$command"
}

# Main command handler
case "$1" in
    "start")
        check_docker
        check_docker_compose
        start_dev "$2"
        ;;
    "stop")
        check_docker
        check_docker_compose
        stop_dev
        ;;
    "restart")
        check_docker
        check_docker_compose
        restart_dev "$2"
        ;;
    "logs")
        check_docker
        check_docker_compose
        show_logs "$2"
        ;;
    "status")
        check_docker
        check_docker_compose
        show_status
        ;;
    "build")
        check_docker
        build_images "$2"
        ;;
    "test")
        check_docker
        check_docker_compose
        run_tests
        ;;
    "clean")
        check_docker
        cleanup
        ;;
    "reset")
        check_docker
        check_docker_compose
        reset_dev
        ;;
    "backup")
        check_docker
        backup_data
        ;;
    "restore")
        check_docker
        restore_data "$2"
        ;;
    "exec")
        check_docker
        check_docker_compose
        exec_container "$2" "$3"
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|logs|status|build|test|clean|reset|backup|restore|exec}"
        echo ""
        echo "Commands:"
        echo "  start [profile]    - Start development environment (profiles: database, cache, search, all)"
        echo "  stop              - Stop development environment"
        echo "  restart [profile] - Restart development environment"
        echo "  logs [service]    - Show logs for all services or specific service"
        echo "  status            - Show service status and resource usage"
        echo "  build [tag]       - Build Docker images with optional tag"
        echo "  test              - Run tests in Docker"
        echo "  clean             - Clean up Docker resources"
        echo "  reset             - Reset development environment (removes all data)"
        echo "  backup            - Backup data volumes"
        echo "  restore <file>    - Restore data from backup"
        echo "  exec <service> [cmd] - Execute command in container"
        exit 1
        ;;
esac
