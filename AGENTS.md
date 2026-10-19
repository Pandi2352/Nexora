# Nexora OS — Agent Instructions

Multi-tenant business operations SaaS. React + Vite + TypeScript + Tailwind CSS v4 in `client/`, NestJS + MongoDB in `server/`, docs in `docs/`.

## Before writing code

- Follow the skills `nexora-development-standards` and `nexora-interaction-states` (`.agents/skills/`).
- Product scope: `docs/PRD.md` · MVP 1: `docs/MVP1_FOUNDATION.md`
- Architecture: `docs/FRONTEND_ARCHITECTURE.md`, `docs/BACKEND_ARCHITECTURE.md`, `docs/TECH_STACK.md`
- Rules summary: `docs/CODING_STANDARDS.md`

## Non-negotiable rules

1. Files stay under ~150–200 lines; pages are coordinators, subcomponents live in `components/<module>/`.
2. Use only `@/components/ui` primitives on the frontend and `@/common` helpers on the backend.
3. `rounded-md` only; no `shadow-*`; theme tokens from `client/src/index.css` (user-owned — never rewrite it); every clickable element shows a pointer cursor.
4. UUID v4 IDs only; never MongoDB `ObjectId`.
5. Every tenant-owned query is scoped by `organizationId`.
6. Use the installed Node 20.19.4 (never upgrade it). Before every install run `node scripts/check-latest.mjs <pkg>` and install the newest version that supports this Node; `package.json` must show that exact version; then build/run to confirm. Remove unused packages. Routing uses `react-router-dom` only.
7. Never commit secrets or `.env` files.

## Skills

The source of truth is `.agents/skills/` (read by Codex and OpenCode). After editing a skill, run `node scripts/sync-skills.mjs` to copy it to `.claude/skills/` (Claude Code) and `.agent/skills/` (Antigravity).
