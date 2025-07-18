#!/bin/bash

# DevContainer Management Script
# This script helps manage the ChainBet devcontainer environment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "\n${BLUE}=== $1 ===${NC}\n"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker Desktop and try again."
        exit 1
    fi
}

# Function to start backing services
start_services() {
    print_header "Starting Backing Services"
    check_docker
    
    cd "$(dirname "$0")"
    
    print_status "Starting MongoDB, Redis, and Elasticsearch..."
    docker-compose -f docker-compose.yml up -d mongodb redis elasticsearch
    
    print_status "Waiting for services to be healthy..."
    
    # Wait for MongoDB
    print_status "Waiting for MongoDB..."
    until docker-compose -f docker-compose.yml exec -T mongodb mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; do
        sleep 2
    done
    
    # Wait for Redis
    print_status "Waiting for Redis..."
    until docker-compose -f docker-compose.yml exec -T redis redis-cli ping > /dev/null 2>&1; do
        sleep 2
    done
    
    # Wait for Elasticsearch
    print_status "Waiting for Elasticsearch..."
    until curl -s http://localhost:9200/_cluster/health > /dev/null 2>&1; do
        sleep 2
    done
    
    print_status "All services are ready!"
}

# Function to stop backing services
stop_services() {
    print_header "Stopping Backing Services"
    check_docker
    
    cd "$(dirname "$0")"
    docker-compose -f docker-compose.yml down
    
    print_status "Services stopped."
}

# Function to start monitoring services
start_monitoring() {
    print_header "Starting Monitoring Services"
    check_docker
    
    cd "$(dirname "$0")"
    docker-compose -f docker-compose.yml up -d prometheus grafana
    
    print_status "Monitoring services started."
    print_status "Grafana: http://localhost:3003 (admin/admin)"
    print_status "Prometheus: http://localhost:9090"
}

# Function to show service status
show_status() {
    print_header "Service Status"
    check_docker
    
    cd "$(dirname "$0")"
    docker-compose -f docker-compose.yml ps
}

# Function to show logs
show_logs() {
    print_header "Service Logs"
    check_docker
    
    cd "$(dirname "$0")"
    
    if [ -z "$1" ]; then
        docker-compose -f docker-compose.yml logs -f
    else
        docker-compose -f docker-compose.yml logs -f "$1"
    fi
}

# Function to reset data
reset_data() {
    print_header "Resetting Data"
    check_docker
    
    read -p "This will delete all data. Are you sure? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cd "$(dirname "$0")"
        docker-compose -f docker-compose.yml down -v
        print_status "Data reset complete."
    else
        print_status "Reset cancelled."
    fi
}

# Function to backup data
backup_data() {
    print_header "Backing Up Data"
    check_docker
    
    BACKUP_DIR="./backups/$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$BACKUP_DIR"
    
    cd "$(dirname "$0")"
    
    # Backup MongoDB
    print_status "Backing up MongoDB..."
    docker-compose -f docker-compose.yml exec -T mongodb mongodump --host localhost:27017 --username admin --password password --authenticationDatabase admin --db chainbet --out /tmp/backup
    docker-compose -f docker-compose.yml exec -T mongodb tar -czf /tmp/mongodb_backup.tar.gz -C /tmp/backup .
    docker cp "$(docker-compose -f docker-compose.yml ps -q mongodb)":/tmp/mongodb_backup.tar.gz "$BACKUP_DIR/"
    
    # Backup Redis
    print_status "Backing up Redis..."
    docker-compose -f docker-compose.yml exec -T redis redis-cli SAVE
    docker cp "$(docker-compose -f docker-compose.yml ps -q redis)":/data/dump.rdb "$BACKUP_DIR/"
    
    print_status "Backup completed: $BACKUP_DIR"
}

# Function to restore data
restore_data() {
    print_header "Restoring Data"
    
    if [ -z "$1" ]; then
        print_error "Please specify backup directory: $0 restore <backup_directory>"
        exit 1
    fi
    
    BACKUP_DIR="$1"
    
    if [ ! -d "$BACKUP_DIR" ]; then
        print_error "Backup directory not found: $BACKUP_DIR"
        exit 1
    fi
    
    check_docker
    
    cd "$(dirname "$0")"
    
    # Restore MongoDB
    if [ -f "$BACKUP_DIR/mongodb_backup.tar.gz" ]; then
        print_status "Restoring MongoDB..."
        docker cp "$BACKUP_DIR/mongodb_backup.tar.gz" "$(docker-compose -f docker-compose.yml ps -q mongodb)":/tmp/
        docker-compose -f docker-compose.yml exec -T mongodb tar -xzf /tmp/mongodb_backup.tar.gz -C /tmp/
        docker-compose -f docker-compose.yml exec -T mongodb mongorestore --host localhost:27017 --username admin --password password --authenticationDatabase admin --db chainbet /tmp/chainbet
    fi
    
    # Restore Redis
    if [ -f "$BACKUP_DIR/dump.rdb" ]; then
        print_status "Restoring Redis..."
        docker-compose -f docker-compose.yml stop redis
        docker cp "$BACKUP_DIR/dump.rdb" "$(docker-compose -f docker-compose.yml ps -q redis)":/data/
        docker-compose -f docker-compose.yml start redis
    fi
    
    print_status "Restore completed."
}

# Function to show help
show_help() {
    echo "DevContainer Management Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  start          Start backing services (MongoDB, Redis, Elasticsearch)"
    echo "  stop           Stop all services"
    echo "  restart        Restart all services"
    echo "  status         Show service status"
    echo "  logs [service] Show logs (optionally for specific service)"
    echo "  monitoring     Start monitoring services (Prometheus, Grafana)"
    echo "  reset          Reset all data (destructive)"
    echo "  backup         Backup data"
    echo "  restore <dir>  Restore data from backup"
    echo "  help           Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start                    # Start core services"
    echo "  $0 logs mongodb            # Show MongoDB logs"
    echo "  $0 backup                  # Backup all data"
    echo "  $0 restore ./backups/xyz   # Restore from backup"
}

# Main script logic
case "$1" in
    start)
        start_services
        ;;
    stop)
        stop_services
        ;;
    restart)
        stop_services
        start_services
        ;;
    status)
        show_status
        ;;
    logs)
        show_logs "$2"
        ;;
    monitoring)
        start_monitoring
        ;;
    reset)
        reset_data
        ;;
    backup)
        backup_data
        ;;
    restore)
        restore_data "$2"
        ;;
    help|--help|-h)
        show_help
        ;;
    "")
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac
