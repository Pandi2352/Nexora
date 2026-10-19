# Nexora OS — Product Requirements Document (PRD)

| Field | Value |
|---|---|
| Document version | 1.0 |
| Date | 17 October 2026 |
| Status | Initial planning baseline |
| Product type | Multi-tenant Business Operations SaaS |
| Project stage | Pre-development |
| Primary objective | Full-stack engineering mastery through a complete real-world product |
| Target architecture | Modular monolith |
| Frontend | React + Vite + TypeScript + Tailwind CSS v4 |
| Backend | NestJS + TypeScript |
| Database | MongoDB + Mongoose |
| Deployment goal | Custom domain, HTTPS, automated deployment, monitoring, and backups |

> This document is the source of truth for **what** Nexora OS must do. How it is built is covered in [FRONTEND_ARCHITECTURE.md](./FRONTEND_ARCHITECTURE.md), [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md) and [TECH_STACK.md](./TECH_STACK.md). Phase 0 progress is tracked in [PRE_DEVELOPMENT_CHECKLIST.md](./PRE_DEVELOPMENT_CHECKLIST.md).

---

## Table of contents

1. [Executive summary](#1-executive-summary)
2. [Problem statement](#2-problem-statement)
3. [Target users and personas](#3-target-users-and-personas)
4. [Scope and release strategy](#4-scope-and-release-strategy)
5. [Functional requirements](#5-functional-requirements)
6. [Information architecture and route inventory](#6-information-architecture-and-route-inventory)
7. [Non-functional requirements](#7-non-functional-requirements)
8. [Proposed technical architecture](#8-proposed-technical-architecture)
9. [Core data model](#9-core-data-model)
10. [API standards](#10-api-standards)
11. [Authentication and authorization design](#11-authentication-and-authorization-design)
12. [User experience requirements](#12-user-experience-requirements)
13. [Testing requirements](#13-testing-requirements)
14. [Security requirements](#14-security-requirements)
15. [DevOps and deployment requirements](#15-devops-and-deployment-requirements)
16. [Performance and capacity planning](#16-performance-and-capacity-planning)
17. [External integrations](#17-external-integrations)
18. [Project documentation deliverables](#18-project-documentation-deliverables)
19. [Definition of done](#19-definition-of-done)
20. [Project milestones](#20-project-milestones)
21. [Success criteria](#21-success-criteria)
22. [Open decisions before implementation](#22-open-decisions-before-implementation)
23. [Final project direction](#23-final-project-direction)

---

## 1. Executive summary

### 1.1 Product overview

Nexora OS is a unified business operations platform that enables organizations to manage customers, sales opportunities, projects, tasks, documents, support tickets, workflows, teams, and operational analytics from one application.

The platform brings together capabilities commonly found in CRM systems, project management tools, document management systems, helpdesk platforms, and workflow automation products.

All modules share a common foundation for authentication, organizations, permissions, notifications, settings, audit trails, search, and reporting.

Nexora OS will be developed as a comprehensive learning and portfolio project with production-oriented engineering practices. The project must demonstrate practical proficiency in:

- Modern React application development.
- Strict TypeScript and type-safe API integration.
- Tailwind CSS v4 and reusable design systems.
- NestJS modular architecture and dependency injection.
- MongoDB data modelling and query optimization.
- Authentication, authorization, and application security.
- Automated testing and software quality assurance.
- Docker, Linux, networking, domain configuration, and CI/CD.
- Production deployment, monitoring, backups, and recovery.

### 1.2 Product vision

Build a maintainable, secure, extensible business platform that allows an organization to manage its core operational workflows without switching between disconnected tools.

### 1.3 Product mission

Deliver a complete, integrated application that combines real business functionality with professional engineering practices and provides a long-term environment for mastering full-stack development.

### 1.4 Product principles

1. **Security first:** Every protected operation must enforce authentication and authorization on the server.
2. **Modular architecture:** Each business domain must have clear responsibilities and boundaries.
3. **Type safety:** TypeScript strict mode must be enabled for frontend and backend code.
4. **API consistency:** All endpoints must follow documented conventions for validation, errors, pagination, and status codes.
5. **Data integrity:** Important business operations must remain correct under retries, concurrent requests, and partial failures.
6. **Testability:** Business logic must be independently testable.
7. **Operational readiness:** Production configuration, logging, monitoring, and backups must be planned from the beginning.
8. **Cost awareness:** Hosting and third-party integrations must have documented cost and usage limits.
9. **Accessibility:** Interfaces must support keyboard navigation, semantic HTML, and appropriate contrast.
10. **Incremental delivery:** Each milestone must produce a working, verifiable result.

---

## 2. Problem statement

Organizations frequently manage customer relationships, projects, internal requests, documents, and support operations using separate tools. This creates problems such as:

- Fragmented information.
- Duplicated customer and project records.
- Inconsistent permissions.
- Manual status updates and repetitive work.
- Limited visibility into operational performance.
- Inconsistent reporting.
- Missing audit history.
- Difficult integration between tools.
- Poor visibility into overdue work and unresolved issues.

Nexora OS aims to address these problems through a centralized, modular platform.

---

## 3. Target users and personas

### 3.1 Platform Owner

Responsible for operating the SaaS platform.

**Needs:** platform-wide organization management; tenant lifecycle management; operational health visibility; subscription and usage administration; platform-level audit records.

Platform-owner privileges must be distinct from organization-level administration.

### 3.2 Organization Owner

Owns an organization workspace.

**Needs:** configure organization settings; invite and remove members; assign administrative roles; configure teams and policies; view organization analytics; manage usage limits and integrations.

### 3.3 Organization Administrator

Manages daily workspace administration.

**Needs:** manage members and permissions; configure business modules; maintain custom fields and workflow settings; review audit events; manage organization resources.

### 3.4 Manager

Oversees a team or business function.

**Needs:** assign work; monitor performance; approve requests; review reports; identify overdue tasks and bottlenecks.

### 3.5 Employee

Uses assigned business modules.

**Needs:** manage assigned tasks and records; collaborate through comments and notifications; upload and access permitted documents; update work status; track personal activities.

### 3.6 Support Agent

Handles customer or internal support requests.

**Needs:** view assigned and authorized ticket queues; update ticket status; communicate through ticket replies; monitor SLA deadlines; escalate unresolved issues.

### 3.7 External Customer or Guest *(future, optional)*

**Needs:** access explicitly shared resources; submit support requests; view permitted updates; access shared documents through controlled links.

External portal access is **not** required for the initial MVP.

---

## 4. Scope and release strategy

### 4.1 MVP scope

The MVP must establish a working end-to-end platform with:

- Authentication and account management.
- Organization creation and membership.
- Team management.
- Role-based and resource-level permissions.
- Main application layout and dashboard.
- CRM records.
- Projects and tasks.
- Comments and activity history.
- Notifications.
- Document uploads and access controls.
- Support tickets.
- Search, filters, sorting, and pagination.
- Organization settings.
- Audit logging.
- Basic analytics.
- API documentation.
- Automated tests.
- Docker-based local development.
- CI pipeline and production deployment.

The MVP should prioritize complete, secure workflows over a large number of partially implemented features.

### 4.2 Post-MVP scope

May be implemented after the core product is stable:

- Visual workflow builder.
- Advanced workflow execution engine.
- Email inbox synchronization.
- Advanced reporting and scheduled exports.
- WebSocket-based real-time updates.
- Advanced document versioning and previews.
- Subscription billing and payment processing.
- Public API keys and developer integrations.
- Advanced custom fields and configurable forms.
- Advanced search infrastructure.
- Multi-region deployment.
- Kubernetes orchestration.
- Advanced infrastructure automation.

### 4.3 Explicitly excluded from the initial release

- Native mobile applications.
- Microservices decomposition.
- Full accounting or payroll.
- Medical records or other highly regulated domain-specific records.
- Production-grade AI processing as a core dependency.
- Complex enterprise billing before the core product is complete.

These exclusions prevent scope expansion from delaying the learning objectives.

---

## 5. Functional requirements

**Priority definitions**

| Priority | Meaning |
|---|---|
| **P0** | Required for the initial working platform |
| **P1** | Required for a complete MVP or immediately following its foundation |
| **P2** | Advanced or post-MVP capability |

### 5.1 Authentication and account management

**Module:** Identity and Access · **Priority:** P0

| ID | Requirement |
|---|---|
| AUTH-001 | Users can register with validated account details. |
| AUTH-002 | Users can log in securely. |
| AUTH-003 | Passwords must be stored using an appropriate password-hashing algorithm. |
| AUTH-004 | Users can log out and revoke their active authentication session. |
| AUTH-005 | Users can verify their email address. |
| AUTH-006 | Users can request a password reset. |
| AUTH-007 | Password-reset tokens must expire and be single-use. |
| AUTH-008 | Protected frontend routes must redirect unauthenticated users appropriately. |
| AUTH-009 | The backend must independently validate every protected request. |
| AUTH-010 | Refresh-token rotation and revocation must be supported if refresh tokens are used. |
| AUTH-011 | Login and sensitive authentication endpoints must be rate-limited. |
| AUTH-012 | Authentication failures must not reveal whether an arbitrary email address exists. |
| AUTH-013 | Account status must support active, suspended, and disabled states. |
| AUTH-014 | Users can update their profile and change their password. |
| AUTH-015 | Security-sensitive account changes must be auditable. |

### 5.2 Organization and multi-tenancy

**Module:** Organizations · **Priority:** P0

| ID | Requirement |
|---|---|
| ORG-001 | An authenticated user can create an organization. |
| ORG-002 | An organization has a unique identifier and normalized workspace slug. |
| ORG-003 | A user can belong to multiple organizations. |
| ORG-004 | Users can switch between organizations they are authorized to access. |
| ORG-005 | Organization membership has an independent status. |
| ORG-006 | Organization owners can invite members. |
| ORG-007 | Invitations must expire and cannot be accepted more than once. |
| ORG-008 | Organization administrators can manage permitted members. |
| ORG-009 | Organization settings are isolated by tenant. |
| ORG-010 | Business records must be scoped to the correct organization. |
| ORG-011 | Cross-tenant access must be rejected even if a user guesses another record's identifier. |
| ORG-012 | Ownership transfer must follow explicit authorization rules. |
| ORG-013 | Organization suspension must prevent prohibited access. |
| ORG-014 | Tenant deletion must follow a documented retention and recovery policy. |

### 5.3 Teams and permissions

**Module:** Teams and Access Control · **Priority:** P0

| ID | Requirement |
|---|---|
| IAM-001 | Organization administrators can create and manage teams. |
| IAM-002 | Members can be assigned to teams. |
| IAM-003 | The platform supports predefined roles. |
| IAM-004 | The authorization system supports explicit permissions. |
| IAM-005 | Access checks must include organization membership. |
| IAM-006 | Resource ownership and assignment rules must be enforced. |
| IAM-007 | Sensitive operations must require appropriate permissions. |
| IAM-008 | Frontend navigation should reflect the user's permissions. |
| IAM-009 | Hiding a UI action must never replace backend authorization. |
| IAM-010 | Permission changes must take effect without requiring an unsafe long-lived authorization cache. |
| IAM-011 | Platform-level privileges must be separate from tenant-level roles. |

**Initial roles:** Platform Administrator, Organization Owner, Organization Administrator, Manager, Member, Support Agent.

Permissions must be represented explicitly rather than relying only on hardcoded role-name checks.

### 5.4 Dashboard and analytics

**Module:** Dashboard and Reporting · **Priority:** P0 for core summaries; P1 for advanced analytics

| ID | Requirement |
|---|---|
| DASH-001 | Display metrics relevant to the user's permissions. |
| DASH-002 | Provide date-range filters. |
| DASH-003 | Display recent authorized activity. |
| DASH-004 | Display task and ticket status summaries. |
| DASH-005 | Display CRM pipeline summaries. |
| DASH-006 | Display overdue and upcoming work. |
| DASH-007 | Provide loading, empty, error, and partial-data states. |
| DASH-008 | Support pagination or limits for activity feeds. |
| DASH-009 | Apply tenant and permission filters to analytics queries. |
| DASH-010 | Export authorized report data to CSV. |
| DASH-011 | Prevent expensive report queries from exhausting application resources. |

### 5.5 CRM and sales

**Module:** CRM · **Priority:** P0 for core CRUD and assignment; P1 for conversion workflows and advanced analytics

**Entities:** Companies, Contacts, Leads, Opportunities, Activities, Notes, Pipeline stages, Tags.

| ID | Requirement |
|---|---|
| CRM-001 | Create, read, update, and archive companies. |
| CRM-002 | Manage contacts and associate them with companies. |
| CRM-003 | Create and assign leads. |
| CRM-004 | Track lead source, status, and owner. |
| CRM-005 | Convert a lead into a contact or opportunity through a validated workflow. |
| CRM-006 | Create and manage opportunities. |
| CRM-007 | Move opportunities between permitted pipeline stages. |
| CRM-008 | Track expected value, probability, and expected close date. |
| CRM-009 | Record calls, meetings, notes, and follow-up activities. |
| CRM-010 | Search and filter CRM records. |
| CRM-011 | Support sorting and pagination. |
| CRM-012 | Prevent unauthorized duplicate or conflicting records where appropriate. |
| CRM-013 | Maintain a history of important changes. |
| CRM-014 | Provide a basic pipeline analytics view. |

### 5.6 Projects and tasks

**Module:** Project Management · **Priority:** P0 for projects, tasks, comments, and assignments; P1 for dependencies and advanced collaboration

**Entities:** Projects, Project memberships, Tasks, Subtasks, Comments, Attachments, Labels, Task activity events.

| ID | Requirement |
|---|---|
| PM-001 | Create, update, archive, and view projects. |
| PM-002 | Assign project members. |
| PM-003 | Create and assign tasks. |
| PM-004 | Support task priorities, statuses, due dates, and labels. |
| PM-005 | Support subtasks. |
| PM-006 | Support task dependencies where appropriate. |
| PM-007 | Support comments and mentions. |
| PM-008 | Attach authorized documents to tasks. |
| PM-009 | Display tasks in list and Kanban views. |
| PM-010 | Filter by status, assignee, priority, label, and due date. |
| PM-011 | Support pagination and stable sorting. |
| PM-012 | Display overdue tasks. |
| PM-013 | Validate permitted task-status transitions. |
| PM-014 | Record significant task changes. |
| PM-015 | Handle simultaneous updates without silently overwriting important changes. |

### 5.7 Document and file management

**Module:** Documents · **Priority:** P0 for basic uploads and downloads; P1 for advanced versioning

| ID | Requirement |
|---|---|
| DOC-001 | Upload permitted document types. |
| DOC-002 | Enforce configurable file-size limits. |
| DOC-003 | Validate file type using more than the client-provided filename. |
| DOC-004 | Store file metadata separately from binary storage where appropriate. |
| DOC-005 | Associate documents with authorized business records. |
| DOC-006 | Support folders and document organization. |
| DOC-007 | Enforce organization and resource access permissions. |
| DOC-008 | Generate safe download links or stream authorized downloads. |
| DOC-009 | Track uploader, upload time, size, and content type. |
| DOC-010 | Support file replacement and version history in the extended release. |
| DOC-011 | Handle failed uploads and abandoned multipart uploads. |
| DOC-012 | Define document deletion and retention rules. |
| DOC-013 | Prevent public exposure of private documents by default. |

### 5.8 Support and issue tracking

**Module:** Support · **Priority:** P0 for ticket lifecycle; P1 for SLA automation

| ID | Requirement |
|---|---|
| SUP-001 | Create support tickets. |
| SUP-002 | Assign tickets to authorized agents. |
| SUP-003 | Track status, priority, category, and requester. |
| SUP-004 | Add replies and internal notes. |
| SUP-005 | Maintain ticket history. |
| SUP-006 | Support ticket filtering and search. |
| SUP-007 | Calculate SLA deadlines according to configured rules. |
| SUP-008 | Identify overdue tickets. |
| SUP-009 | Escalate eligible tickets. |
| SUP-010 | Notify relevant users about important ticket changes. |
| SUP-011 | Restrict internal notes to authorized staff. |
| SUP-012 | Record resolution and closure information. |

### 5.9 Notifications

**Module:** Notifications · **Priority:** P0 for in-app notifications; P1 for email delivery and preferences

| ID | Requirement |
|---|---|
| NOT-001 | Generate notifications for important business events. |
| NOT-002 | Support unread and read states. |
| NOT-003 | Allow users to mark notifications as read. |
| NOT-004 | Support mark-all-as-read. |
| NOT-005 | Link notifications to authorized application resources. |
| NOT-006 | Provide notification preferences where applicable. |
| NOT-007 | Prevent duplicate notifications during job retries. |
| NOT-008 | Support email notifications through an external email provider. |
| NOT-009 | Track delivery failures without exposing provider credentials. |
| NOT-010 | Keep notification queries paginated. |

### 5.10 Workflow automation

**Module:** Automation Engine · **Priority:** P1 for basic automation; P2 for a visual workflow editor

| ID | Requirement |
|---|---|
| WF-001 | Define event-triggered workflows. |
| WF-002 | Support scheduled triggers. |
| WF-003 | Evaluate configurable conditions. |
| WF-004 | Execute approved actions. |
| WF-005 | Maintain workflow execution history. |
| WF-006 | Retry eligible transient failures. |
| WF-007 | Prevent duplicate side effects during retries. |
| WF-008 | Limit execution duration, frequency, and resource usage. |
| WF-009 | Allow authorized users to enable or disable workflows. |
| WF-010 | Record execution status and failure details. |
| WF-011 | Isolate workflow execution by tenant. |
| WF-012 | Prevent users from executing arbitrary server-side code. |

**Initial examples:**

- Notify an assignee when a task is created.
- Notify a manager when a task becomes overdue.
- Escalate an unresolved support ticket.
- Send a reminder before an opportunity's expected close date.

### 5.11 Search and data export

**Module:** Search and Export · **Priority:** P0 for module-level search and filters; P1 for unified search

| ID | Requirement |
|---|---|
| SEARCH-001 | Support searching permitted CRM records. |
| SEARCH-002 | Support project, task, and ticket search. |
| SEARCH-003 | Apply tenant and permission constraints to every search. |
| SEARCH-004 | Provide filters and sorting. |
| SEARCH-005 | Use MongoDB indexes appropriate to supported queries. |
| SEARCH-006 | Provide predictable pagination. |
| SEARCH-007 | Export authorized records to CSV. |
| SEARCH-008 | Prevent CSV formula injection in exported user-controlled values. |
| SEARCH-009 | Limit export size and execution cost. |
| SEARCH-010 | Consider background exports for large datasets. |

### 5.12 Settings and customization

**Module:** Settings · **Priority:** P0 for profile and organization settings; P1 for advanced customization

| ID | Requirement |
|---|---|
| SET-001 | Manage organization name and workspace details. |
| SET-002 | Manage profile details. |
| SET-003 | Configure timezone and locale. |
| SET-004 | Configure supported appearance preferences. |
| SET-005 | Manage organization members and teams. |
| SET-006 | Configure notification preferences. |
| SET-007 | Configure module-specific workflow settings. |
| SET-008 | Manage integrations through secure authorization flows. |
| SET-009 | Display usage and configured resource limits. |
| SET-010 | Record important administrative changes. |

### 5.13 Audit logs

**Module:** Audit · **Priority:** P0 for critical security and administrative events

| ID | Requirement |
|---|---|
| AUD-001 | Record important authentication and administrative events. |
| AUD-002 | Record sensitive permission changes. |
| AUD-003 | Record critical business state changes. |
| AUD-004 | Include actor, organization, action, resource, timestamp, and request correlation identifier where appropriate. |
| AUD-005 | Restrict audit-log access. |
| AUD-006 | Avoid logging passwords, access tokens, refresh tokens, or sensitive document contents. |
| AUD-007 | Prevent ordinary users from modifying audit records through application APIs. |
| AUD-008 | Support filtering and pagination. |
| AUD-009 | Define retention and archival policies. |
| AUD-010 | Distinguish successful operations from rejected or failed attempts when relevant. |

---

## 6. Information architecture and route inventory

These routes are the initial navigation blueprint. Exact URLs and naming can be adjusted during architecture review without changing product scope.

### 6.1 Public routes

```
/login
/register
/forgot-password
/reset-password
/verify-email
/accept-invitation
/terms
/privacy
```

### 6.2 Organization selection

```
/workspaces
/workspaces/new
/workspace/:workspaceSlug
```

### 6.3 Main application

```
/workspace/:workspaceSlug/dashboard
/workspace/:workspaceSlug/crm/companies
/workspace/:workspaceSlug/crm/contacts
/workspace/:workspaceSlug/crm/leads
/workspace/:workspaceSlug/crm/opportunities
/workspace/:workspaceSlug/projects
/workspace/:workspaceSlug/projects/:projectId
/workspace/:workspaceSlug/tasks
/workspace/:workspaceSlug/documents
/workspace/:workspaceSlug/support/tickets
/workspace/:workspaceSlug/automations
/workspace/:workspaceSlug/notifications
/workspace/:workspaceSlug/reports
/workspace/:workspaceSlug/activity
```

### 6.4 Settings routes

```
/workspace/:workspaceSlug/settings/general
/workspace/:workspaceSlug/settings/members
/workspace/:workspaceSlug/settings/teams
/workspace/:workspaceSlug/settings/roles
/workspace/:workspaceSlug/settings/notifications
/workspace/:workspaceSlug/settings/integrations
/workspace/:workspaceSlug/settings/security
```

### 6.5 Platform administration

```
/platform
/platform/organizations
/platform/users
/platform/audit
/platform/health
```

Platform routes must use a separate platform-level authorization policy. They must not be accessible merely because a user is an organization owner.

---

## 7. Non-functional requirements

### 7.1 Performance

| ID | Requirement |
|---|---|
| NFR-001 | Common interactive screens should target a p95 API response time of 500 ms or less under the defined baseline workload, excluding external services and intentionally long-running operations. |
| NFR-002 | Initial frontend loading must be measured against agreed Core Web Vitals budgets. |
| NFR-003 | Large tables must use server-side pagination. |
| NFR-004 | Database queries must be reviewed for appropriate index usage. |
| NFR-005 | Expensive operations must have limits, timeouts, or asynchronous execution. |
| NFR-006 | Frontend bundles must be analyzed before production releases. |
| NFR-007 | Performance targets must be validated through load tests rather than assumed. |

### 7.2 Availability and recovery

| ID | Requirement |
|---|---|
| NFR-008 | The application must expose health-check endpoints. |
| NFR-009 | The deployment must document restart and recovery procedures. |
| NFR-010 | Database backups must be automated where supported by the selected hosting plan. |
| NFR-011 | Backup restoration must be tested periodically. |
| NFR-012 | Production incidents must have documented response steps. |
| NFR-013 | Recovery point and recovery time objectives must be selected according to budget and risk. |

An initial learning deployment may be a single instance. High availability is a future improvement, not an unverified promise.

### 7.3 Security

| ID | Requirement |
|---|---|
| NFR-014 | All production application traffic must use HTTPS. |
| NFR-015 | Secrets must not be committed to source control. |
| NFR-016 | Database access must use least-privilege credentials and appropriate network restrictions. |
| NFR-017 | Sensitive operations must be authorized on the backend. |
| NFR-018 | The application must protect against common OWASP application risks. |
| NFR-019 | Authentication and sensitive endpoints must be rate-limited. |
| NFR-020 | Security-sensitive events must be auditable. |
| NFR-021 | Dependencies must be reviewed for known vulnerabilities. |
| NFR-022 | Error responses must not expose stack traces or secrets in production. |

### 7.4 Maintainability

| ID | Requirement |
|---|---|
| NFR-023 | Frontend and backend code must use strict TypeScript. |
| NFR-024 | Business logic must be separated from HTTP controllers and UI components. |
| NFR-025 | Modules must have documented responsibilities. |
| NFR-026 | Shared contracts must not create uncontrolled cross-module coupling. |
| NFR-027 | Significant architectural decisions must be documented. |
| NFR-028 | Automated quality checks must run in CI. |

### 7.5 Accessibility and compatibility

| ID | Requirement |
|---|---|
| NFR-029 | Target WCAG 2.2 AA accessibility for core user workflows. |
| NFR-030 | Support keyboard navigation and visible focus indicators. |
| NFR-031 | Provide meaningful labels and accessible validation messages. |
| NFR-032 | Support modern desktop and mobile browsers. |
| NFR-033 | Display usable responsive layouts at mobile, tablet, and desktop widths. |

### 7.6 Privacy

| ID | Requirement |
|---|---|
| NFR-034 | Collect only data required for defined business functionality. |
| NFR-035 | Restrict access to personal and organization data. |
| NFR-036 | Define data retention and deletion procedures. |
| NFR-037 | Use appropriate safeguards for exported data and shared links. |
| NFR-038 | Document third-party data processing and integration boundaries. |

---

## 8. Proposed technical architecture

> Detailed design lives in [FRONTEND_ARCHITECTURE.md](./FRONTEND_ARCHITECTURE.md), [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md) and [TECH_STACK.md](./TECH_STACK.md).

### 8.1 Architecture style

Use a modular monolith with clear domain boundaries. The initial deployment consists of:

1. React frontend.
2. NestJS API application.
3. MongoDB database.
4. Background worker process when asynchronous jobs are introduced.
5. External object storage and email services when required.
6. Reverse proxy or managed ingress.
7. CI/CD and monitoring infrastructure.

The worker can share the backend codebase while running as a separate process. A microservice architecture is not required for the initial project.

### 8.2 Frontend architecture

**Technology:** React, Vite, TypeScript strict mode, Tailwind CSS v4, React Router, Axios, React Hook Form, Zod (where runtime validation is useful), Lucide React, Vitest, React Testing Library, Playwright.

**Responsibilities:** rendering and interaction; client-side navigation; form state and validation; API requests and error presentation; accessible UI components; client-side permission-aware presentation; loading, empty, and failure states; user preference management.

The frontend must not be trusted to enforce security rules.

### 8.3 Backend architecture

**Technology:** NestJS, TypeScript, MongoDB, Mongoose, Swagger/OpenAPI, Jest and Supertest, a queue system and Redis-compatible infrastructure when asynchronous processing requires them, structured logging and configuration validation.

**Responsibilities:** authentication; authorization; input validation; business rules; data access; transactions and concurrency handling; notifications; background processing; audit events; external service integrations.

### 8.4 Database strategy

- Use MongoDB as the primary application database.
- Use Mongoose schemas and indexes for document modelling and validation.
- Embed documents when their lifecycle and access patterns justify embedding. Use references when entities need independent ownership, querying, or lifecycle management.
- Do not assume every relationship should be embedded or that every relationship requires a reference.
- Evaluate transactions for operations that require multiple document changes to succeed together. Do not use transactions as a substitute for sound schema design.

### 8.5 Storage strategy

Store file metadata in MongoDB and binary content in an appropriate object-storage service (or a controlled filesystem during local development). Production files must not depend on a container's disposable filesystem.

Storage must support: file-size limits; allowed content types; private-by-default access; authorized downloads; deletion and retention policies; upload failure handling; storage cost visibility.

### 8.6 Asynchronous processing

Use a background queue when work must survive request completion or needs retries.

**Potential jobs:** email delivery; notification delivery; workflow execution; SLA checks; scheduled reminders; report exports; file-processing tasks; data-retention cleanup.

Queue selection and infrastructure must be finalized before implementing the first persistent job.

---

## 9. Core data model

Starting inventory for detailed schema design.

| Collection | Purpose |
|---|---|
| `users` | User identity and profile |
| `organizations` | Tenant/workspace records |
| `memberships` | User membership and organization role assignments |
| `invitations` | Pending organization invitations |
| `teams` | Organization teams |
| `team_memberships` | Team membership |
| `sessions` / `refresh_tokens` | Authentication session and token-revocation data, according to the chosen auth strategy |
| `companies` | CRM companies |
| `contacts` | CRM contacts |
| `leads` | Sales leads |
| `opportunities` | Sales opportunities |
| `activities` | CRM calls, meetings, and follow-ups |
| `projects` | Project metadata |
| `project_memberships` | Project-specific access |
| `tasks` | Tasks and subtasks |
| `comments` | Reusable comments with explicit resource associations |
| `documents` | File metadata and storage references |
| `document_versions` | Historical file versions where enabled |
| `tickets` | Support tickets |
| `ticket_replies` | Public replies and internal notes |
| `notifications` | User notification records |
| `workflows` | Workflow definitions |
| `workflow_executions` | Execution state and history |
| `audit_logs` | Security and business audit events |
| `organization_settings` | Tenant configuration |
| `integrations` | Authorized external integration metadata |
| `outbox_events` | Durable events for reliable asynchronous processing, if adopted |

This is not the final schema. Each collection requires field definitions, indexes, lifecycle rules, validation, and query examples before implementation.

### 9.1 Common data rules

Where appropriate, business documents must include: `_id`, `organizationId`, `createdAt`, `updatedAt`, `createdBy`, `updatedBy`, and an explicit lifecycle or archival field when required.

Use these fields consistently where they make sense. System records and immutable audit records may require different rules.

### 9.2 Indexing rules

Define indexes based on actual access patterns. Examples to evaluate:

- Unique normalized email for user identity.
- Organization and membership lookup.
- Organization plus creation date for list queries.
- Organization plus status and update date for task queues.
- Organization plus owner for assigned CRM records.
- Unique invitation token hashes.
- Notification recipient plus read state and creation date.
- Unique business identifiers scoped to the organization where required.

Validate compound index field order using expected query patterns and explain plans.

---

## 10. API standards

### 10.1 API prefix and versioning

Proposed base path: `/api/v1`. The exact versioning strategy must be finalized before API implementation.

### 10.2 API conventions

- Use nouns for resource-oriented paths.
- Use HTTP methods consistently.
- Use correct status codes.
- Validate request bodies, query parameters, and path parameters.
- Apply consistent authentication and authorization.
- Use a standard error response format.
- Document all public API endpoints through OpenAPI.
- Avoid leaking internal database errors.
- Keep pagination and filtering predictable.

### 10.3 Pagination

- For ordinary administrative lists, use limit-based pagination initially with explicit maximum page sizes.
- For high-volume activity feeds, or datasets where offset pagination becomes inefficient, evaluate cursor-based pagination.
- Pagination strategy must reflect the actual query and sorting requirements.

### 10.4 Error format

The API must return a predictable error structure containing:

- HTTP status.
- Stable application error code.
- Safe human-readable message.
- Request correlation ID.
- Field-level validation errors where applicable.

Production responses must not expose internal stack traces.

### 10.5 API documentation

Swagger/OpenAPI must document: authentication requirements; endpoint summaries; DTOs; query parameters; response schemas; status codes; validation errors; pagination behavior; authorization requirements where practical.

---

## 11. Authentication and authorization design

The detailed implementation strategy must be approved before authentication code is written. The design must answer:

1. Which access-token strategy will be used?
2. Where will access and refresh credentials be stored?
3. Will refresh tokens be rotated and revoked?
4. How will logout invalidate credentials?
5. How will organization membership be validated?
6. How will tenant context be established?
7. How will resource ownership be enforced?
8. How will role and permission changes take effect?
9. How will invitation and password-reset tokens expire?
10. How will brute-force attempts be limited?

For a browser application, evaluate secure HttpOnly cookies, CSRF protection, and same-site settings against bearer-token alternatives. Select a strategy based on the final domain and deployment architecture.

Authorization checks must be applied at the service or policy boundary as appropriate, not solely through route guards or frontend visibility rules.

---

## 12. User experience requirements

### 12.1 Application shell

- Responsive sidebar.
- Organization switcher.
- Main navigation.
- Search entry point.
- Notification access.
- User profile menu.
- Breadcrumbs where useful.
- Consistent page titles and actions.
- Responsive mobile navigation.

### 12.2 Design system

Define: color tokens; typography; spacing scale; border radius; component dimensions; focus and disabled states; status and severity colors; light and dark themes where supported; form control conventions; table and card conventions; dialog and drawer patterns.

Tailwind CSS v4 should be configured using its CSS-first approach.

### 12.3 Shared UI components

Button, Input, Textarea, Select, Checkbox, Radio group, Form field, Modal/dialog, Drawer, Dropdown menu, Popover, Tooltip, Tabs, Breadcrumbs, Badge, Avatar, Data table, Pagination, Search field, Filter controls, Date picker, File upload, Toast notification, Confirmation dialog, Skeleton loader, Empty state, Error state, Permission-denied state.

Components must support keyboard interaction, accessible labels, validation, and consistent behavior.

---

## 13. Testing requirements

### 13.1 Frontend tests

- Utility and business-helper unit tests.
- Component rendering and interaction tests.
- Form validation tests.
- API loading and error tests.
- Route protection tests.
- Permission-aware presentation tests.
- Accessibility checks.
- Critical end-to-end journeys.

### 13.2 Backend tests

- Service unit tests.
- Controller and API integration tests.
- DTO validation tests.
- Authentication tests.
- Cross-tenant authorization tests.
- Resource ownership tests.
- Database integration tests.
- Pagination and filtering tests.
- Queue and retry tests.
- Error-handling tests.
- Concurrency and idempotency tests.

### 13.3 End-to-end tests

Initial critical journeys:

1. Registration and email verification.
2. Login and logout.
3. Organization creation.
4. Invitation acceptance.
5. Role assignment.
6. Creating a CRM record.
7. Creating and assigning a task.
8. Uploading and downloading an authorized document.
9. Creating and resolving a support ticket.
10. Receiving and reading a notification.
11. Rejecting unauthorized cross-tenant access.
12. Password reset and recovery.

### 13.4 Quality gates

A change is not complete until applicable lint, type-check, build, and automated tests pass.

Coverage percentages should be measured and reviewed, but coverage alone must not be treated as proof of correctness.

---

## 14. Security requirements

Create a threat model and security checklist before exposing the application publicly. Required areas:

- Password hashing.
- Authentication lifecycle.
- Authorization bypass prevention.
- Tenant isolation.
- NoSQL injection.
- Cross-site scripting.
- Cross-site request forgery where applicable.
- CORS configuration.
- Rate limiting.
- Secure cookie configuration.
- Request size limits.
- File upload validation.
- Secret management.
- Dependency vulnerability review.
- Audit logging.
- Database access controls.
- TLS and HTTPS.
- Secure error handling.
- Backup protection.
- Account and invitation abuse prevention.
- CSV formula injection.
- External webhook signature validation when applicable.

For every high-risk area, define a test that demonstrates the intended protection.

---

## 15. DevOps and deployment requirements

### 15.1 Source control

- Host the source code in GitHub.
- Use a documented branching and pull-request strategy.
- Protect the main branch.
- Require quality checks before merging.
- Maintain a clear commit history.
- Never commit secrets or production environment files.

### 15.2 Local development

- Document prerequisites and setup commands.
- Provide environment-variable examples.
- Provide a reproducible database setup.
- Add Docker Compose when the local architecture requires it.
- Provide seed data for development and tests.
- Ensure developers can reset test data safely.

### 15.3 Continuous integration

GitHub Actions must eventually run: dependency installation; linting and formatting checks; type checking; frontend tests; backend tests; production builds; dependency and secret scanning as configured.

### 15.4 Continuous deployment

The pipeline must support: environment-specific configuration; controlled deployment; database migration or transformation sequencing; health verification; smoke tests; deployment failure reporting; rollback procedures.

### 15.5 Domain and networking

- A purchased domain.
- DNS configuration.
- Root domain and optional `www` handling.
- An application hostname.
- An API hostname if selected.
- HTTPS certificates.
- Secure reverse-proxy configuration where applicable.
- Database connectivity restrictions.
- A documented DNS troubleshooting procedure.

### 15.6 Monitoring and recovery

Application health checks; structured logs; request correlation identifiers; error tracking; uptime monitoring; resource monitoring; backup scheduling; restore verification; incident response documentation; deployment rollback documentation; hosting cost tracking.

### 15.7 Infrastructure as code

Infrastructure as code may be introduced after the initial deployment works. Terraform or a suitable alternative should be used to learn repeatable provisioning, state management, and environment consistency where supported by the chosen hosting provider.

Kubernetes is an optional advanced exercise, not an MVP dependency.

---

## 16. Performance and capacity planning

Establish a baseline workload before setting final performance budgets. The initial test plan should specify:

- Number of simulated organizations.
- Number of active users.
- Request rates.
- Typical list sizes.
- Expected file-upload sizes.
- Background-job volumes.
- Dashboard query frequency.
- Data growth assumptions.

**Measure:** API latency percentiles; database query performance; error rate; CPU and memory usage; frontend bundle size; Core Web Vitals; queue depth and job failure rate.

Optimize only after identifying measurable bottlenecks.

---

## 17. External integrations

**Potential integrations:** email delivery provider; object storage; error tracking; uptime monitoring; optional OAuth identity provider; optional external payment provider; optional email inbox integration.

Each integration must document: purpose; required credentials; permission scope; data exchanged; failure behavior; retry behavior; rate limits; cost and usage limits; secret rotation and revocation.

Integrations must be isolated behind services or adapters where this improves testability and portability.

---

## 18. Project documentation deliverables

The repository `docs/` directory must eventually contain:

1. Product requirements document.
2. Functional requirements and acceptance criteria.
3. User roles and permission matrix.
4. System architecture.
5. Architecture decision records.
6. Frontend route and component inventory.
7. Backend module inventory.
8. Database schema reference.
9. API specification.
10. Authentication and authorization design.
11. Threat model and security checklist.
12. Testing strategy.
13. Local development guide.
14. Environment-variable reference.
15. Domain and deployment guide.
16. CI/CD documentation.
17. Monitoring and incident response guide.
18. Backup and disaster-recovery guide.
19. Cost and hosting comparison.
20. Learning and implementation tracker.

Documentation must be updated when architecture or behavior changes.

---

## 19. Definition of done

A feature is complete only when:

- [ ] Requirements and acceptance criteria are satisfied.
- [ ] Frontend and backend behavior are integrated.
- [ ] Input validation exists on the server.
- [ ] Authorization rules are enforced.
- [ ] Database constraints and indexes are reviewed.
- [ ] Loading, empty, error, and success states are implemented where applicable.
- [ ] Appropriate tests pass.
- [ ] API documentation is updated.
- [ ] Logs and audit events are added where needed.
- [ ] Security and performance implications are reviewed.
- [ ] The feature works in the supported deployment environment.
- [ ] The implementation is documented.
- [ ] Known limitations are recorded.

A working screen or successful API response alone is not sufficient.

---

## 20. Project milestones

| # | Milestone | Deliverables | Exit criterion |
|---|---|---|---|
| 0 | Product and architecture approval | Approved PRD; scope and priorities; user journeys; permission matrix; architecture diagram; database design plan; API conventions; UI route inventory; security and testing strategy; deployment strategy | Major product and architectural decisions are documented |
| 1 | Engineering foundation | GitHub repository; frontend and backend skeletons; strict TypeScript; formatting and linting; environment configuration; initial health endpoint; basic CI workflow; local setup docs | Both applications start reproducibly and quality checks run |
| 2 | Identity and organization foundation | Authentication; account recovery; organizations; memberships; invitations; roles and permissions; tenant isolation tests | Protected multi-tenant access is demonstrably secure |
| 3 | Core business modules | CRM; projects; tasks; comments; basic documents; support tickets | Core workflows work end to end |
| 4 | Operational capabilities | Notifications; audit history; search and filtering; analytics; export; organization settings | Cross-module workflows and reporting operate correctly |
| 5 | Advanced backend | Queue processing; scheduled jobs; workflow automation; retry handling; idempotency; caching where justified; performance measurements | Asynchronous operations survive expected failures and retries |
| 6 | Quality and security | Unit and integration tests; E2E tests; security regression tests; dependency review; load-test baseline; accessibility review | Critical user journeys and security boundaries are verified |
| 7 | Production deployment | Domain; DNS; HTTPS; hosting; production config; Docker; CI/CD; database backups; monitoring; deployment and rollback guides | Production app is reachable over HTTPS and has verified recovery procedures |
| 8 | Advanced engineering | Infrastructure as code; staging environment; advanced observability; capacity planning; advanced workflow engine; optional integration and scaling exercises | Advanced concepts are implemented, measured, documented, and tested |

---

## 21. Success criteria

Nexora OS is a successful learning and portfolio project when:

1. The principal MVP workflows work from UI through API to database.
2. The application supports multiple organizations with verified data isolation.
3. Authentication and authorization are tested independently of the frontend.
4. The UI is responsive, accessible, and consistent.
5. API contracts are documented.
6. Database indexes and query behavior are justified.
7. Critical workflows have automated tests.
8. CI checks are required before deployment.
9. The application runs in the intended production environment.
10. HTTPS, monitoring, backups, and recovery procedures are operational.
11. Infrastructure and recurring costs are documented.
12. Architecture decisions and trade-offs are explainable.
13. The developer can independently diagnose failures, change features, test regressions, and deploy updates.

---

## 22. Open decisions before implementation

These must be recorded in the architecture and infrastructure documents before the relevant implementation starts:

| Decision | Needed by |
|---|---|
| Domain name and registrar | Milestone 7 |
| Frontend and backend hosting provider | Milestone 7 |
| MongoDB hosting option | Milestone 1 (local) / 7 (production) |
| File-storage provider | Milestone 3 (documents) |
| Authentication credential strategy | Milestone 2 |
| Queue and worker infrastructure | Milestone 5 |
| Email provider | Milestone 2 (verification emails) |
| Test and staging environment strategy | Milestone 6 |
| Backup retention and recovery targets | Milestone 7 |
| Final API versioning and error format | Milestone 1 |
| Data retention and organization deletion policies | Milestone 4 |
| Initial performance workload and budgets | Milestone 6 |

These decisions may be finalized at different milestones. They should not delay unrelated planning work.

---

## 23. Final project direction

Nexora OS will be developed as one integrated application, not as a collection of disconnected tutorials.

The primary learning method is to build each feature end to end, understand the underlying concepts, test failure cases, document design decisions, and verify production behavior.

This PRD establishes the product scope. Detailed architecture documents, schema specifications, API contracts, UI blueprints, security plans, and implementation tasks will refine the requirements before coding begins.

**Next required deliverables:** database design specification, authentication and authorization specification, API contract specification, UI and route specification, master development checklist.

**No application feature code should be written until Milestone 0 has been reviewed and approved.**
