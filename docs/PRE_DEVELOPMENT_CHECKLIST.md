# Nexora OS — Phase 0 Pre-development Checklist

**Milestone:** Phase 0 — Product Discovery, Architecture and Engineering Preparation
**Goal:** Eliminate major design mistakes before they become expensive to fix.
**Rule:** No application feature code until this milestone is reviewed and approved.

Related documents: [PRD.md](./PRD.md) · [TECH_STACK.md](./TECH_STACK.md) · [FRONTEND_ARCHITECTURE.md](./FRONTEND_ARCHITECTURE.md) · [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md)

---

## Progress

| Area | Done | Total |
|---|---|---|
| 01. Product definition | 1 | 5 |
| 02. System architecture | 0 | 5 |
| 03. Frontend blueprint | 0 | 6 |
| 04. Backend blueprint | 0 | 6 |
| 05. MongoDB design | 0 | 6 |
| 06. Security and quality | 0 | 5 |
| 07. DevOps and domain | 0 | 6 |
| 08. Project management | 0 | 5 |
| **Total** | **1** | **44** |

> Update the counts above as you tick items. Link each completed item to the document that satisfies it.

---

## 01. Product definition

Decide exactly what we're building.

- [x] Write the product requirements document (PRD). → [PRD.md](./PRD.md) *(draft v1.0 — pending review)*
- [ ] Define target users, personas and user journeys.
- [ ] Finalize MVP scope versus future features.
- [ ] Define user roles and permission matrix.
- [ ] Write acceptance criteria for each feature.

## 02. System architecture

Define how the application works internally.

- [ ] Create a high-level architecture diagram.
- [ ] Choose modular monolith architecture for NestJS.
- [ ] Define frontend and backend boundaries.
- [ ] Define module dependencies and shared services.
- [ ] Document important architectural decisions (ADRs).

## 03. Frontend blueprint

Design the complete frontend before implementation.

- [ ] Create the sitemap and route inventory.
- [ ] Design sidebar, navigation and page layouts.
- [ ] Define the feature-based folder structure.
- [ ] Create the design system and theme tokens.
- [ ] List reusable components, forms, tables and dialogs.
- [ ] Plan frontend state, API caching and error handling.

## 04. Backend blueprint

Define the API and backend responsibilities.

- [ ] List every NestJS module and its responsibilities.
- [ ] Define REST endpoints and HTTP conventions.
- [ ] Specify DTOs, validation and error responses.
- [ ] Design authentication and authorization flows.
- [ ] Prepare Swagger/OpenAPI conventions.
- [ ] Identify queues, scheduled jobs and external integrations.

## 05. MongoDB design

Plan data ownership and integrity.

- [ ] List collections and document fields.
- [ ] Decide embedding versus references.
- [ ] Define indexes and unique constraints.
- [ ] Plan tenant isolation and ownership checks.
- [ ] Design pagination, search and reporting queries.
- [ ] Plan migrations, retention, backup and recovery.

## 06. Security and quality

Establish quality gates before feature development.

- [ ] Create a threat model and security checklist.
- [ ] Define unit, integration and E2E testing strategy.
- [ ] Define linting, formatting and TypeScript rules.
- [ ] Plan logging, correlation IDs and error tracking.
- [ ] Define code review and pull request standards.

## 07. DevOps and domain

Prepare the path to production.

- [ ] Compare domain names and registrar pricing.
- [ ] Choose DNS, frontend and backend hosting.
- [ ] Design local development and Docker environments.
- [ ] Define development, staging and production configuration.
- [ ] Plan GitHub Actions CI/CD.
- [ ] Plan HTTPS, monitoring, backups and rollback.

## 08. Project management

Make the project executable in small milestones.

- [ ] Create epics, features and engineering tasks.
- [ ] Map dependencies between milestones.
- [ ] Estimate effort and define completion criteria.
- [ ] Create a learning and mastery tracker.
- [ ] Set a definition of done for every feature.

---

## Recommended order of work

Don't attempt to finish all eight areas in a single day. Work through them in this order:

1. **Product specification** — features, users, business workflows and MVP boundaries.
2. **Architecture** — frontend, backend, database, integrations and module dependencies.
3. **Database and API contracts** — collections, indexes, endpoints, DTOs and error formats.
4. **UI/UX blueprint** — every route, reusable component, form and application state.
5. **Security and testing** — authorization matrix, threat model, test strategy and quality gates.
6. **Infrastructure plan** — domain, hosting, environments, Docker and CI/CD.
7. **Development backlog** — break everything into small, testable implementation tasks.
8. **Begin coding** only after the first implementation milestone is clearly defined.

## Planned Phase 0 documents

| # | Document | Status |
|---|---|---|
| 1 | [PRD.md](./PRD.md) | Draft v1.0 |
| 2 | [TECH_STACK.md](./TECH_STACK.md) | Draft v1.0 |
| 3 | [FRONTEND_ARCHITECTURE.md](./FRONTEND_ARCHITECTURE.md) | Draft v1.0 |
| 4 | [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md) | Draft v1.0 |
| 5 | Database design specification | Not started |
| 6 | Authentication and authorization specification | Not started |
| 7 | API contract specification | Not started |
| 8 | UI and route specification | Not started |
| 9 | Master development checklist / backlog | Not started |

---

## Machine preparation

You don't need every tool today. Start with these:

- [ ] Node.js LTS and npm
- [ ] Git and a GitHub account
- [ ] VS Code
- [ ] MongoDB Atlas account or a local MongoDB option
- [ ] Postman or Bruno for API testing
- [ ] Docker Desktop or Docker Engine *(when we reach containerization)*

Testing tools, monitoring services, and deployment credentials are added at the appropriate stages.

> **Never commit** secrets, passwords, database connection strings, or production `.env` files to Git.

---

## Repository structure decision

Recommended: **one Git repository** with separate frontend and backend applications, without a complicated monorepo toolchain. The current workspace already follows this shape:

```
nexora/
├── client/                # React + Vite + TypeScript
├── server/                # NestJS + MongoDB
├── docs/
│   ├── product/
│   ├── architecture/
│   ├── database/
│   ├── api/
│   ├── security/
│   └── deployment/
├── infrastructure/        # added later
│   ├── docker/
│   └── nginx/
├── .github/
│   └── workflows/
├── .gitignore
└── README.md
```

This is a proposed structure, not a reason to initialize the repository yet. Finalize it against the architecture and deployment plan first. See [TECH_STACK.md § Repository strategy](./TECH_STACK.md#9-repository-strategy).
