# Agent Guidelines: Alpine.js Lab

This file contains guidelines, project architecture, and rules for AI agents and code generators working in this repository.

## Non-Negotiable Rules

1. No Emojis:
   - Never use emojis anywhere in generated files, markdown documentation, code comments, UI labels, or commit messages.

2. No Em-dashes and No En-dashes:
   - Never use em-dashes or en-dashes.
   - Use standard ASCII hyphens (-), colons (:), or parentheses instead.

3. Mandatory README Updates:
   - Whenever any file is added, modified, or removed, always review and update README.md to reflect the changes.
   - Keep features, project tree, dependencies, and script documentation completely synchronized with active code.

## Project Overview

- Project Name: Alpine.js Lab
- Description: Interactive live coding playground and learning environment for Alpine.js and Tailwind CSS v4.
- Target Audience: Students and web developers learning modern reactive frontend fundamentals.
- Live Deployment: https://alpine-lab.netlify.app/
- GitHub Repository: https://github.com/pverhaert/alpine-lab

## Technology Stack

- Runtime & Framework: React 19, TypeScript
- Build Tool: Vite 6 with @vitejs/plugin-react
- Styling: Tailwind CSS v4 with @tailwindcss/vite and @tailwindcss/browser
- Code Editor: Monaco Editor (@monaco-editor/react) with Emmet (emmet-monaco-es, emmet)
- Linter & Formatter: Biome (@biomejs/biome)
- Dead-Code & Dependency Analyzer: Knip (knip)
- Icons: Lucide React
- PWA & Offline: vite-plugin-pwa, Workbox
- Hosting & Infrastructure: Netlify with SPA rewrites (netlify.toml)

## Directory Structure and Architecture

- biome.json: Biome configuration for formatting, lint rules, and import organization.
- knip.json: Knip configuration for dead code, unused exports, and unlisted dependencies detection.
- public/: Static assets including PWA icons (192x192, 512x512, maskable), favicon, and SVG icons.
- src/components/: Modular React UI components:
  - Header.tsx: Navigation bar, branding, active snippet picker, export HTML, copy code, modal triggers.
  - EditorPane.tsx: Monaco editor integration, theme toggle (tm-navy, vs-dark, vs-light), zoom controls (Ctrl+Scrollwheel, Ctrl+Plus/Minus on standard and numeric keyboards, reset), Emmet support, format button, font size adjustments.
  - PreviewPane.tsx: Sandboxed iframe preview, responsive device toggles (desktop, tablet, mobile), canvas zoom, dark/light canvas mode, embedded console viewer.
  - AlpineCheatsheetModal.tsx: Directives and magic properties reference modal with 1-click code insertion.
  - SnippetManagerModal.tsx: Lesson and custom snippet manager with category filter, search, clone, delete, and JSON export/import.
  - SaveSnippetModal.tsx: Modal dialog for saving or updating custom user snippets to localStorage.
  - ResizableSplitter.tsx: Draggable divider supporting horizontal and vertical split orientations.
  - PWAInstallButton.tsx: Install prompt trigger for desktop and mobile PWA installation.
  - OfflineIndicator.tsx: Visual indicator displaying online or offline network status.
  - Toast.tsx: User notification feedback toast component.
  - Tooltip.tsx: Accessible hover tooltip component.
- src/utils/:
  - previewBuilder.ts: Generates sandboxed iframe HTML document, injects Alpine.js v3 core and official plugins (collapse, persist, focus, intersect, mask), injects Tailwind CSS v4 browser compiler, intercepts console messages and form/link navigation, exports standalone HTML.
  - monacoAlpineSetup.ts: Configures Monaco completion provider, hover provider, and syntax definitions for Alpine.js directives and magic properties.
  - emmetHelper.ts: Handles HTML and CSS class expansion in the Monaco editor.
- src/data/:
  - defaultSnippets.ts: Curated curriculum organized into Fundamentals, Components, Advanced, and Projects.
- src/hooks/:
  - useOnlineStatus.ts: Subscribes to browser online and offline events.
  - usePWAInstall.ts: Listens for beforeinstallprompt event to offer PWA installation.
- src/types.ts: TypeScript data contracts for snippets, devices, themes, split orientations, and console messages.
- src/App.tsx: Root application state, localStorage persistence, URL hash decoding (#code=...), layout sizing.

## Code Quality & Verification Scripts

Always verify quality before concluding tasks using the following scripts:
- npm run lint: Runs Biome check on all files.
- npm run lint:fix: Runs Biome with safe automated fixes.
- npm run format: Formats files using Biome.
- npm run check:unused: Runs Knip to identify dead code, unused exports, or phantom dependencies.
- npm run typecheck: Runs TypeScript type checking with tsc.
- npm run build: Runs Vite production build.

## Code Generation Conventions

1. Component Design:
   - Keep components focused, typed, and modular.
   - Use Lucide React icons for all visual indicators. Never use emoji characters.
   - Use Tailwind CSS utility classes adhering to the project palette:
     - Primary Navy: #00283c
     - Accent Coral: #fa6432
     - Border/Muted: #134661, #0b384f

2. Preview Sandbox Safety:
   - All user code runs inside a sandboxed iframe.
   - Never remove the console message interceptor or navigation click interceptor in previewBuilder.ts.
   - External links inside the preview must open in a new tab with noopener and noreferrer.

3. State & Persistence:
   - User snippets, theme preference, split ratio, and active snippet ID are stored in browser localStorage.
   - Maintain backwards compatibility with STORAGE_KEYS in src/App.tsx.

4. Package Management:
   - Do not add unnecessary dependencies.
   - If a dependency is added or removed, immediately update package.json, AGENTS.md, and README.md.
