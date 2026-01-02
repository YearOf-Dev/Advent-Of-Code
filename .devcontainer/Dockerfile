FROM ubuntu:22.04

# Install basic utilities
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    git \
    vim \
    nano 

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs
RUN wget -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.bashrc" SHELL="$(which bash)" bash -

# Install Go
RUN wget https://go.dev/dl/go1.25.5.linux-amd64.tar.gz \
    && tar -C /usr/local -xzf go1.25.5.linux-amd64.tar.gz \
    && rm go1.25.5.linux-amd64.tar.gz
ENV GOROOT="/usr/local/go"
ENV PATH="/usr/local/go/bin:${PATH}"


# Install Rust
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"

# Install Python
RUN apt-get update && apt-get install -y python3 python3-pip

# Install tsx globally for running TypeScript
RUN npm install -g tsx

WORKDIR /workspace