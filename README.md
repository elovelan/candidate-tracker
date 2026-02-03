# candidate-tracker

A job application tracking tool with a React/TypeScript frontend. See [CLAUDE.md](./CLAUDE.md) for development principles and detailed instructions.

## Development Environment Setup

This project uses [mise](https://mise.jdx.dev/) to manage development tool versions.

### Automated Setup (Recommended for First Time)

Run the setup script to automatically install mise and all development tools:

```bash
./scripts/setup-dev-env.sh
```

This script installs mise, all required tools (Bun, Go, GitHub CLI), and frontend dependencies.

### Option 1: Local Development with mise

1. Install mise: https://mise.jdx.dev/getting-started.html
2. Run `mise install` in the project root to install all required tools
3. Tools will be automatically activated when you cd into the project directory

### Option 2: GitHub Codespaces / Dev Container (Recommended)

Open this project in GitHub Codespaces or VS Code with the Dev Containers extension. The environment will automatically:
- Install mise and all development tools
- Run `bun install` in the frontend directory
- Configure VS Code with recommended extensions

**For AI agent workflows**: Create one Codespace per branch/task. Each Codespace is an isolated environment, so you can run multiple agents in parallel without conflicts.

### Option 3: Claude Web

Claude Web uses its own devcontainer but will automatically run `scripts/setup-dev-env.sh` via the SessionStart hook when a session begins. The script uses GitHub releases for mise installation to work with Claude Web's limited internet access.

## Quick Start

```bash
cd frontend
bun install
bun run dev      # start development server
bun run test     # run tests
```