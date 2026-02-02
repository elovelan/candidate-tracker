# candidate-tracker

A job application tracking tool with a React/TypeScript frontend. See [CLAUDE.md](./CLAUDE.md) for development principles and detailed instructions.

## Development Environment Setup

This project uses [mise](https://mise.jdx.dev/) to manage development tool versions. You have two options:

### Option 1: Local Development with mise (Recommended)

1. Install mise: https://mise.jdx.dev/getting-started.html
2. Run `mise install` in the project root to install all required tools (Bun, Go, Node)
3. Tools will be automatically activated when you cd into the project directory

### Option 2: Dev Container (Golden Path)

Open this project in VS Code with the Dev Containers extension, or use GitHub Codespaces. The container will automatically:
- Install mise and all development tools
- Run `bun install` in the frontend directory
- Configure VS Code with recommended extensions

**Git Worktree Support**: The dev container is configured to work with git worktrees, making it suitable for AI agent workflows that need isolated branches.

## Quick Start

```bash
cd frontend
bun install
bun run dev      # start development server
bun run test     # run tests
```