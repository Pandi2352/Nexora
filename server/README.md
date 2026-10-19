# Nexora OS — Server

NestJS 12 + MongoDB (Mongoose 9). Architecture: [`../docs/BACKEND_ARCHITECTURE.md`](../docs/BACKEND_ARCHITECTURE.md).

## Requirements

- Node.js 20.19+ (see `.nvmrc`). Build tooling is pinned to the newest versions that run on Node 20 (Nest CLI 11).
- MongoDB running locally (default `mongodb://127.0.0.1:27017`) or a remote URI.

## Setup

```bash
cp .env.example .env   # then edit values
npm install
npm run start:dev
```

- API: http://localhost:3000/api/v1
- Health: `GET /api/v1/health/live`, `GET /api/v1/health/ready`
- Swagger (development only): http://localhost:3000/docs

The server validates `.env` at startup and exits with a list of problems if anything is missing or invalid.

## Scripts

| Script | Purpose |
|---|---|
| `npm run start:dev` | Watch mode |
| `npm run build` | Compile to `dist/` |
| `npm run start:prod` | Run `dist/main.js` |
| `npm run typecheck` | TypeScript check |
| `npm run format` / `format:check` | Prettier |

## TypeScript version

The server uses **TypeScript 6.0.3**, not 7. TypeScript 7.0 ships no programmatic compiler API, and the Nest CLI needs one. Upgrade when TypeScript 7.1 restores the API. Recorded in `docs/TECH_STACK.md`.
