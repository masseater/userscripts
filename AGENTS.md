# AGENTS.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A collection of userscripts (Greasemonkey/Tampermonkey scripts) for browser automation and web enhancements, built with TypeScript and Vite.

## Build Commands

```bash
bun install       # Install dependencies (uses bun as package manager)
bun run build     # Build all extensions to dist/
bun run dev       # Start dev server with HMR for all extensions
```

Per-extension (from extension directory):
```bash
bun run build     # Build single extension
bun run dev       # Dev server for single extension
```

## Architecture

**Monorepo Structure:**
- `extensions/` - TypeScript userscript source packages (each is a workspace)
- `dist/` - Built `.user.js` files (output from all extensions)
- Root uses Turborepo to orchestrate builds across workspaces

**Extension Structure:**
Each extension in `extensions/{name}/` is a self-contained Vite project:
- `src/main.ts` - Entry point
- `vite.config.ts` - UserScript metadata via `vite-plugin-monkey`
- Builds output to `../../dist/{name}.user.js`

**Key Technology:**
- `vite-plugin-monkey` - Transforms TypeScript into UserScript format with proper metadata blocks
- GM APIs imported from `vite-plugin-monkey/dist/client` for type safety

## Development Guidelines

### GM API Imports
```typescript
import { GM_getValue, GM_setValue, GM_xmlhttpRequest } from 'vite-plugin-monkey/dist/client';
```

### Cross-Origin Requests
- Use `GM_xmlhttpRequest` with `anonymous: false` for authenticated requests (sends cookies)
- Native `fetch` is blocked by page CSP for cross-origin - always use `GM_xmlhttpRequest`
- **Never** set `Content-Type` header manually when using FormData (breaks boundary)
- Add target domains to `connect` array in vite config

### Vite Config Pattern
UserScript metadata goes in `vite.config.ts`:
```typescript
monkey({
  entry: 'src/main.ts',
  userscript: {
    name: 'Script Name',
    match: ['*://*/*'],
    connect: ['api.example.com'],  // Required for GM_xmlhttpRequest
  },
  build: { fileName: `${dirName}.user.js` },
}),
```

### Code Style
- TypeScript with strict typing
- Section comments with `// ======== Section Name ========`
- Config constants at top of file

### UI Components
- Use inline styles with `document.createElement`
- Use high z-index values (999999) for overlays
- Clean up event listeners when removing UI elements

## Testing

1. Run `bun run build` to generate `.user.js` in `dist/`
2. Install built script in Tampermonkey/Greasemonkey
3. Use browser DevTools console for debugging

## Current Scripts

| Script | Purpose |
|--------|---------|
| `scrapbox-clip` | Save pages and selections to Scrapbox via API |
