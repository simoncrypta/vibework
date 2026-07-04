# Vibework

**Purpose:** Figma or sketch → clickable, deployable UI fast. Smallest change that makes the screen work — not production architecture.

## Stack

| Layer     | Choice                                                            |
| --------- | ----------------------------------------------------------------- |
| Toolchain | Vite+ — use **`vp`**, not raw `npm`/`vite`                        |
| Runtime   | [RedwoodSDK](https://docs.rwsdk.com/) (RSC on Cloudflare Workers) |
| UI        | Astryx components + Tailwind layout (token-backed utilities)      |
| Verify    | `vp check` + `vp test` (Storybook play tests for app components)  |

Deploy: `vp run release` · Worker: `src/worker.tsx` · Client: `src/client.tsx` · Pages: `src/app/pages/` · Client islands: `src/app/components/`

## Workflow

1. After pull: `vp install`
2. Before finishing: `vp check` && `vp test`
3. UI work: discover with `vp run astryx -- build "<idea>"` — do not invent a parallel design system
4. Custom scripts: `vp run <script>` (see `package.json`)

## Task-specific docs (read when relevant)

| Doc                                          | When                                                   |
| -------------------------------------------- | ------------------------------------------------------ |
| `.cursor/rules/ui-stack.mdc`                 | Editing `src/**/*.{tsx,ts,css}`                        |
| `.cursor/rules/component-stories.mdc`        | Editing `src/app/components/` (Storybook, Vitest, MCP) |
| `.cursor/skills/figma-to-prototype/SKILL.md` | Figma URL or design input                              |

Cursor rules, skills, MCP, and hooks live under `.cursor/` — loaded automatically.

## Gotchas

- Package manager is **pnpm** — use `pnpm add`, not `npm` or `vpx storybook add`
- First-time browser tests: `pnpm exec playwright install chromium`
- Generated Astryx catalog (`src/storybook/astryx/`) is docs-only
- Tooling issues: `vp env doctor`

<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.
- [ ] If setup, runtime, or package-manager behavior looks wrong, run `vp env doctor` and include its output when asking for help.

<!--VITE PLUS END-->

<!-- ASTRYX:START -->

Astryx v0.1.2 · 148 components
CLI: run every command as `vp run astryx -- <cmd>` (shown below as `astryx ...`).

SETUP (once, in your app entry e.g. main.tsx) — without these, components render unstyled:
import "@astryxdesign/core/reset.css";
import "@astryxdesign/core/astryx.css";

WORKFLOW — discover, don't guess. Before writing UI:

1. `astryx build "<idea>"` — START HERE: returns a kit (closest [page] + [block]s + [component]s). No args = full playbook.
2. `astryx template <name> [--skeleton]` — scaffold the [page]/[block]s it named, or study their layout. Templates are reference code.
3. `astryx component <Name>` — props + examples for every component you use.

RULES:

- Prefer Astryx layout components (`VStack`, `HStack`, `Card`, `AppShell`) for structure; page chrome may use `main`/`div` with Tailwind.
- Custom styling: component props first; else `className` with token-backed Tailwind (`bg-surface`, `text-primary`, …) or CSS vars (`var(--color-*)`, `var(--spacing-*)`, `var(--radius-*)`). No raw hex/px.
- Tokens for every value (`astryx docs tokens`). Brand/accent via `astryx theme` — never override --color-\* in :root.

MORE CLI:
search "<query>" find any component / hook / doc / template / block
component --list 148 components by category
template --list page + block recipes
docs <topic> color, elevation, icons, illustrations, migration, motion, principles, shape, spacing, styling, theme, tokens, typography
swizzle <Name> eject component source (--gap reports why)
upgrade --apply run after any @astryxdesign/core bump

<!-- ASTRYX:END -->
