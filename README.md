# Vibework

A **design-system agnostic** starter for going from **Figma design → real prototype** fast.

Drop in a design, describe what you want, and iterate with an AI coding agent. Vibework is intentionally opinionated about the stack (RedwoodSDK, Vite+, edge deploy) so you spend time on the product, not on wiring up tooling. Bring your own UI library — Tailwind is included for layout.

This repo is a **[GitHub public template](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template)**. On GitHub, **Use this template** → **Create a new repository** copies everything here into a **new repo** of yours (not a fork). Clone that new repo to work locally.

## Design-system variants

| Template                                                              | What you get                                      |
| --------------------------------------------------------------------- | ------------------------------------------------- |
| **vibework** (this repo)                                              | Core stack + Tailwind — bring your own components |
| **[vibework-astryx](https://github.com/simoncrypta/vibework-astryx)** | Astryx design system + full Storybook catalog     |

Future: variant repos will sync generic files listed in [`CORE_MANIFEST.json`](./CORE_MANIFEST.json) from tagged vibework releases.

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

1. On GitHub: **Use this template** → **Create a new repository**.
2. Locally:

```bash
git clone <your-new-repo-url>
cd <your-project>
vp install

# Run the app (RedwoodSDK on Cloudflare Workers)
vp dev

# Browse component stories (separate terminal)
vp run storybook
```

| What      | URL                                   |
| --------- | ------------------------------------- |
| App       | Vite dev server (see terminal output) |
| Storybook | http://localhost:6006                 |

When you're ready to deploy:

```bash
vp run release
```

If setup or packages look wrong, run `vp env doctor` and share the output.

---

## What it's for

- Turning Figma (or any design) into a clickable, deployable prototype quickly
- Experimenting with UI and flows without fighting config
- Pairing with an AI agent that already knows the stack (see [`AGENTS.md`](./AGENTS.md))

It is **not** a production app framework with every feature pre-built. It is a clean runway: React, Tailwind layout, edge deploy, one CLI, and Storybook + Vitest for app components.

---

## Stack

Everything is documented for agents in [`AGENTS.md`](./AGENTS.md). In short:

### Vite+ (`vp`)

Unified toolchain — `vp install`, `vp dev`, `vp build`, `vp check`, `vp test`. See [viteplus.dev](https://viteplus.dev/guide/).

### RedwoodSDK

React Server Components on Cloudflare Workers. Pages in `src/app/pages/`, worker in `src/worker.tsx`. [docs.rwsdk.com](https://docs.rwsdk.com/)

### Tailwind

Layout and page chrome via utility classes. Add your design system in `src/app/providers.tsx` when ready.

### Storybook + Vitest

Hand-authored component stories under `src/app/components/` with browser play tests via `vp test`. Storybook MCP at `http://localhost:6006/mcp` when `vp run storybook` is running.

---

## Project layout

```
src/
  worker.tsx              # Routes + middleware
  client.tsx              # Client hydration
  app/
    document.tsx          # HTML shell (RSC stylesheet link)
    providers.tsx         # Optional DS theme wrapper
    styles.css            # Tailwind entry
    pages/                # Server Component screens
    components/           # Client islands + shared UI
.storybook/               # Storybook (browse)
.storybook-vitest/        # Vitest-only Storybook config
.cursor/                  # Agent rules, skills, hooks, MCP
CORE_MANIFEST.json        # Generic files (for future variant sync)
```

---

## AI agent setup

Agents should read [`AGENTS.md`](./AGENTS.md) for conventions and the review checklist.

| Resource        | Path                                                                         | Purpose                        |
| --------------- | ---------------------------------------------------------------------------- | ------------------------------ |
| Always-on rules | [`.cursor/rules/`](./.cursor/rules/)                                         | Mission, Vite+, UI conventions |
| Project skill   | [`.cursor/skills/figma-to-prototype/`](./.cursor/skills/figma-to-prototype/) | Figma MCP → pages workflow     |
| Figma MCP       | `.cursor/mcp.json` + `/add-plugin figma`                                     | Design context from Figma URLs |

Open Agent chat, paste a Figma URL, and ask to implement the screen.

---

## Adding a design system

1. Install your UI library (`pnpm add …`)
2. Wire `ThemeProvider` (or equivalent) in `src/app/providers.tsx`
3. Replace demo components in `src/app/components/` with DS primitives
4. Update `.cursor/rules/ui-stack.mdc` for agent conventions

Or start from **[vibework-astryx](https://github.com/simoncrypta/vibework-astryx)** if Astryx fits your project.
