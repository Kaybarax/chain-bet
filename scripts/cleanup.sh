#!/bin/bash
set -e

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
    echo "kubectl is not installed. Please install it first."
    exit 1
fi

# Confirm before proceeding
read -p "This will delete all Kubernetes resources in the todo-app namespace. Are you sure? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Operation cancelled."
    exit 0
fi

# Delete ingress
echo "Deleting ingress..."
kubectl delete -f infra/kubernetes/ingress.yaml --ignore-not-found

# Delete deployments and services
echo "Deleting Web application..."
kubectl delete -f infra/kubernetes/web-deployment.yaml --ignore-not-found
kubectl delete -f infra/kubernetes/web-service.yaml --ignore-not-found

echo "Deleting API application..."
kubectl delete -f infra/kubernetes/api-deployment.yaml --ignore-not-found
kubectl delete -f infra/kubernetes/api-service.yaml --ignore-not-found

# Delete MongoDB secret
echo "Deleting MongoDB secret..."
kubectl delete -f infra/kubernetes/mongodb-secret.yaml --ignore-not-found

# Delete namespace (optional)
read -p "Do you want to delete the todo-app namespace as well? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Deleting namespace todo-app..."
    kubectl delete -f infra/kubernetes/namespace.yaml --ignore-not-found
fi

echo "Cleanup completed successfully!"
