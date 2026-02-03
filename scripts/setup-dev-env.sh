#!/bin/bash
set -e
set -x

# Install mise if not already available
if ! command -v mise &> /dev/null; then
  echo "Installing mise..."
  curl -fsSL https://github.com/jdx/mise/releases/latest/download/install.sh | sh
  export PATH="$HOME/.local/bin:$PATH"
fi

# Trust the .mise.toml config file
mise trust

# Install tools defined in .mise.toml
echo "Installing development tools via mise..."
mise install

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frontend && mise exec -- bun install

echo "Development environment ready!"
