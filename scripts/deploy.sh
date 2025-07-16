#!/bin/bash
set -e

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
    echo "kubectl is not installed. Please install it first."
    exit 1
fi

# Check if namespace exists, create if not
if ! kubectl get namespace todo-app &> /dev/null; then
    echo "Creating namespace todo-app..."
    kubectl apply -f infra/kubernetes/namespace.yaml
fi

# Apply MongoDB secret
echo "Applying MongoDB secret..."
kubectl apply -f infra/kubernetes/mongodb-secret.yaml

# Apply deployments and services
echo "Deploying API application..."
kubectl apply -f infra/kubernetes/api-deployment.yaml
kubectl apply -f infra/kubernetes/api-service.yaml

echo "Deploying Web application..."
kubectl apply -f infra/kubernetes/web-deployment.yaml
kubectl apply -f infra/kubernetes/web-service.yaml

# Apply ingress
echo "Configuring ingress..."
kubectl apply -f infra/kubernetes/ingress.yaml

echo "Deployment completed successfully!"
echo "You can check the status with: kubectl get all -n todo-app"
