#!/bin/bash
set -e

# Install mise if not already available
if ! command -v mise &> /dev/null; then
  echo "Installing mise..."
  curl -fsSL https://github.com/jdx/mise/releases/latest/download/install.sh | sh
  export PATH="$HOME/.local/bin:$PATH"
fi

# Install tools defined in .mise.toml
echo "Installing development tools via mise..."
mise install

# Activate mise for the session
eval "$(mise activate bash)"

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frontend && mise exec -- bun install

echo "Development environment ready!"
