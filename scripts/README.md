# Scripts

This directory contains utility scripts for development, building, and deployment of the Todo App.

## Available Scripts

- `startDev.sh`: Starts the development environment using Docker Compose and Turbo
- `build.sh`: Builds all packages and applications, then creates Docker images
- `deploy.sh`: Deploys the application to a Kubernetes cluster
- `cleanup.sh`: Removes all deployed resources from a Kubernetes cluster

## Usage

### Development

To start the development environment:

```bash
./scripts/startDev.sh
```

This script:
1. Starts the required services using Docker Compose
2. Installs dependencies if needed
3. Starts all applications in development mode using Turbo

### Building

To build the application and create Docker images:

```bash
./scripts/build.sh
```

This script:
1. Builds all packages and applications using Turbo
2. Creates Docker images for the web app, API, and ingestion worker

### Deployment

To deploy the application to Kubernetes:

```bash
./scripts/deploy.sh
```

This script:
1. Creates the namespace if it doesn't exist
2. Applies the MongoDB secret
3. Deploys the API and web applications
4. Configures the ingress for external access

### Cleanup

To remove all deployed resources:

```bash
./scripts/cleanup.sh
```

This script:
1. Removes the ingress
2. Removes the web and API deployments and services
3. Removes the MongoDB secret
4. Optionally removes the namespace

## Requirements

- Docker and Docker Compose for development and building
- kubectl configured with access to a Kubernetes cluster for deployment
