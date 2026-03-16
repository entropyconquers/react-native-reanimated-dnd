# Development Guide

This repo uses npm workspaces. Install dependencies once at the repository root and run the library and example app from the same dependency graph.

## Workspace Setup

```bash
npm install
```

The example app consumes the local package via `file:..`, and the root `postinstall` builds the library output so Metro resolves a normal package instead of a generated mirror.

## Development Workflow

1. Install once from the repo root:

   ```bash
   npm install
   ```

2. Start the example app from the workspace:

   ```bash
   npm run start --workspace example-app
   ```

3. Make changes in the root library files.

4. Rebuild the library after source changes:

   ```bash
   npm run build:safe
   ```

   For an active development loop, run:

   ```bash
   npm run build:watch
   ```

5. Re-run validation as needed:

   ```bash
   npm run type-check
   npm run build
   npm run type-check:example
   npm run doctor:example
   ```

## Useful Commands

- `npm run build` - Build the library for production
- `npm run build:safe` - Build the library without minification
- `npm run build:watch` - Rebuild the library continuously while editing
- `npm run type-check` - Run library TypeScript checks
- `npm run type-check:example` - Run example-app TypeScript checks
- `npm run doctor:example` - Run Expo Doctor for the example app
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
