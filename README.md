# candidate-tracker

A job application tracking tool with a React/TypeScript frontend. See [CLAUDE.md](./CLAUDE.md) for development principles and detailed instructions.

## Development Environment Setup

This project uses [mise](https://mise.jdx.dev/) to manage development tool versions. You have two options:

### Option 1: Local Development with mise

1. Install mise: https://mise.jdx.dev/getting-started.html
2. Run `mise install` in the project root to install all required tools (Bun, Go)
3. Tools will be automatically activated when you cd into the project directory

### Option 2: GitHub Codespaces / Dev Container (Recommended)

Open this project in GitHub Codespaces or VS Code with the Dev Containers extension. The environment will automatically:
- Install mise and all development tools
- Run `bun install` in the frontend directory
- Configure VS Code with recommended extensions

**For AI agent workflows**: Create one Codespace per branch/task. Each Codespace is an isolated environment, so you can run multiple agents in parallel without conflicts.

## Quick Start

```bash
cd frontend
bun install
bun run dev      # start development server
bun run test     # run tests
```