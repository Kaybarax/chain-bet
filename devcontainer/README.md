# Development Container

This directory contains configuration for the Visual Studio Code Remote - Containers extension, which allows you to develop inside a Docker container.

## Contents

- `devcontainer.json`: Configuration for VS Code Remote - Containers extension
- `Dockerfile`: Definition of the development container image

## Features

The development container includes:

- Node.js 18
- Git, curl, wget, and other development tools
- Docker CLI (for Docker-in-Docker operations)
- kubectl for Kubernetes management
- Turbo CLI for monorepo management

## Usage

To use the development container:

1. Install the [Remote - Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) for VS Code
2. Open the project in VS Code
3. Click on the green button in the bottom-left corner of VS Code
4. Select "Reopen in Container"

VS Code will build the container and open the project inside it. This may take a few minutes the first time.

## Extensions

The following VS Code extensions are automatically installed in the container:

- ESLint
- Prettier
- Docker
- Kubernetes
- MongoDB for VS Code

## Customization

You can customize the development container by:

1. Modifying the `Dockerfile` to install additional tools or packages
2. Updating `devcontainer.json` to change settings, add extensions, or modify port forwarding
