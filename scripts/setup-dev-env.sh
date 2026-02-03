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

# Ensure mise shims are in PATH for non-interactive shells
# Add to .profile which is sourced by login shells (both interactive and non-interactive)
if ! grep -q 'mise/shims' "$HOME/.profile" 2>/dev/null; then
  echo 'export PATH="$HOME/.local/share/mise/shims:$PATH"' >> "$HOME/.profile"
  echo "Added mise shims to .profile for non-interactive shell support"
fi

echo "Development environment ready!"
