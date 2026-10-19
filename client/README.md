# Nexora OS — Client

React + Vite + TypeScript + Tailwind CSS v4. Architecture: [`../docs/FRONTEND_ARCHITECTURE.md`](../docs/FRONTEND_ARCHITECTURE.md).

## Requirements

- Node.js 20.19+ (see `.nvmrc`)

## Setup

```bash
cp .env.example .env
npm install
npm run dev
```

The dev server runs on http://localhost:5173 and proxies `/api` to http://localhost:3000.

## Scripts

| Script                            | Purpose                  |
| --------------------------------- | ------------------------ |
| `npm run dev`                     | Start dev server         |
| `npm run build`                   | Type-check and build     |
| `npm run preview`                 | Preview production build |
| `npm run typecheck`               | TypeScript check         |
| `npm run lint`                    | Oxlint                   |
| `npm run format` / `format:check` | Prettier                 |
| `npm test` / `test:watch`         | Vitest                   |
