# Nexora OS — Frontend Architecture

| Field | Value |
|---|---|
| Document ID | NEX-ARCH-FE-001 |
| Version | 1.0 |
| Status | Draft — review and approve before implementation |
| Application | `client/` |
| Stack | React · Vite · TypeScript (strict) · Tailwind CSS v4 |
| Related | [PRD.md](./PRD.md) · [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md) · [TECH_STACK.md](./TECH_STACK.md) |

---

## 1. Purpose and principles

This document defines how the Nexora OS web client is structured, how it talks to the API, how it manages state, and how its UI system is built.

**Principles**

1. The frontend presents; the backend decides. No security decision is final in the browser.
2. Layer-based structure: `components/<module>`, `pages/<module>`, `services/`, `types/`, with small focused files.
3. Shared UI primitives are built once and reused, not copied per module.
4. Every data-driven screen handles loading, empty, error, success, and permission-denied states.
5. Strict TypeScript; no implicit `any`.
6. Accessibility (WCAG 2.2 AA) is a requirement, not a polish step.
7. Add libraries only when a concrete need appears.

---

## 2. Responsibilities

**The frontend owns:**

- Rendering screens and reusable UI.
- Client-side navigation and route-level access presentation.
- Form state and validation for usability.
- Calling API endpoints and presenting errors.
- Loading, success, empty, error, and permission states.
- User preferences (theme, layout).
- Permission-aware presentation (showing or hiding actions).

**The frontend does not own:**

- Authorization. A hidden button or protected route is not a substitute for backend authorization (IAM-009).
- Secrets of any kind.
- Business rules that must hold when the API is called directly.

---

## 3. Folder structure

Layer-based layout: components, pages, services, hooks and types are grouped by kind, then by module.

```
client/
├── public/
├── src/
│   ├── components/
│   │   ├── ui/                  # Button, Card, Modal, Drawer, Input, Select, StatusBadge, ...
│   │   ├── common/              # PageHeader, EmptyState, ErrorState, PermissionDenied, ...
│   │   ├── layout/
│   │   │   ├── navbar/
│   │   │   └── sidebar/
│   │   ├── command-palette/
│   │   ├── auth/
│   │   ├── workspaces/
│   │   ├── dashboard/
│   │   ├── crm/
│   │   ├── projects/
│   │   ├── tasks/
│   │   ├── documents/
│   │   ├── support/
│   │   ├── inbox/
│   │   ├── automation/
│   │   ├── reports/
│   │   ├── activity/
│   │   ├── settings/
│   │   └── platform/
│   ├── config/
│   │   ├── navigation.ts        # sidebar groups, menus, submenus, required permission
│   │   ├── paths.ts             # route path constants and builders
│   │   └── quickActions.ts      # quick-create (+) menu items
│   ├── context/
│   │   ├── auth/
│   │   │   ├── auth-context.ts
│   │   │   └── AuthProvider.tsx
│   │   ├── workspace/
│   │   │   ├── workspace-context.ts
│   │   │   └── WorkspaceProvider.tsx
│   │   ├── notifications/
│   │   │   ├── notifications-context.ts
│   │   │   └── NotificationsProvider.tsx
│   │   └── sidebar/
│   │       ├── sidebar-context.ts
│   │       └── SidebarProvider.tsx
│   ├── data/                    # static options, enums and mock data for development
│   ├── hooks/                   # shared hooks (usePermission, useDebounce, ...)
│   ├── layouts/
│   │   ├── AppLayout.tsx        # sidebar + navbar + <Outlet />
│   │   ├── AuthLayout.tsx       # public auth pages
│   │   └── PlatformLayout.tsx   # platform admin area
│   ├── lib/
│   │   ├── cn.ts                # className merge helper
│   │   ├── navigation.ts        # active-route matching, permission filtering of menus
│   │   └── api-client.ts        # Axios instance, interceptors, ApiError
│   ├── pages/
│   │   ├── auth/
│   │   ├── workspaces/
│   │   ├── dashboard/
│   │   ├── crm/
│   │   ├── projects/
│   │   ├── tasks/
│   │   ├── documents/
│   │   ├── support/
│   │   ├── inbox/
│   │   ├── automation/
│   │   ├── reports/
│   │   ├── activity/
│   │   ├── settings/
│   │   ├── account/
│   │   ├── platform/
│   │   └── NotFoundPage.tsx
│   ├── routes/
│   │   ├── router.tsx           # createBrowserRouter + AppRouter
│   │   ├── publicRoutes.tsx     # auth + workspace selection (AuthLayout)
│   │   ├── workspaceRoutes.tsx  # /workspace/:workspaceSlug (AppLayout)
│   │   ├── pages.ts             # all routed pages via lazyPage()
│   │   ├── lazyPage.tsx         # React.lazy + Suspense wrapper with skeleton fallback
│   │   └── guards/              # RequireAuth, RequireWorkspace, RequirePlatform
│   ├── services/                # typed API calls per module (tasks.service.ts, ...)
│   ├── types/                   # shared and per-module types (api.ts, task.ts, ...)
│   ├── App.tsx                  # providers + RouterProvider
│   ├── index.css                # Tailwind v4 entry + @theme tokens
│   └── main.tsx
├── e2e/                         # Playwright specs
├── .env.example
├── .gitignore
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

Create folders when they get their first file, not all on day one.

### 3.1 Layout components

```
components/layout/
├── navbar/
│   ├── Navbar.tsx
│   ├── Breadcrumbs.tsx
│   ├── SearchTrigger.tsx        # opens the command palette
│   ├── QuickCreateMenu.tsx      # reads config/quickActions.ts
│   ├── NotificationsMenu.tsx
│   ├── WorkspaceSwitcher.tsx
│   └── UserMenu.tsx
└── sidebar/
    ├── Sidebar.tsx
    ├── SidebarBrand.tsx
    ├── SidebarNav.tsx           # reads config/navigation.ts
    ├── SidebarSection.tsx       # group heading (Home, Sales, Work, ...)
    ├── SidebarGroup.tsx         # menu with submenus
    ├── SidebarLink.tsx
    ├── SidebarIcon.tsx
    ├── SidebarFlyout.tsx        # submenu flyout when collapsed
    ├── SidebarFooter.tsx
    └── sidebarStyles.ts         # shared class strings
```

Sidebar menus are data-driven from `config/navigation.ts` (see [SIDEBAR_MENU.md](./SIDEBAR_MENU.md)). Each item declares a `workspaceSegments` path, icon and (later) required permission. `lib/navigation.ts` derives breadcrumbs and page titles from the same config and will filter items by permission once auth exists.

### 3.1a Route tree and Outlet

```
/                                  → redirect to default workspace (until auth)
AuthLayout ─ <Outlet/>             errorElement: RouteErrorPage
  /login · /register · /forgot-password · /workspaces · /workspaces/new
/workspace/:workspaceSlug          AppLayout (Sidebar + Navbar + <main><Outlet/></main>)
  └─ (pathless)                    errorElement: RouteErrorPage  ← errors stay inside the shell
       index → dashboard
       every workspaceSegments path → page (lazy, Suspense inside the Outlet)
       *     → NotFound
AuthLayout
  *                                → NotFound
```

- Pages are lazy-loaded through `routes/pages.ts`; the Suspense fallback (`PageSkeleton`) renders inside the Outlet, so the shell never unmounts.
- `main` is the scroll container and resets to the top on navigation.

### 3.2 Inside a module

```
components/tasks/
├── TaskTable.tsx
├── TaskKanban.tsx
├── TaskForm.tsx
├── TaskFilters.tsx
└── TaskDetailDrawer.tsx

pages/tasks/
├── TasksPage.tsx               # coordinator: state, data fetching, layout
└── TaskDetailPage.tsx

services/tasks.service.ts       # typed calls to /tasks endpoints
hooks/useTasks.ts               # data hook used by the page (if shared)
types/task.ts
```

**Rules**

- No file over ~150–200 lines. Split into subcomponents in `components/<module>/`.
- A page only coordinates state, layout and data fetching. It renders module components and holds no large JSX blocks.
- Pages never call Axios directly. They go through `services/` (or a hook that uses it).
- Module components use primitives from `components/ui/` and `components/common/`. They never duplicate them.
- Module components don't import from another module's component folder. Promote shared pieces to `components/common/`.
- Path alias `@/` points to `src/`.

---

## 4. Application initialization

1. Load public runtime/build configuration.
2. Initialize global providers (theme, toast, session).
3. Resolve authentication state (attempt silent refresh to obtain an access token).
4. Fetch the user's available organizations.
5. Resolve the active organization from the URL slug when present.
6. Render the authenticated or unauthenticated route tree.

A saved organization slug or browser state never proves the user still has access. The backend confirms membership on every request; the frontend reacts to `403`/`404` by redirecting to `/workspaces`.

---

## 5. Routing

Four route groups, each with its own layout and guard:

| Group | Guard | Layout |
|---|---|---|
| Public | Redirect to `/workspaces` if already authenticated (auth pages only) | Auth layout |
| Authenticated (no workspace) | Must be authenticated | Minimal layout |
| Workspace-scoped | Authenticated + active membership in `:workspaceSlug` | App shell |
| Platform | Authenticated + platform-level permission | Platform shell |

### 5.1 Route inventory

**Public**

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

**Organization selection**

```
/workspaces
/workspaces/new
/workspace/:workspaceSlug            → redirects to dashboard
```

**Workspace**

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

**Settings**

```
/workspace/:workspaceSlug/settings/general
/workspace/:workspaceSlug/settings/members
/workspace/:workspaceSlug/settings/teams
/workspace/:workspaceSlug/settings/roles
/workspace/:workspaceSlug/settings/notifications
/workspace/:workspaceSlug/settings/integrations
/workspace/:workspaceSlug/settings/security
```

**Platform**

```
/platform
/platform/organizations
/platform/users
/platform/audit
/platform/health
```

Tenant owners and administrators never gain access to `/platform` by virtue of their tenant role.

### 5.2 Route rules

- Lazy-load every page through `routes/lazyPage.tsx` to keep the initial bundle small.
- Route paths come from `config/paths.ts`; components never hard-code URLs.
- Each route sets a document title.
- Unknown routes render a 404 page; forbidden routes render a permission-denied state, not a blank page.
- Unauthenticated access to a protected route redirects to `/login?redirect=<path>`; the redirect target is validated to be an internal path.

---

## 6. API client

One centralized Axios instance in `src/lib/api-client.ts`.

**Responsibilities**

- Base URL from `VITE_API_BASE_URL` (default `/api/v1`, same-origin).
- Attach the in-memory access token as `Authorization: Bearer <token>`.
- Send cookies (`withCredentials`) for refresh endpoints.
- On `401`, run one refresh attempt, then replay the original request. Concurrent `401`s share a single in-flight refresh promise so parallel requests do not trigger multiple rotations.
- If refresh fails, clear session state and redirect to `/login`.
- Convert every error into one typed `ApiError` shape matching the backend error format:

```ts
interface ApiError {
  statusCode: number;
  code: string;            // stable machine-readable code, e.g. VALIDATION_ERROR
  message: string;         // safe human-readable message
  details?: FieldError[];  // field-level validation errors
  requestId?: string;      // correlation ID for support/debugging
}
```

**Retry rules**

- Safe retries for idempotent `GET` requests on network failure only.
- Never auto-retry mutations. A timeout can occur after the server has completed the operation. Mutations that need safe retry send an idempotency key.

---

## 7. State management

| Kind of state | Where it lives |
|---|---|
| Local UI interaction (open/closed, input drafts) | Component state |
| Session (user, access token), theme | React Context |
| Active organization | Derived from the URL slug + organizations list |
| Server data (lists, records) | `services/` + hooks |
| Sidebar collapsed/expanded, notifications | `context/sidebar`, `context/notifications` |
| Filters, sort, pagination, active tab | URL search params (shareable, survives refresh) |
| Form state | React Hook Form |

**Rules**

- The access token lives in memory only. Never in `localStorage` or `sessionStorage`.
- Do not put every field in global state.
- Start with plain hooks over the API layer. Adopt a server-state library (e.g. TanStack Query) only when caching, deduplication, invalidation, and background refetch needs justify it; record that as an ADR.
- After mutations, refetch or update the affected lists explicitly.

---

## 8. Error, loading, and empty handling

Every data-driven view implements these states:

| State | Component | Notes |
|---|---|---|
| Loading | `Skeleton` | Match the final layout shape to avoid layout shift |
| Empty | `EmptyState` | Explain what goes here and offer the primary action if permitted |
| Error | `ErrorState` | Safe message + retry + `requestId` for support |
| Permission denied | `PermissionDenied` | For `403`; do not leak whether the resource exists |
| Session expired | Redirect to login | Preserve the intended path |
| Partial data | Inline alert | Dashboard widgets fail independently (DASH-007) |

### Error codes and pages

All error screens come from one config: `config/errorCodes.ts`.

| Key | Status | Title | Actions |
|---|---|---|---|
| BAD_REQUEST | 400 | Bad request | Back, Home |
| UNAUTHORIZED | 401 | Sign in required | Sign in |
| FORBIDDEN | 403 | Access denied | Back, Home |
| NOT_FOUND | 404 | Page not found | Back, Home |
| REQUEST_TIMEOUT | 408 | Request timed out | Retry, Home |
| CONFLICT | 409 | Conflict | Reload, Back |
| GONE | 410 | No longer available | Back, Home |
| PAYLOAD_TOO_LARGE | 413 | File too large | Back |
| UNPROCESSABLE | 422 | Couldn't complete the request | Back |
| TOO_MANY_REQUESTS | 429 | Too many requests | Retry |
| SERVER_ERROR | 500 | Something went wrong | Retry, Home |
| BAD_GATEWAY | 502 | Bad gateway | Retry |
| SERVICE_UNAVAILABLE | 503 | Service unavailable | Retry |
| GATEWAY_TIMEOUT | 504 | Gateway timeout | Retry |
| NETWORK_ERROR | — | You're offline | Retry |
| CHUNK_LOAD_ERROR | — | New version available | Reload |
| UNKNOWN | — | Something went wrong | Reload, Home |

Unmapped statuses fall back to 400 (4xx) or 500 (5xx). `lib/errors.ts → resolveError()` captures anything thrown (route responses, `Response`, `AppError`, backend error objects, network and stale-chunk errors) and `components/common/ErrorState.tsx` renders it. Pages: `pages/errors/RouteErrorPage.tsx` (route `errorElement`), `pages/errors/ErrorPage.tsx` (`/error/:status`), `pages/errors/NotFoundPage.tsx`.

Form errors:

- Map `details[]` from `VALIDATION_ERROR` responses onto form fields.
- Field errors are linked to inputs with `aria-describedby` and announced to screen readers.
- Global form errors appear above the submit button.

Mutation feedback uses toasts for success and inline alerts for failures that need user action.

---

## 9. Permission-aware UI

- After resolving the active organization, the client fetches the user's effective permissions for that organization (e.g. `GET /api/v1/organizations/:id/me`).
- A `usePermission('tasks.create')` hook and `<Can permission="...">` wrapper hide or disable actions.
- Sidebar items are filtered by permission (IAM-008).
- Permissions are refetched on organization switch and when the API returns `403` for an action the UI thought was allowed.
- This is presentation only. The API enforces every rule.

---

## 10. Application shell and layout

```
┌──────────────────────────────────────────────────────────┐
│ Topbar: org switcher · search · notifications · profile  │
├────────────┬─────────────────────────────────────────────┤
│ Sidebar    │ PageHeader: breadcrumbs · title · actions   │
│            ├─────────────────────────────────────────────┤
│ Dashboard  │                                             │
│ CRM        │  Page content                               │
│ Projects   │                                             │
│ Tasks      │                                             │
│ Documents  │                                             │
│ Support    │                                             │
│ Automations│                                             │
│ Reports    │                                             │
│ Settings   │                                             │
└────────────┴─────────────────────────────────────────────┘
```

- Sidebar collapses to icons on tablet and becomes a drawer on mobile.
- Organization switcher lists only organizations with active membership.
- Consistent `PageHeader` across all pages: breadcrumbs, title, primary action.
- Skip-to-content link and landmark regions (`header`, `nav`, `main`).

---

## 11. Design system

### 11.1 Tailwind CSS v4 (CSS-first)

Theme tokens are defined in CSS with `@theme`, not in a JS config file:

```css
/* src/index.css */
@import "tailwindcss";

@theme {
  --color-brand-500: oklch(0.6 0.15 255);
  --color-surface: oklch(0.99 0 0);
  --color-text: oklch(0.2 0 0);
  --color-success: oklch(0.65 0.15 150);
  --color-warning: oklch(0.75 0.15 80);
  --color-danger: oklch(0.6 0.2 25);
  --radius-md: 0.5rem;
  --font-sans: "Inter", system-ui, sans-serif;
}
```

Values above are placeholders; final tokens are chosen in the UI specification.

### 11.2 Tokens to define

- Color: brand, neutral surfaces, text, borders, status (success, warning, danger, info), priority and severity.
- Typography: font family, size scale, weights, line heights.
- Spacing scale.
- Border radius.
- Component dimensions (input height, button sizes, row height).
- Focus ring and disabled states.
- Light and dark themes (dark via a `data-theme` attribute and `prefers-color-scheme`).
- Radius: `rounded-md` on every element (`rounded-full` only for avatars and dots).
- No shadows: surfaces are separated with flat borders (`border-slate-200`) and subtle background contrast.

See [CODING_STANDARDS.md](./CODING_STANDARDS.md).

### 11.3 Shared component inventory

| Group | Components |
|---|---|
| Actions | Button, IconButton, DropdownMenu |
| Inputs | Input, PasswordInput, Textarea, Select, Checkbox, RadioGroup, DatePicker, SearchField, FileUpload |
| Forms | FormField (label + control + hint + error) |
| Overlays | Dialog, ConfirmDialog, Drawer, Popover, Tooltip |
| Navigation | Tabs, Breadcrumbs, Pagination, Sidebar |
| Data display | DataTable (sorting, selection), Badge, Avatar, Card, Kanban board |
| Filters | FilterBar, FilterChips |
| Feedback | Toast, Alert, Skeleton, EmptyState, ErrorState, PermissionDenied, ProgressBar |

All components must support keyboard interaction, visible focus, accessible labels, and disabled/loading states. Prefer accessible headless primitives over hand-rolled focus management for dialogs, menus, and popovers.

---

## 12. Forms

- React Hook Form for anything beyond two fields.
- Client validation mirrors backend rules for usability; the server remains authoritative.
- Use Zod schemas where they materially help (shared shape + type inference); not mandatory for every form.
- Disable submit while pending; prevent double submission.
- Show server field errors in place.

---

## 13. Accessibility and responsiveness

- Target WCAG 2.2 AA for core workflows.
- Semantic HTML first; ARIA only where semantics are insufficient.
- Visible focus indicators on every interactive element.
- Colour is never the only carrier of meaning (status badges include text).
- Minimum touch target 24×24 CSS px; 44×44 preferred on mobile.
- Layouts verified at mobile (≥ 360 px), tablet, and desktop widths.
- Data tables scroll horizontally inside their container on small screens or switch to a card list.

---

## 14. Environment variables

Only public configuration belongs in the frontend bundle:

```
VITE_API_BASE_URL=/api/v1
```

Never place database credentials, private API keys, signing secrets, refresh tokens, or storage credentials in `VITE_*` variables. Anything compiled into the bundle is public.

---

## 15. Same-origin deployment

Preferred: the reverse proxy serves the built frontend and proxies `/api/*` to the API on the same origin. This simplifies cookies and avoids CORS. In development, Vite's `server.proxy` forwards `/api` to the local NestJS server.

```ts
// vite.config.ts (illustrative)
server: {
  proxy: { '/api': 'http://localhost:3000' },
}
```

---

## 16. Testing

| Level | Tool | What |
|---|---|---|
| Unit | Vitest | Utilities, formatters, permission helpers |
| Component | Vitest + React Testing Library | Rendering, interaction, form validation, loading/error states |
| Route | Vitest + RTL | Guards redirect correctly; permission-aware navigation |
| Accessibility | axe (via RTL or Playwright) | Automated a11y checks on key screens |
| End-to-end | Playwright | Critical journeys from PRD § 13.3 |

- Mock HTTP at the network boundary (e.g. MSW), not by mocking internal hooks.
- Tests query by role and label, the way users find elements.
- E2E runs against a seeded test backend, never production.

---

## 17. Performance

- Route-level code splitting.
- Server-side pagination for all large tables (NFR-003).
- Debounce search inputs.
- Analyze the production bundle before releases (NFR-006).
- Measure Core Web Vitals against agreed budgets (NFR-002).

---

## 18. Open frontend decisions

| Decision | Needed by |
|---|---|
| Headless component primitives library (or build in-house) | M1 |
| Server-state library adoption | When caching needs appear |
| Final design tokens and dark-mode scope | UI specification |
| Date handling library | M3 |
| Charting library for dashboard and reports | M4 |
| HTTP mocking approach for tests (MSW or alternative) | M1 |
