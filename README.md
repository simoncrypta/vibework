# Vibework + Astryx Design

A starter for going from **Figma design → real prototype** fast, with a full **Astryx design system catalog in Storybook**.

Drop in a design, describe what you want, and iterate with an AI coding agent. Vibework is intentionally opinionated so you spend time on the product, not on wiring up tooling. The bundled Storybook mirrors [Astryx](https://astryx.atmeta.com/components) — Foundations, Components, and Patterns — themed with this project's `neutralTheme`.

This repo is a **[GitHub public template](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template)**. On GitHub, **Use this template** → **Create a new repository** copies everything here into a **new repo** of yours (not a fork). Clone that new repo to work locally.

---

## System requirements

- **Node.js** — LTS recommended (see [Vite+ docs](https://viteplus.dev/guide/))
- **pnpm** — installed automatically via `vp install` when using Vite+
- **[Vite+](https://viteplus.dev/guide/) (`vp`)** — unified CLI for install, dev, build, check, and tests

Install `vp` once on your machine:

**macOS / Linux**

```bash
curl -fsSL https://vite.plus | bash
```

**Windows** (PowerShell)

```powershell
irm https://vite.plus/ps1 | iex
```

---

## Quick start

1. On GitHub: **Use this template** → **Create a new repository** (GitHub copies this project into your new repo).
2. Locally:

```bash
git clone <your-new-repo-url>
cd <your-project>
vp install

# Run the app (RedwoodSDK on Cloudflare Workers)
vp dev

# Run the design system catalog (separate terminal)
vp run storybook
```

| What      | URL                                   |
| --------- | ------------------------------------- |
| App       | Vite dev server (see terminal output) |
| Storybook | http://localhost:6006                 |

When you're ready to deploy the app:

```bash
vp run release
```

If setup or packages look wrong, run `vp env doctor` and share the output.

---

## What it's for

- Turning Figma (or any design) into a clickable, deployable prototype quickly
- Browsing and validating Astryx components, tokens, and page patterns in Storybook
- Experimenting with UI and flows without fighting config
- Pairing with an AI agent that already knows the stack (see [`AGENTS.md`](./AGENTS.md))

It is **not** a production app framework with every feature pre-built. It is a clean runway: React, Astryx design system, edge deploy, one CLI, and a Storybook catalog.

---

## Stack

Everything is documented for agents in [`AGENTS.md`](./AGENTS.md). In short:

### Vite+ (`vp`)

[Vite+](https://viteplus.dev/guide/) is the unified toolchain. One global CLI (`vp`) covers install, dev, build, format, lint, typecheck, and tests.

| Command         | What it does                                      |
| --------------- | ------------------------------------------------- |
| `vp install`    | Install dependencies                              |
| `vp dev`        | Start the app dev server                          |
| `vp build`      | Production build                                  |
| `vp check`      | Format, lint, and typecheck                       |
| `vp test`       | Run tests                                         |
| `vp env doctor` | Diagnose setup / runtime / package-manager issues |

### RedwoodSDK

[RedwoodSDK](https://docs.rwsdk.com/) — React Server Components on [Cloudflare Workers](https://developers.cloudflare.com/workers).

| Path             | Role               |
| ---------------- | ------------------ |
| `src/worker.tsx` | Worker entry       |
| `src/client.tsx` | Client hydration   |
| `src/app/`       | Pages and document |

Deploy with `vp run release` (builds with Vite+ and deploys via Wrangler).

### Astryx + Tailwind

UI comes from [Astryx](https://github.com/facebook/astryx) with Tailwind for layout and overrides — adapted for RedwoodSDK RSC.

- Docs: [astryx.atmeta.com](https://astryx.atmeta.com/components) · [GitHub](https://github.com/facebook/astryx)
- Global styles: `src/app/styles.css`
- Theme provider: `src/app/providers.tsx` (`neutralTheme` from `@astryxdesign/theme-neutral`)
- Pages stay Server Components; interactive bits live in small `"use client"` islands

**Styling habit:** Astryx components for UI; Tailwind utilities for layout and `className` overrides. Prefer token-backed classes (`bg-surface`, `text-primary`, `rounded-lg`, …) over raw hex/px.

Discover components instead of guessing:

```bash
vp run astryx -- build "<idea>"      # kit: page + blocks + components
vp run astryx -- component <Name>    # props + examples
vp run astryx -- search "<query>"    # find anything in the system
```

### Storybook

[Storybook](https://storybook.js.org/docs) documents the full Astryx catalog for this project. It does **not** ship to the app — only for local design-system browsing and agent reference.

| Command                          | What it does                                             |
| -------------------------------- | -------------------------------------------------------- |
| `vp run storybook`               | Dev server at http://localhost:6006                      |
| `vp run storybook-build`         | Static build → `storybook-static/`                       |
| `vp run generate:astryx-stories` | Regenerate component/pattern stories from the Astryx CLI |

**Sidebar**

```
Astryx
├── Introduction
├── Foundations     # color, typography, spacing, shape, …
├── Components      # 148 Astryx components (showcase + variants)
└── Patterns        # page templates (dashboard, login, tables, …)
Vibework
└── Components      # app-specific prototype stories
```

Stories live under `src/storybook/astryx/`. Generated files import official Astryx block and page templates from `@astryxdesign/cli`. After upgrading `@astryxdesign/core` or `@astryxdesign/cli`, run `vp run generate:astryx-stories` and commit the diff.

Storybook config: [`.storybook/`](./.storybook/) (isolated Vite config, Astryx theme via `Providers` + `styles.css`).

---

## Project layout

```
src/
  worker.tsx              # Cloudflare Worker entry
  client.tsx              # Client hydration
  app/
    pages/                # Routes / screens — start here
    components/           # App UI + Vibework Storybook stories
    document.tsx          # HTML document shell
    providers.tsx         # Theme (Astryx)
    styles.css            # Astryx + Tailwind + tokens
  storybook/astryx/       # Design system catalog (Storybook only)
    foundations/          # Hand-authored token & layout docs
    generated/            # Generated component + pattern stories
    shared/               # BlockStory, TokenGrid, DocsPage helpers
scripts/
  generate-astryx-stories.mjs
.storybook/               # Storybook config
```

Agents should read [`AGENTS.md`](./AGENTS.md) for conventions, review checklist, and Astryx workflow details.

---

## Cursor agent setup

This repo is tuned for [Cursor](https://cursor.com) Agent mode (Figma → code).

| Piece           | Path                                                                         | Role                                                           |
| --------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------- |
| Always-on rules | [`.cursor/rules/`](./.cursor/rules/)                                         | Mission, Vite+, and (when editing UI) RSC + Astryx conventions |
| Project skill   | [`.cursor/skills/figma-to-prototype/`](./.cursor/skills/figma-to-prototype/) | Step-by-step Figma MCP → Astryx → pages                        |
| Figma MCP       | [`.cursor/mcp.json`](./.cursor/mcp.json)                                     | Design context tools in this workspace                         |
| Agent notes     | [`AGENTS.md`](./AGENTS.md)                                                   | Full stack reference for agents                                |

**One-time on each machine:** install the Figma Cursor plugin:

```
/add-plugin figma
```

Then open Agent chat, paste a Figma URL, and ask to implement the screen. Use Storybook to validate component choices against the Astryx catalog.

---

## Use this template

This repository is a **GitHub template repository**. **Use this template** does not fork this repo — GitHub creates a **new repository** with a full copy of the files and history you need to start fresh.

1. On GitHub: **Use this template** → **Create a new repository** (pick name, visibility, etc.).
2. Clone **your** new repository (not this template repo):

   ```bash
   git clone <your-new-repo-url>
   cd <your-project>
   vp install
   vp dev
   vp run storybook   # optional: browse the Astryx catalog
   ```

3. Rename the project in `package.json` if you like.
4. Build from Figma in `src/app/pages/`.
5. Deploy with `vp run release` when you're ready to share.

**Alternatives:** fork this repo, or clone it and repoint `git remote` — but **Use this template** is the intended path for new prototypes.

Happy vibing.
