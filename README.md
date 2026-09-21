# Alpine.js Lab

[![Live Demo](https://img.shields.io/badge/Live%20Demo-alpine--lab.netlify.app-00ad9f?style=for-the-badge&logo=netlify&logoColor=white)](https://alpine-lab.netlify.app/)
[![GitHub Repository](https://img.shields.io/badge/GitHub-pverhaert%2Falpine--lab-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/pverhaert/alpine-lab)
[![React 19](https://img.shields.io/badge/React-19.0-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.1-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Alpine.js v3](https://img.shields.io/badge/Alpine.js-v3.x-77c1d2?style=for-the-badge&logo=alpinedotjs&logoColor=white)](https://alpinejs.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646cff?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Biome](https://img.shields.io/badge/Biome-Linter%20%26%20Formatter-60a5fa?style=for-the-badge&logo=biome&logoColor=white)](https://biomejs.dev/)
[![PWA Ready](https://img.shields.io/badge/PWA-Installable-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)

> **Alpine.js Lab** is a modern, zero-config, in-browser live coding playground and learning environment designed for experimenting with [Alpine.js](https://alpinejs.dev/) and [Tailwind CSS v4](https://tailwindcss.com/). Developed for educational excellence (Thomas More Applied Informatics / Tech Lab), it provides an instant VS Code-like coding experience with pre-bundled Alpine plugins, interactive lessons, responsive device testing, and offline PWA support.

---

## Quick Links

- Live Application: [https://alpine-lab.netlify.app/](https://alpine-lab.netlify.app/)
- Source Code: [https://github.com/pverhaert/alpine-lab](https://github.com/pverhaert/alpine-lab)
- Issue Tracker: [https://github.com/pverhaert/alpine-lab/issues](https://github.com/pverhaert/alpine-lab/issues)

---

## Features

### VS Code-Grade Monaco Editor

- Alpine.js Directives Autocompletion: IntelliSense suggestions and built-in documentation for all core directives (`x-data`, `x-bind`, `x-on`, `x-model`, `x-show`, `x-for`, `x-transition`, `x-effect`, `x-ref`, `x-cloak`, `x-teleport`, `x-id`, etc.).
- Tailwind CSS v4 IntelliSense & Variants: Comprehensive utility autocompletion with intelligent variant prefix support (`dark:`, `hover:`, `focus:`, `sm:`, `md:`, `lg:`, etc.) and full color palette coverage.
- Alpine.js Snippets Drawer: Curated library of 25 production-ready components (buttons, modals, drawers, tabs, accordions, dark mode switchers, form validations, toast notifications, search filters, plugin integrations, and full boilerplates) searchable with category filter pills, custom styled scrollbars, and 1-click insertion into the cursor location (shortcut: Ctrl+E).
- Emmet Expansion: Instant HTML and Tailwind abbreviation expansion via the `Tab` key (e.g., `div.flex.items-center>button.btn*2` + `Tab`, or snippet aliases like `xbtn` + `Tab`).
- Curated Editor Themes: Switch between **TM Navy** (custom branded dark theme), **VS Dark**, and **VS Light**.
- Code Formatting & Controls: Automatic formatting, projector-friendly bold font toggle (enabled by default), adjustable font sizes, minimap toggle, and line numbers.

### Instant Sandboxed Preview & Tailwind CSS v4

- Real-Time Tailwind CSS v4: Uses `@tailwindcss/browser@4` to compile arbitrary utilities and custom styles in real time.
- Class-Based Dark Mode Preview: Fully supports Tailwind CSS v4 dark mode styling (`dark:bg-*`, `dark:text-*`, `dark:border-*`) via `@custom-variant dark` synchronized with preview canvas theme toggling.
- Pre-Loaded Official Alpine Plugins:
  - `@alpinejs/collapse` (smooth height transitions)
  - `@alpinejs/persist` (seamless `localStorage` binding via `$persist`)
  - `@alpinejs/focus` (accessible keyboard focus trapping)
  - `@alpinejs/intersect` (viewport visibility detection)
  - `@alpinejs/mask` (input masking for phone numbers, dates, currency)
- Safety Interceptors: Intercepts link clicks and form submissions inside the preview sandbox to prevent navigation away from the active session.

### Multi-Device Responsive Testing

- Viewport Switcher: Switch between **Desktop (Full)**, **Tablet (768px)**, and **Mobile (375px)** device frames.
- Zoom & Theme Controls: Zoom canvas from 50% to 150% and toggle light/dark canvas backdrop to test light and dark component designs.

### Integrated Console Panel

- View `console.log`, `console.info`, `console.warn`, `console.error`, and unhandled promise rejections directly below the preview.
- Filter messages by log level, inspect formatted objects, and clear output with one click.

### Structured Lessons & Snippet Library

- Pre-built Curriculum: 28 step-by-step interactive lessons ranked systematically from Basic to Expert:
  - Fundamentals (Beginner, Lessons 01 to 08):
    - 01. State & Events (`x-data`, `x-on`, `x-text`)
    - 02. Two-Way Form Binding (`x-model`)
    - 03. Conditionals & Cloak (`x-show`, `x-if`, `x-cloak`)
    - 04. Lists & Dynamic Arrays (`x-for`)
    - 05. Dynamic Attributes & Classes (`:class`, `:disabled`, `:style`)
    - 06. Event Modifiers (`.prevent`, `.stop`, `.window`, `.debounce`)
    - 07. HTML Content & Safe Rendering (`x-html` vs `x-text`)
    - 08. Element References & DOM Access (`$refs`, `$el`)
  - Components (Intermediate, Lessons 09 to 16):
    - 09. Transitions & Animations (`x-transition`)
    - 10. Interactive Dropdown Menu (`@click.outside`)
    - 11. Tabbed Navigation & Panels
    - 12. Accordions & Collapsible FAQ (`x-collapse`)
    - 13. Component Communication (`$dispatch`, Custom Events)
    - 14. Form Validation & Instant Feedback
    - 15. Search Filter & Multi-Column Sorting
    - 16. Toast Notifications System
  - Advanced (Advanced, Lessons 17 to 23):
    - 17. State Watchers & Side Effects (`$watch`)
    - 18. Component Lifecycle (`x-init`, `$nextTick`)
    - 19. Global State & Stores (`Alpine.store`)
    - 20. Persistent State with LocalStorage (`$persist`)
    - 21. Infinite Scroll & Viewport Visibility (`x-intersect`)
    - 22. Input Masking (`x-mask`)
    - 23. Accessible Focus Management (`@alpinejs/focus`)
  - Projects (Expert, Lessons 24 to 28):
    - 24. Project: Interactive Quiz App
    - 25. Project: Kanban Task Board
    - 26. Project: E-Commerce Catalog & Checkout
    - 27. Project: Weather & City Dashboard (Mock API)
    - 28. Project: Markdown Notes App with Tags & Search
- Personal Snippet Manager: Save custom snippets to browser `localStorage`, export/import your snippets as JSON, or clone existing lessons.

### Interactive Alpine.js Cheat Sheet

- Searchable reference modal detailing directives, magic properties, modifiers, and plugins with runnable example snippets ready to insert into the editor with one click.

### Export & Sharing

- Download Standalone HTML: Generates an all-in-one, production-ready `.html` file with all CDN scripts (Tailwind v4, Alpine Core + Plugins, Google Fonts) bundled. Open it directly in any web browser without build tools.
- URL Hash Sharing: Share interactive code states with teammates or students using deep-linked URL parameters (`#code=...`).
- One-Click Clipboard Copy: Instant export of clean component code.

### Offline-Ready Progressive Web App (PWA)

- Installable on macOS, Windows, Linux, Android, and iOS/iPadOS.
- Service Worker caching via `vite-plugin-pwa` and Workbox for offline playground access.
- Visual online/offline network indicator.

---

## Tech Stack

| Category | Technology | Description |
| --- | --- | --- |
| Core Framework | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) | UI components and application state architecture |
| Bundler & Dev Server | [Vite 6](https://vite.dev/) | Fast HMR and optimized production builds |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) | Next-generation utility-first styling with `@tailwindcss/vite` |
| Live Editor | [Monaco Editor](https://microsoft.github.io/monaco-editor/) | VS Code editor core with `@monaco-editor/react`, `emmet-monaco-es`, `emmet` |
| Injected Playground Engine | [Alpine.js v3](https://alpinejs.dev/) + Official Plugins | Sandboxed runtime with Collapse, Persist, Focus, Intersect, Mask |
| Injected CSS Engine | `@tailwindcss/browser` v4 | Real-time in-browser JIT compilation for user markup |
| Linter & Formatter | [Biome](https://biomejs.dev/) | Fast linter, code formatter, and import organizer |
| Dead Code Analysis | [Knip](https://knip.dev/) | Project-wide unused file, export, and dependency detection |
| Icons | [Lucide React](https://lucide.dev/) | Consistent interface iconography |
| PWA & Offline | `vite-plugin-pwa` & [Workbox](https://developer.chrome.com/docs/workbox) | Offline caching and installation manifests |
| Deployment | [Netlify](https://www.netlify.com/) | Automated continuous deployment with SPA rewrites |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18.x or higher recommended)
- [npm](https://www.npmjs.com/) (bundled with Node.js) or `pnpm` / `yarn`

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/pverhaert/alpine-lab.git
   cd alpine-lab
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:6987` (or the port indicated in your terminal).

---

## Available Scripts

In the project root, you can run:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Runs the development server with Hot Module Replacement (HMR) |
| `npm run build` | Compiles TypeScript and builds production bundles into `dist/` |
| `npm run preview` | Locally serves the production build for validation |
| `npm run lint` | Runs Biome code checks, formatting validation, and lint rules |
| `npm run lint:fix` | Runs Biome with automatic safe code fixes |
| `npm run format` | Automatically formats codebase files using Biome |
| `npm run check:unused` | Runs Knip to identify unused files, exports, and dependencies |
| `npm run typecheck` | Runs TypeScript type checking (`tsc --noEmit`) |
| `npm run clean` | Cleans build output directories |

---

## Project Structure

```text
alpine-lab/
├── AGENTS.md                   # Instructions and guidelines for AI agents and code generation
├── biome.json                  # Biome linter, formatter, and import rules configuration
├── knip.json                   # Knip dead code and unused dependency configuration
├── public/                     # Static assets (PWA icons, favicon, manifest)
│   ├── icon.svg
│   ├── pwa-192x192.png
│   └── pwa-512x512.png
├── src/
│   ├── components/             # React UI components
│   │   ├── AlpineCheatsheetModal.tsx  # Interactive directives & magics documentation
│   │   ├── EditorPane.tsx             # Monaco editor pane with controls & Emmet
│   │   ├── Header.tsx                 # Branding, quick snippet picker, toolbar
│   │   ├── OfflineIndicator.tsx       # Live online/offline network indicator
│   │   ├── PreviewPane.tsx            # Sandboxed preview iframe & console panel
│   │   ├── PWAInstallButton.tsx       # Progressive web app install trigger
│   │   ├── ResizableSplitter.tsx      # Draggable split pane divider
│   │   ├── SaveSnippetModal.tsx       # Save custom snippet dialog
│   │   ├── SnippetManagerModal.tsx    # Manage, filter, import/export snippets
│   │   ├── Toast.tsx                  # Action feedback toasts
│   │   └── Tooltip.tsx                # Accessible action hints
│   ├── data/
│   │   └── defaultSnippets.ts         # Comprehensive lessons & starter templates
│   ├── hooks/
│   │   ├── useOnlineStatus.ts         # Browser network status listener
│   │   └── usePWAInstall.ts           # PWA install prompt handler
│   ├── utils/
│   │   ├── emmetHelper.ts             # Emmet expansion helper for Monaco
│   │   ├── monacoAlpineSetup.ts       # Alpine.js syntax & autocompletion rules
│   │   └── previewBuilder.ts          # Sandbox HTML compiler & console interceptor
│   ├── App.tsx                        # Main application layout & state
│   ├── index.css                      # Tailwind CSS v4 base stylesheet
│   ├── main.tsx                       # React application entrypoint
│   └── types.ts                       # TypeScript interfaces and data models
├── index.html                  # HTML entry point with meta tags & typography
├── netlify.toml                # Netlify deployment configuration & routing
├── package.json                # Project dependencies and npm scripts
├── tsconfig.json               # TypeScript compiler configuration
└── vite.config.ts              # Vite & VitePWA configuration
```

---

## Deployment

The project is configured for automated continuous deployment on [Netlify](https://www.netlify.com/):

- Build Command: `npm run build`
- Publish Directory: `dist`
- SPA Routing: Configured in `netlify.toml` with redirect fallback `/* -> /index.html 200`

Live production builds are published at: [https://alpine-lab.netlify.app/](https://alpine-lab.netlify.app/)

---

## Contributing

Contributions, feedback, and new lesson snippet ideas are welcome!

1. Fork the repository ([https://github.com/pverhaert/alpine-lab](https://github.com/pverhaert/alpine-lab))
2. Create a new branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## License

This project is created for educational and community learning purposes. Feel free to use it for teaching, learning, or prototyping with Alpine.js and Tailwind CSS.
