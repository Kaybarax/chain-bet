FROM node:18

# Install basic development tools
RUN apt-get update && apt-get install -y \
    git \
    curl \
    wget \
    zip \
    unzip \
    jq \
    vim \
    && rm -rf /var/lib/apt/lists/*

# Install Docker CLI
RUN curl -fsSL https://get.docker.com | sh

# Install kubectl
RUN curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl" \
    && chmod +x kubectl \
    && mv kubectl /usr/local/bin/

# Install Turbo
RUN npm install -g turbo

# Set up non-root user
ARG USERNAME=node
ARG USER_UID=1000
ARG USER_GID=$USER_UID

# Add user to docker group
RUN groupadd -g 800 docker \
    && usermod -aG docker $USERNAME

# Create workspace directory and set permissions
RUN mkdir -p /workspace \
    && chown $USERNAME:$USERNAME /workspace

WORKDIR /workspace

USER $USERNAME

# Set up shell
SHELL ["/bin/bash", "-c"]
