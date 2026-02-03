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

# Activate mise in shell configs for persistent access
if [ -f "$HOME/.bashrc" ] && ! grep -q 'mise activate' "$HOME/.bashrc"; then
  echo 'eval "$(~/.local/bin/mise activate bash)"' >> "$HOME/.bashrc"
  echo "Added mise activation to .bashrc"
fi

if [ -f "$HOME/.zshrc" ] && ! grep -q 'mise activate' "$HOME/.zshrc"; then
  echo 'eval "$(~/.local/bin/mise activate zsh)"' >> "$HOME/.zshrc"
  echo "Added mise activation to .zshrc"
fi

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frontend && mise exec -- bun install

echo "Development environment ready!"
