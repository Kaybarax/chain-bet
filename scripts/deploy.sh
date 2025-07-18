#!/bin/bash
set -e

# Production Deployment Script for ChainBet
# Handles building, testing, and deploying the application

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

# Function to check if we're in a git repository
check_git_repo() {
    if [ ! -d ".git" ]; then
        print_error "Not in a git repository"
        exit 1
    fi
}

# Function to check if working directory is clean
check_clean_working_dir() {
    if [ -n "$(git status --porcelain)" ]; then
        print_error "Working directory is not clean. Please commit or stash changes."
        exit 1
    fi
}

# Function to check if on main/master branch
check_main_branch() {
    local current_branch=$(git rev-parse --abbrev-ref HEAD)
    if [ "$current_branch" != "main" ] && [ "$current_branch" != "master" ]; then
        print_warning "Not on main/master branch. Current branch: $current_branch"
        echo "Continue anyway? (y/N)"
        read -r response
        if [[ ! "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
            print_info "Deployment cancelled"
            exit 0
        fi
    fi
}

# Function to run pre-deployment checks
run_pre_deployment_checks() {
    print_info "Running pre-deployment checks..."
    
    # Check git repository
    check_git_repo
    check_clean_working_dir
    check_main_branch
    
    # Check environment variables
    if [ -z "$NODE_ENV" ]; then
        export NODE_ENV=production
    fi
    
    print_status "Pre-deployment checks passed"
}

# Function to build applications
build_applications() {
    print_info "Building applications..."
    
    # Install dependencies
    print_info "Installing dependencies..."
    pnpm install --frozen-lockfile
    
    # Run type checking
    print_info "Running type checking..."
    pnpm type-check
    
    # Run linting
    print_info "Running linting..."
    pnpm lint
    
    # Run tests
    print_info "Running tests..."
    pnpm test
    
    # Build applications
    print_info "Building applications..."
    pnpm build
    
    print_status "Applications built successfully"
}

# Function to build Docker images
build_docker_images() {
    print_info "Building Docker images..."
    
    local version=$(git rev-parse --short HEAD)
    local tag=${1:-$version}
    
    # Build web application
    print_info "Building web application Docker image..."
    docker build -t chainbet-web:$tag -t chainbet-web:latest -f apps/web/Dockerfile .
    
    # Build API server
    print_info "Building API server Docker image..."
    docker build -t chainbet-api:$tag -t chainbet-api:latest -f apps/api/Dockerfile .
    
    # Build ingestion service
    print_info "Building ingestion service Docker image..."
    docker build -t chainbet-ingestion:$tag -t chainbet-ingestion:latest -f apps/ingestion/Dockerfile .
    
    print_status "Docker images built successfully"
}

# Function to run integration tests
run_integration_tests() {
    print_info "Running integration tests..."
    
    # Start test environment
    docker-compose -f docker-compose.test.yml up -d
    
    # Wait for services to be ready
    sleep 30
    
    # Run tests
    docker-compose -f docker-compose.test.yml exec -T unit-tests pnpm test:coverage
    docker-compose -f docker-compose.test.yml exec -T integration-tests pnpm test:integration
    
    # Clean up
    docker-compose -f docker-compose.test.yml down
    
    print_status "Integration tests passed"
}

# Function to deploy to staging
deploy_to_staging() {
    print_info "Deploying to staging environment..."
    
    # This would typically involve:
    # 1. Pushing images to container registry
    # 2. Updating Kubernetes manifests
    # 3. Applying changes to staging cluster
    
    print_warning "Staging deployment not implemented yet"
    print_info "Manual steps:"
    echo "1. Push Docker images to your container registry"
    echo "2. Update Kubernetes manifests with new image tags"
    echo "3. Apply changes to staging cluster"
}

# Function to deploy to production
deploy_to_production() {
    print_info "Deploying to production environment..."
    
    print_warning "This will deploy to production. Are you sure? (y/N)"
    read -r response
    
    if [[ ! "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        print_info "Production deployment cancelled"
        return 0
    fi
    
    # This would typically involve:
    # 1. Pushing images to container registry
    # 2. Updating Kubernetes manifests
    # 3. Applying changes to production cluster
    # 4. Running health checks
    
    print_warning "Production deployment not implemented yet"
    print_info "Manual steps:"
    echo "1. Push Docker images to your container registry"
    echo "2. Update Kubernetes manifests with new image tags"
    echo "3. Apply changes to production cluster"
    echo "4. Run health checks"
}

# Function to create a release
create_release() {
    local version=$1
    
    if [ -z "$version" ]; then
        print_error "Please provide a version number"
        exit 1
    fi
    
    print_info "Creating release v$version..."
    
    # Create git tag
    git tag -a "v$version" -m "Release version $version"
    
    # Push tag
    git push origin "v$version"
    
    print_status "Release v$version created"
}

# Function to rollback deployment
rollback_deployment() {
    local environment=$1
    local version=$2
    
    if [ -z "$environment" ] || [ -z "$version" ]; then
        print_error "Please provide environment and version"
        exit 1
    fi
    
    print_info "Rolling back $environment to version $version..."
    
    print_warning "Rollback not implemented yet"
    print_info "Manual steps:"
    echo "1. Update Kubernetes manifests to use previous image tags"
    echo "2. Apply changes to $environment cluster"
    echo "3. Run health checks"
}

# Function to show deployment status
show_deployment_status() {
    print_info "Deployment Status:"
    echo "=================="
    
    if command -v kubectl &> /dev/null; then
        print_info "Kubernetes deployments:"
        kubectl get deployments -l app=chainbet
        
        print_info "Service status:"
        kubectl get services -l app=chainbet
    else
        print_warning "kubectl not found. Cannot show Kubernetes status."
    fi
    
    print_info "Docker images:"
    docker images | grep chainbet || echo "No ChainBet images found"
}

# Main command handler
case "$1" in
    "build")
        run_pre_deployment_checks
        build_applications
        ;;
    "docker")
        build_docker_images "$2"
        ;;
    "test")
        run_integration_tests
        ;;
    "staging")
        run_pre_deployment_checks
        build_applications
        build_docker_images
        run_integration_tests
        deploy_to_staging
        ;;
    "production")
        run_pre_deployment_checks
        build_applications
        build_docker_images
        run_integration_tests
        deploy_to_production
        ;;
    "release")
        create_release "$2"
        ;;
    "rollback")
        rollback_deployment "$2" "$3"
        ;;
    "status")
        show_deployment_status
        ;;
    "full")
        run_pre_deployment_checks
        build_applications
        build_docker_images
        run_integration_tests
        print_info "Full deployment pipeline completed successfully!"
        ;;
    *)
        echo "Usage: $0 {build|docker|test|staging|production|release|rollback|status|full}"
        echo ""
        echo "Commands:"
        echo "  build        - Build applications and run tests"
        echo "  docker [tag] - Build Docker images with optional tag"
        echo "  test         - Run integration tests"
        echo "  staging      - Deploy to staging environment"
        echo "  production   - Deploy to production environment"
        echo "  release <v>  - Create a release with version number"
        echo "  rollback <env> <v> - Rollback environment to version"
        echo "  status       - Show deployment status"
        echo "  full         - Run complete deployment pipeline"
        exit 1
        ;;
esac
