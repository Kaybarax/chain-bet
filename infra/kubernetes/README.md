# Kubernetes Configuration

This directory contains Kubernetes manifests for deploying the Todo App to a Kubernetes cluster.

## Contents

- `namespace.yaml`: Defines the `todo-app` namespace where all resources will be deployed
- `web-deployment.yaml`: Deployment configuration for the web frontend
- `web-service.yaml`: Service configuration for the web frontend
- `api-deployment.yaml`: Deployment configuration for the API backend
- `api-service.yaml`: Service configuration for the API backend
- `mongodb-secret.yaml`: Secret containing MongoDB connection URI
- `ingress.yaml`: Ingress configuration for external access

## Deployment

To deploy the application to Kubernetes:

1. Make sure you have `kubectl` installed and configured to connect to your cluster
2. Run the deployment script:

```bash
../../scripts/deploy.sh
```

## Cleanup

To remove all deployed resources:

```bash
../../scripts/cleanup.sh
```

## Manual Deployment

If you prefer to deploy manually, you can apply each manifest individually:

```bash
kubectl apply -f namespace.yaml
kubectl apply -f mongodb-secret.yaml
kubectl apply -f api-deployment.yaml
kubectl apply -f api-service.yaml
kubectl apply -f web-deployment.yaml
kubectl apply -f web-service.yaml
kubectl apply -f ingress.yaml
```

## Configuration

Before deploying to production, make sure to:

1. Update the `mongodb-secret.yaml` with your actual MongoDB connection URI (base64 encoded)
2. Update the `ingress.yaml` with your actual domain name
3. Configure TLS certificates for secure connections
