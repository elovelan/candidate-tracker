# Candidate Tracker

A job application tracking tool with a React/TypeScript frontend and a minimal Go backend backed by GCP Spanner.

## Project Structure

```
frontend/    - React + TypeScript SPA
backend/     - Go REST API (minimal, just a thin layer over Spanner)
```

## Principles

### Readability Above All

- Write self-documenting code. Use descriptive variable, function, and type names instead of comments.
- If you feel the need to write a comment, first try renaming things or restructuring the code to make it obvious.
- Comments are acceptable for "why", never for "what".
- Avoid cleverness. Straightforward code that anyone can follow on first read is better than elegant code that requires thought to understand.

### Simplicity

- Use the most common, well-known features of the language and libraries. Avoid obscure features, advanced type gymnastics, or framework-specific magic.
- Prefer explicit over implicit. If a reader would need to look something up to understand the code, use a simpler approach.
- Flat is better than nested. Avoid deeply nested callbacks, ternaries, or control flow.
- Small functions with a single clear purpose. If a function needs a comment to explain what it does, it should be renamed or split.
- Avoid premature abstraction. Repeat yourself 2-3 times before extracting a shared function.

### Test-Driven Development

- TDD is the default workflow. Write a failing test first, then write the minimum code to make it pass, then refactor.
- Every new function, endpoint, or component gets tests before implementation.
- Tests should be readable and serve as documentation for how the code behaves.
- Use descriptive test names that state the expected behavior (e.g. "displays error message when API returns 500").
- Keep tests focused: one behavior per test.

## Frontend (React + TypeScript)

### Testing
- Use Vitest as the test runner.
- Use React Testing Library for component tests. Test behavior, not implementation.
- Place test files next to the source files they test: `Component.tsx` and `Component.test.tsx` in the same directory.

### Style
- Use plain TypeScript types and interfaces. Avoid complex generics or utility types unless genuinely necessary.
- Use standard React patterns: `useState`, `useEffect`, `useContext`. Avoid `useReducer`, `useMemo`, `useCallback` unless there is a measured performance problem.
- Prefer named exports over default exports.
- One component per file.

## Backend (Go)

### Testing
- Use the standard `testing` package. Avoid third-party test frameworks.
- Use table-driven tests where they improve clarity.
- Place test files next to source files: `handler.go` and `handler_test.go` in the same package.

### Style
- Keep the backend minimal. It is a thin REST API that translates HTTP requests to Spanner queries and returns JSON.
- Use the standard library (`net/http`, `encoding/json`) wherever possible. Avoid heavy frameworks.
- Use simple, flat package structure. Avoid deeply nested packages.
- Error handling should be explicit and straightforward. Return errors up the call stack; handle them at the boundary.

## Running the Project

### Frontend
```
cd frontend
npm install
npm run dev      # development server
npm test         # run tests
```

### Backend
```
cd backend
go test ./...    # run tests
go run .         # start server
```

### Spanner Emulator (local development)
Use the Spanner emulator to avoid GCP costs during development. Setup instructions TBD once infrastructure is configured.
