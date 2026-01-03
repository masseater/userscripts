# AGENTS.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A collection of userscripts (Greasemonkey/Tampermonkey scripts) for browser automation and web enhancements.

## Architecture

Each userscript is a **standalone JavaScript file** following the UserScript metadata block format:
- Self-contained IIFE (Immediately Invoked Function Expression)
- No build process required - scripts are used directly
- Each script declares its own `@grant` permissions and `@match` patterns

### Userscript Pattern

```javascript
// ==UserScript==
// @name         Script Name
// @namespace    https://github.com/masseater/userscripts
// @version      X.Y.Z
// @description  What the script does
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// ...
// ==/UserScript==

(function () {
  'use strict';
  // Script implementation
})();
```

## Development Guidelines

### GM API Usage
- Use `GM_xmlhttpRequest` with `anonymous: false` for authenticated cross-origin requests (sends cookies)
- Use `GM_setValue`/`GM_getValue` for persistent configuration
- Use `GM_registerMenuCommand` for userscript manager menu integration
- Use `GM_openInTab` for opening new tabs from userscripts

### Code Style
- Vanilla JavaScript only (no transpilation)
- IIFE wrapper with `'use strict'`
- Clear section comments (e.g., `// ======== Section Name ========`)
- Config constants at the top of the script

### Cross-Origin Requests
When making authenticated API calls (like Scrapbox API):
```javascript
GM_xmlhttpRequest({
  method: 'GET',
  url: apiUrl,
  anonymous: false,  // Important: sends cookies for authentication
  onload: (response) => { /* handle response */ },
  onerror: (error) => { /* handle error */ },
});
```

### UI Components
- Use inline styles with `document.createElement`
- Use high z-index values (999999) for overlays
- Implement keyboard shortcuts carefully (avoid conflicts with sites)
- Clean up event listeners when removing UI elements

## Testing

Manual testing in browser:
1. Install script in Tampermonkey/Greasemonkey
2. Navigate to a matching URL
3. Use browser DevTools console for debugging

## Current Scripts

| Script | Purpose |
|--------|---------|
| `scrapbox-clip.user.js` | Save pages and selections to Scrapbox via API |
