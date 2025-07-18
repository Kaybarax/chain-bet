#!/bin/bash
set -e

# Database Management Script for ChainBet
# Provides utilities for database operations across all environments

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

# Function to check if MongoDB is running
check_mongodb() {
    local host=${1:-localhost}
    local port=${2:-27017}
    
    if nc -z "$host" "$port" 2>/dev/null; then
        return 0
    else
        return 1
    fi
}

# Function to check if Redis is running
check_redis() {
    local host=${1:-localhost}
    local port=${2:-6379}
    
    if nc -z "$host" "$port" 2>/dev/null; then
        return 0
    else
        return 1
    fi
}

# Function to check if Elasticsearch is running
check_elasticsearch() {
    local host=${1:-localhost}
    local port=${2:-9200}
    
    if curl -s "http://$host:$port/_cluster/health" >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Function to wait for services
wait_for_services() {
    local max_attempts=30
    local attempt=1
    
    print_info "Waiting for database services to be ready..."
    
    while [ $attempt -le $max_attempts ]; do
        if check_mongodb && check_redis && check_elasticsearch; then
            print_status "All services are ready!"
            return 0
        fi
        
        echo -n "."
        sleep 2
        ((attempt++))
    done
    
    print_error "Services did not start within the expected time"
    return 1
}

# Function to migrate database
migrate_database() {
    print_info "Running database migrations..."
    
    if [ ! -f "scripts/migrate.ts" ]; then
        print_warning "Migration script not found. Creating basic migration..."
        mkdir -p scripts
        cat > scripts/migrate.ts << 'EOF'
import { MongoClient } from 'mongodb';
import * as fs from 'fs';
import * as path from 'path';

const MONGODB_URI = process.env.DATABASE_URL || process.env.MONGODB_URI || 'mongodb://admin:password@localhost:27017/chainbet?authSource=admin';

async function migrate() {
    const client = new MongoClient(MONGODB_URI);
    
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        
        const db = client.db();
        
        // Create indexes
        await db.collection('matches').createIndex({ id: 1 }, { unique: true });
        await db.collection('matches').createIndex({ startTime: 1 });
        await db.collection('bets').createIndex({ matchId: 1 });
        await db.collection('bets').createIndex({ bettor: 1 });
        await db.collection('users').createIndex({ address: 1 }, { unique: true });
        
        console.log('Database migration completed successfully');
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    } finally {
        await client.close();
    }
}

migrate();
EOF
    fi
    
    npx tsx scripts/migrate.ts
}

# Function to seed database
seed_database() {
    print_info "Seeding database..."
    
    if [ ! -f "scripts/seed.ts" ]; then
        print_warning "Seed script not found. Creating basic seed..."
        mkdir -p scripts
        cat > scripts/seed.ts << 'EOF'
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.DATABASE_URL || process.env.MONGODB_URI || 'mongodb://admin:password@localhost:27017/chainbet?authSource=admin';

async function seed() {
    const client = new MongoClient(MONGODB_URI);
    
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        
        const db = client.db();
        
        // Sample matches
        const matches = [
            {
                id: 'match_1',
                homeTeam: 'Manchester United',
                awayTeam: 'Liverpool',
                startTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
                result: '',
                finished: false,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 'match_2',
                homeTeam: 'Barcelona',
                awayTeam: 'Real Madrid',
                startTime: new Date(Date.now() + 48 * 60 * 60 * 1000),
                result: '',
                finished: false,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];
        
        await db.collection('matches').insertMany(matches);
        
        console.log('Database seeding completed successfully');
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    } finally {
        await client.close();
    }
}

seed();
EOF
    fi
    
    npx tsx scripts/seed.ts
}

# Function to reset database
reset_database() {
    print_warning "This will delete all data in the database. Are you sure? (y/N)"
    read -r response
    
    if [[ ! "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        print_info "Database reset cancelled"
        return 0
    fi
    
    print_info "Resetting database..."
    
    if [ ! -f "scripts/reset.ts" ]; then
        print_warning "Reset script not found. Creating basic reset..."
        mkdir -p scripts
        cat > scripts/reset.ts << 'EOF'
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.DATABASE_URL || process.env.MONGODB_URI || 'mongodb://admin:password@localhost:27017/chainbet?authSource=admin';

async function reset() {
    const client = new MongoClient(MONGODB_URI);
    
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        
        const db = client.db();
        
        // Drop all collections
        const collections = await db.collections();
        for (const collection of collections) {
            await collection.drop();
            console.log(`Dropped collection: ${collection.collectionName}`);
        }
        
        console.log('Database reset completed successfully');
    } catch (error) {
        console.error('Reset failed:', error);
        process.exit(1);
    } finally {
        await client.close();
    }
}

reset();
EOF
    fi
    
    npx tsx scripts/reset.ts
}

# Function to backup database
backup_database() {
    local backup_dir="backups"
    local timestamp=$(date +"%Y%m%d_%H%M%S")
    local backup_file="$backup_dir/chainbet_backup_$timestamp.archive"
    
    print_info "Creating database backup..."
    
    mkdir -p "$backup_dir"
    
    if command -v mongodump &> /dev/null; then
        mongodump --uri="${DATABASE_URL:-mongodb://admin:password@localhost:27017/chainbet?authSource=admin}" --archive="$backup_file" --gzip
        print_status "Database backup created: $backup_file"
    else
        print_error "mongodump not found. Please install MongoDB tools."
        return 1
    fi
}

# Function to restore database
restore_database() {
    local backup_file="$1"
    
    if [ -z "$backup_file" ]; then
        print_error "Please provide a backup file to restore"
        return 1
    fi
    
    if [ ! -f "$backup_file" ]; then
        print_error "Backup file not found: $backup_file"
        return 1
    fi
    
    print_warning "This will overwrite the current database. Are you sure? (y/N)"
    read -r response
    
    if [[ ! "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        print_info "Database restore cancelled"
        return 0
    fi
    
    print_info "Restoring database from $backup_file..."
    
    if command -v mongorestore &> /dev/null; then
        mongorestore --uri="${DATABASE_URL:-mongodb://admin:password@localhost:27017/chainbet?authSource=admin}" --archive="$backup_file" --gzip --drop
        print_status "Database restored successfully"
    else
        print_error "mongorestore not found. Please install MongoDB tools."
        return 1
    fi
}

# Function to show database status
show_status() {
    print_info "Database Service Status:"
    echo "========================="
    
    if check_mongodb; then
        print_status "MongoDB: Running"
    else
        print_error "MongoDB: Not running"
    fi
    
    if check_redis; then
        print_status "Redis: Running"
    else
        print_error "Redis: Not running"
    fi
    
    if check_elasticsearch; then
        print_status "Elasticsearch: Running"
    else
        print_error "Elasticsearch: Not running"
    fi
}

# Main command handler
case "$1" in
    "migrate")
        migrate_database
        ;;
    "seed")
        seed_database
        ;;
    "reset")
        reset_database
        ;;
    "backup")
        backup_database
        ;;
    "restore")
        restore_database "$2"
        ;;
    "status")
        show_status
        ;;
    "wait")
        wait_for_services
        ;;
    "setup")
        wait_for_services
        migrate_database
        seed_database
        ;;
    *)
        echo "Usage: $0 {migrate|seed|reset|backup|restore|status|wait|setup}"
        echo ""
        echo "Commands:"
        echo "  migrate   - Run database migrations"
        echo "  seed      - Seed database with sample data"
        echo "  reset     - Reset database (WARNING: deletes all data)"
        echo "  backup    - Create database backup"
        echo "  restore   - Restore database from backup"
        echo "  status    - Show database service status"
        echo "  wait      - Wait for database services to be ready"
        echo "  setup     - Wait for services, migrate, and seed (complete setup)"
        exit 1
        ;;
esac
