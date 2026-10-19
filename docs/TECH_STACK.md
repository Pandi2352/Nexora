# Nexora OS — Tech Stack

| Field | Value |
|---|---|
| Document ID | NEX-STACK-001 |
| Version | 1.0 |
| Status | Draft — review and approve before implementation |
| Related | [PRD.md](./PRD.md) · [FRONTEND_ARCHITECTURE.md](./FRONTEND_ARCHITECTURE.md) · [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md) |

This document lists every technology Nexora OS will use, why it was chosen, when it is introduced, and its decision status. A dependency is added only when its milestone arrives and its purpose is documented here.

---

## 1. Stack at a glance

| Layer | Choice |
|---|---|
| Architecture | Modular monolith + optional background worker process |
| Frontend | React · Vite · TypeScript (strict) · Tailwind CSS v4 |
| Backend | NestJS · TypeScript (strict) |
| Database | MongoDB · Mongoose |
| API | REST under `/api/v1`, documented with Swagger/OpenAPI |
| Auth | Short-lived access token (memory) + rotating refresh token (HttpOnly cookie) |
| Tenancy | Shared database and collections, scoped by `organizationId` |
| Testing | Vitest · React Testing Library · Jest · Supertest · Playwright |
| Infrastructure | Linux host · HTTPS reverse proxy · Docker · GitHub Actions |

---

## 2. Architecture principles that drive the stack

1. Start with the simplest architecture that supports the requirements.
2. Prefer a modular monolith over microservices.
3. Introduce advanced technologies only when a demonstrated need justifies them.
4. Keep secrets out of source code and client-side bundles.
5. Automate repeatable development and deployment tasks.
6. Record decisions explicitly instead of relying on undocumented assumptions.

---

## 3. Frontend

| Technology | Purpose | Introduced | Status |
|---|---|---|---|
| React | UI library | M1 | Proposed |
| Vite | Dev server and production bundler | M1 | Proposed |
| TypeScript (strict) | Type safety | M1 | Proposed |
| Tailwind CSS v4 | Styling, CSS-first theme tokens | M1 | Proposed |
| react-router-dom | Client-side routing, route groups (use this package only) | M1 | Installed |
| Axios | Centralized HTTP client with interceptors | Install when the API client is written | Proposed |
| React Hook Form | Complex form state | M2 | Proposed |
| Zod | Runtime schema validation, only where it materially helps | M2 | Proposed |
| Lucide React | Icons | M1 | Installed |
| Vitest | Unit and component test runner | M1 | Proposed |
| React Testing Library | Component behavior tests | M1 | Proposed |
| Playwright | Browser end-to-end tests | M2–M6 | Proposed |
| Server-state library (e.g. TanStack Query) | Caching, deduplication, invalidation | Only if needed | Deferred |

## 4. Backend

| Technology | Purpose | Introduced | Status |
|---|---|---|---|
| NestJS 12 (`@nestjs/common`, `core`, `platform-express` 12.1.3) | Modular application framework, dependency injection | M1 | Installed |
| `@nestjs/cli` 11.0.24 + `@nestjs/schematics` 11.1.0 | Build, watch, code generation (newest that run on Node 20; see § 10a) | M1 | Installed |
| TypeScript 6.0.3 (strict) — **server only** | Type safety. **Exception:** see § 10a | M1 | Installed |
| Mongoose 9.11.2 + `@nestjs/mongoose` 12.0.0 | MongoDB ODM, schemas, indexes | M1 | Installed |
| class-validator 0.15.1 + class-transformer 0.5.1 | DTO and environment validation | M1 | Installed |
| `@nestjs/config` 12.0.1 | Environment configuration, validated at startup | M1 | Installed |
| `@nestjs/swagger` 12.0.2 | OpenAPI documentation (development only) | M1 | Installed |
| helmet 8.3.0 | Security headers | M1 | Installed |
| reflect-metadata 0.2.2, rxjs 7.8.2 | NestJS runtime peers | M1 | Installed |
| `@node-rs/argon2` 2.2.2 | Argon2id password hashing (prebuilt N-API binaries) | M2 | Installed |
| `@nestjs/jwt` 12.0.3 | Short-lived stateless access tokens | M2 | Installed |
| `cookie-parser` 1.4.7 | Parsing HttpOnly cookies for rotating refresh tokens | M2 | Installed |
| Rate limiter (e.g. @nestjs/throttler) | Brute-force protection on auth endpoints | M2 | Proposed |
| Structured logger (e.g. pino) | JSON logs with correlation IDs | M1 | Proposed |
| Jest + Supertest | Unit and API integration tests | M1 | Proposed |
| Durable queue (e.g. BullMQ) + Redis-compatible store | Background jobs, retries, scheduling | M5 | Deferred — decide when first persistent job is defined |

## 5. Database

| Technology | Purpose | Status |
|---|---|---|
| MongoDB | Primary application database | Proposed |
| MongoDB Atlas *or* local MongoDB / Docker | Development hosting | Open decision |
| Managed vs self-hosted production MongoDB | Production hosting | Open decision |
| Migration scripts / tooling | Backfills, index changes, data transforms | Decide in M1 |

Single application database. No database-per-tenant unless a future business or regulatory requirement justifies it.

## 6. Infrastructure and DevOps

| Technology | Purpose | Introduced | Status |
|---|---|---|---|
| Git + GitHub | Source control, PRs, protected `main` | M1 | Proposed |
| GitHub Actions | CI (lint, type-check, test, build) and CD | M1 / M7 | Proposed |
| Docker + Docker Compose | Reproducible local services and deploy artifacts | M1–M7 | Proposed |
| Linux server | Production host | M7 | Proposed |
| Reverse proxy (e.g. Nginx or Caddy) | HTTPS termination, routing `/api/*`, static assets | M7 | Proposed |
| Let's Encrypt / managed TLS | HTTPS certificates and renewal | M7 | Proposed |
| Private object storage (S3-compatible) | Document bytes | M3 | Open decision — provider |
| Email provider | Verification, invitation, reset, notification emails | M2 | Open decision — provider |
| Error tracking | Application error reporting | M6–M7 | Open decision |
| Uptime monitoring | External availability checks | M7 | Open decision |
| Terraform (or alternative) | Infrastructure as code | M8 | Deferred |
| Kubernetes | Advanced learning exercise only | M8+ | Deferred |

## 7. Developer tools

| Tool | Purpose |
|---|---|
| Node.js 20.19.4 + npm 10.8.2 (the installed versions — do not require an upgrade) | Runtime and package manager. Packages use the newest version that supports this Node (`node scripts/check-latest.mjs <pkg>`) |
| VS Code | Editor |
| Oxlint (client) · Prettier (client + server); server linter decided with the first feature module | Linting / formatting |
| Prettier | Formatting |
| Postman or Bruno | Manual API testing |
| MongoDB Compass (optional) | Database inspection |
| Docker Desktop | Containerization, when needed |

---

## 8. Decision register

| Decision | Recommended direction | Status |
|---|---|---|
| Architecture | Modular monolith | Proposed |
| Frontend | React + Vite + TypeScript | Proposed |
| Styling | Tailwind CSS v4 | Proposed |
| Backend | NestJS + TypeScript | Proposed |
| Database | MongoDB + Mongoose | Proposed |
| API | REST, versioned under `/api/v1` | Proposed |
| API documentation | NestJS Swagger | Proposed |
| Validation | class-validator + class-transformer DTOs | Proposed |
| Frontend routing | react-router-dom | Accepted |
| Frontend HTTP | Axios | Proposed |
| Forms | React Hook Form; schema validation where useful | Proposed |
| Frontend testing | Vitest + React Testing Library | Proposed |
| Browser testing | Playwright | Proposed |
| Backend testing | Jest + Supertest | Proposed |
| Authentication | Short-lived access token + rotating refresh session | Proposed |
| Tenant model | Shared DB and collections with explicit organization scoping | Proposed |
| File storage | Private object storage behind an abstraction | Proposed |
| Background jobs | Durable queue when needed | Proposed |
| Deployment | Linux server, HTTPS reverse proxy, automated CI/CD | Proposed |
| Repository layout | Single repo with `client/` and `server/` | **Needs confirmation** — see § 9 |
| Microservices | Not for the initial release | Deferred |
| Kubernetes | Advanced learning stage only | Deferred |

---

## 9. Repository strategy

The original planning notes contain two different recommendations:

- **Checklist:** one Git repository with separate frontend and backend apps.
- **Architecture spec:** two repositories (`nexora-web`, `nexora-api`).

**Recommendation: one repository.** The workspace is already laid out as `nexora/client` + `nexora/server` + `nexora/docs`. One repository keeps docs, CI workflows and infrastructure config next to the code they describe, and a single PR can change an API contract and its frontend consumer together. Frontend/backend boundaries are enforced by keeping each app's `package.json`, `tsconfig.json` and dependencies separate. No monorepo toolchain (Nx, Turborepo) is needed.

Revisit if the apps need independent release permissions or separate teams.

```
nexora/
├── client/            # React + Vite + TypeScript
├── server/            # NestJS + MongoDB
├── docs/
├── infrastructure/    # docker/, nginx/ — added when needed
├── .github/workflows/
├── .gitignore
└── README.md
```

---

## 10. Explicit exclusions for the first architecture

Do not start with:

- Microservices for every business module.
- Kubernetes.
- Multiple databases without a demonstrated requirement.
- Event streaming infrastructure such as Kafka.
- A separate database for every organization.
- Arbitrary code execution for user-defined workflows.
- Complex distributed caching.
- An elaborate plugin system.
- Premature CQRS or event sourcing.

These remain possible future learning or scaling topics, not MVP prerequisites.

---

## 10a. Version exceptions

Packages not on their npm `latest` tag. Each needs a reason and an exit condition. The project runs on the **installed Node.js 20.19.4**, which is not being upgraded. "Latest" therefore means the newest version that supports it (`node scripts/check-latest.mjs <pkg>`).

| Package | Where | Pinned to | Latest | Reason | Remove when |
|---|---|---|---|---|---|
| `typescript` | `server/` | 6.0.3 (latest 6.x) | 7.0.2 | TypeScript 7.0 ships only the `tsc` executable without the programmatic compiler API; the Nest CLI needs that API to build and refuses to run with TS 7. | TypeScript 7.1 restores the API. The client already uses 7.0.2. |
| `@nestjs/cli` | `server/` | 11.0.24 | 12.0.8 | v12 depends on `@nestjs/schematics` 12 (Node 22+) and crashes on Node 20 (`ERR_REQUIRE_CYCLE_MODULE`). | Node is upgraded to 22+. |
| `@nestjs/schematics` | `server/` | 11.1.0 | 12.0.7 | `engines.node` ≥ 22.22 in v12. | Node 22+. |
| `vitest` | `client/` | 4.1.12 | 5.0.5 | v5 needs Node 22.12+. | Node 22+. |
| `jsdom` | `client/` | 29.1.1 | 30.1.3 | v30 needs Node 22.22+. | Node 22+. |
| `@testing-library/jest-dom` | `client/` | 6.9.1 | 7.0.1 | v7 needs a newer Node. | Node 22+. |
| `@types/node` | both | 20.19.43 | 26.x | Must match the installed Node 20 runtime, so code can't use APIs that don't exist on it. | Node is upgraded (match its major). |
| `react-router-dom` | `client/` | 7.18.4 (its latest) | `react-router` 8.4 | User rule: routing uses `react-router-dom`. Its last line is v7; v8 is only published as `react-router` (and needs Node 22+). | Decision to move to `react-router`. |

## 11. Dependency policy

- Do not install every possible library up front. Add a dependency when its milestone arrives.
- Each dependency must have a documented purpose in this file.
- Review maintenance status, licence, security history, and compatibility before adding it.
- Pin versions via the lockfile; commit `package-lock.json`.
- Run dependency vulnerability checks in CI.
- Prefer platform features and existing dependencies over new ones.

## 12. Environment and secrets

- Frontend: only public values belong in `VITE_*` variables, e.g. `VITE_API_BASE_URL=/api/v1`. Anything in the browser bundle is public.
- Backend: secrets come from ignored `.env` files in development and a protected server-side mechanism in production.
- Each app ships a `.env.example` with variable names and placeholder descriptions, never real values.
- Development, staging, and production use separate credentials.

## 13. Open stack decisions

| Decision | Needed by |
|---|---|
| MongoDB hosting (Atlas vs local/Docker for dev; production option) | M1 / M7 |
| Final API versioning and error format | M1 |
| Migration tooling | M1 |
| Email provider | M2 |
| Authentication cookie/CSRF details and token lifetimes | M2 |
| File-storage provider | M3 |
| Queue and worker infrastructure | M5 |
| Error tracking and uptime monitoring services | M6–M7 |
| Domain, registrar, DNS and hosting provider | M7 |
