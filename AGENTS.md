# Vibework

**Purpose:** Figma or sketch → clickable, deployable UI fast. Smallest change that makes the screen work — not production architecture.

## Stack

| Layer     | Choice                                                            |
| --------- | ----------------------------------------------------------------- |
| Toolchain | Vite+ — use **`vp`**, not raw `npm`/`vite`                        |
| Runtime   | [RedwoodSDK](https://docs.rwsdk.com/) (RSC on Cloudflare Workers) |
| UI        | Bring your own — Tailwind included for layout                     |
| Verify    | `vp check` + `vp test` (Storybook play tests for app components)  |

Deploy: `vp run release` · Worker: `src/worker.tsx` · Client: `src/client.tsx` · Pages: `src/app/pages/` · Client islands: `src/app/components/`

## Workflow

1. After pull: `vp install`
2. Before finishing: `vp check` && `vp test`
3. Add your design system in `src/app/providers.tsx` and component imports
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
