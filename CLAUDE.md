# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Chrome extension that adds custom buttons to GitHub repository pages. It's built with TypeScript, Vite, and uses Chrome Extension Manifest V3. The extension seamlessly integrates with GitHub's UI and supports both light and dark themes.

## Development Commands

### Building
- `npm run build` - Production build (includes icon generation)
- `npm run dev` - Development mode with hot reload using nodemon
- `npm run preview` - Watch mode for development
- `npm run clean` - Remove dist directory
- `npm run generate-icons` - Generate PNG icons from SVG source

### Linting
- `npm run lint` - Run oxlint (silent mode)
- `npm run lint:strict` - Run oxlint with warnings treated as errors
- `npm run lint:fix` - Auto-fix linting issues
- `npm run check:file` - Check a specific file with oxlint

### Loading the Extension in Chrome
After building, load the `dist/` folder as an unpacked extension via `chrome://extensions/` with Developer Mode enabled.

## Architecture

### Core Components

**Content Script** (`src/content/index.ts`)
- Runs on all GitHub pages (`https://github.com/*`)
- Injects custom buttons into GitHub's page header navigation (`ul.pagehead-actions`)
- Uses MutationObserver to handle GitHub's SPA navigation
- Parses repository owner/name from URL path
- Prevents duplicate button injection with existence checks

**Background Script** (`src/background/index.ts`)
- Service worker that injects content scripts into existing GitHub tabs on extension load/update
- Handles dynamic injection for tabs that were open before extension installation

**Styles** (`src/content/index.css`)
- Button styles that match GitHub's native UI components
- Uses GitHub's BtnGroup and btn-sm classes for consistency

### Build System

**Vite Configuration** (`vite.config.ts`)
- Uses `@crxjs/vite-plugin` for Chrome extension bundling
- TypeScript path aliases configured via `vite-tsconfig-paths`
- Merges `manifest.json` with `manifest.dev.json` in development mode
- Custom plugin `stripDevIcons` removes dev-only icons from production builds
- Content scripts automatically inject CSS (configured in crx plugin)

**Development Workflow**
- Nodemon watches `src/`, `vite.config.ts`, and manifest files
- Auto-rebuilds on file changes in development mode
- Development builds include sourcemaps and skip minification

### Icon Generation
- `generate-icons.js` converts `public/icons/icon.svg` to PNG files at multiple sizes (16, 32, 48, 128px)
- Uses `@resvg/resvg-js` for SVG to PNG conversion
- Runs automatically before each build

### TypeScript Configuration
- Path aliases: `@/*`, `@content/*`, `@background/*` map to `src/` subdirectories
- Strict mode enabled with unused variable checks
- Includes `chrome` types for extension API

### Linting
- Uses oxlint (fast Rust-based linter)
- TypeScript strict rules enforced
- Console statements allowed (common in extensions)
- Float promises treated as errors
- Ignores: node_modules, dist, public, generate-icons.js

## Key Implementation Details

### Button Injection Logic
The extension uses a defensive approach to button injection:
1. Checks if button already exists to prevent duplicates
2. Waits for navigation element (`ul.pagehead-actions`) to be available
3. Parses repository info from URL pathname
4. Creates button with GitHub's native classes for seamless integration
5. Uses `chrome.runtime.getURL()` to load extension icon

### SPA Navigation Handling
GitHub is a single-page application, so the extension:
- Runs `addCustomButton()` immediately and on DOMContentLoaded
- Uses MutationObserver to detect URL changes and DOM mutations
- Implements debouncing with `isProcessing` flag to prevent race conditions
- Re-injects button after 500ms delay when URL changes

### Customizing the Button
To modify button behavior, edit `src/content/index.ts`:
- Line 37: Change `button.href` to customize destination URL
- Line 50: Change button text
- Line 46: Change button icon

The extension currently links to `https://example.com/${owner}/${repo}` - this should be customized for actual use.

## Manifest V3 Features
- Service worker background script (not persistent)
- `scripting` permission for dynamic content script injection
- `host_permissions` for GitHub domains
- `web_accessible_resources` for extension icons
- Minimum Chrome version: 88.0
