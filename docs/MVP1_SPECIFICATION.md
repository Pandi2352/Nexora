# Nexora OS — MVP 1: Specification (Features, Menus, Modules & Collections)

**Version:** 1.1 (Comprehensive Baseline)  
**Phase:** MVP 1 — Foundation  
**Reference Documents:** [`docs/MVP1_FOUNDATION.md`](./MVP1_FOUNDATION.md) · [`docs/PRD.md`](./PRD.md) · [`docs/SIDEBAR_MENU.md`](./SIDEBAR_MENU.md) · [`docs/CODING_STANDARDS.md`](./CODING_STANDARDS.md) · [`docs/FRONTEND_ARCHITECTURE.md`](./FRONTEND_ARCHITECTURE.md) · [`docs/BACKEND_ARCHITECTURE.md`](./BACKEND_ARCHITECTURE.md)

---

## 1. Complete MVP 1 Features Inventory

MVP 1 establishes the production-grade foundation of Nexora OS. Every feature below is strictly scoped, tenant-isolated, and operates end-to-end from database to UI.

### 1.1 Authentication & Security (Identity & Access)
- **Account Registration & Password Policy:**
  - Registration with `name`, `email`, and `password`.
  - Password strength validation: minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number, and 1 special character.
  - Secure password hashing using **Argon2id** (with per-user cryptographically random salt).
  - Rate-limited registration endpoint to mitigate automated account creation abuse.
- **Email Verification Lifecycle:**
  - Cryptographically random single-use verification token generated upon registration.
  - Verification link with expiration (default: 24 hours).
  - Resend verification email endpoint with throttling (e.g., maximum 3 requests per 15 minutes).
  - Account flag `isEmailVerified: boolean`.
- **Login, Sessions & Token Architecture:**
  - Login via email and password with generic error response (`"Invalid email or password"`) to eliminate email enumeration vulnerabilities.
  - Global brute-force and rate-limiting protection on auth endpoints (`@nestjs/throttler`).
  - **Short-lived Access Token:** JWT format, kept strictly in browser memory (never persisted in `localStorage` or `sessionStorage`), validity ~15 minutes.
  - **Rotating Refresh Token:** Cryptographically random 64-character token stored in an `HttpOnly`, `SameSite=Strict`, `Secure` cookie, validity ~30 days.
  - **Session Tracking & Family Rotation:**
    - Refresh tokens are hashed (SHA-256) and tracked in the `sessions` collection.
    - On every refresh call (`POST /auth/refresh`), a new refresh token is issued and the previous one is marked rotated.
    - **Reuse Detection:** If an already-rotated token is received, the entire session family is flagged compromised and all sessions for the user are immediately revoked.
  - **Silent Token Refresh:** Client executes a silent refresh on initial application mount / page reload to re-acquire access token seamlessly.
  - **Axios Token Refresh Interceptor:** Client request interceptor handles 401 errors by queuing concurrent requests while a single refresh handshake executes, preventing refresh-token race conditions.
  - **Logout:** Single device logout revokes current session record and clears the cookie; "Logout from all devices" revokes all user sessions.
- **Password Recovery & Changes:**
  - Forgot password flow issuing single-use, time-limited reset tokens (default: 1 hour).
  - Reset password flow validates token, hashes new password, marks token used, and **immediately revokes all active sessions** across all devices.
  - Change password from account settings requires verifying the existing current password.
- **Account Lifecycle Checks:**
  - Immediate authentication block for suspended or disabled user accounts.
  - Auth route guards (`RequireAuth`) preserving destination paths in location state to redirect users back to their intended deep-link after login.

### 1.2 User Profile & Personal Account Settings
- **Profile Information:** View and update display name, avatar URL, timezone, and locale.
- **Email Change:** Initiates a verification handshake sent to the requested new email address before updating identity.
- **Active Sessions Management:**
  - Interactive table/cards displaying all active sessions.
  - Shows client user-agent (parsed OS/browser), IP address, current session badge, and last active timestamp.
  - Capability to revoke any individual session or terminate all other sessions.
- **Theme Preferences:** Light, Dark, or System mode synchronization.

### 1.3 Multi-Tenant Workspaces (Organizations)
- **Workspace Creation & Ownership:**
  - Create workspace with `name` and URL-safe `slug`.
  - Automatic slug normalization (lowercase, kebab-cased, trimmed) and global uniqueness check.
  - Workspace creator is automatically provisioned as the initial **Owner**.
- **Workspace Switching & Memory:**
  - User can belong to multiple workspaces.
  - Dedicated workspace selector page (`/workspaces`) reached post-login or from the user menu.
  - Remembers last-used workspace in local user preference for automated default routing.
- **Tenant Isolation & Security Guards:**
  - Route parameter `workspaceSlug` is resolved via backend `TenantGuard`.
  - Requests verify active membership (`status: 'active'`) and that the organization is not suspended.
  - Cross-tenant data access attempts return `404 Not Found` (never `403`), preventing foreign ID probing.
  - Client-supplied `organizationId` in request bodies is strictly ignored; tenant context is derived from the validated server session.
- **Workspace Administration:**
  - General settings: update organization name, logo URL, default timezone, default locale.
  - Slug updates (restricted to Owner / Admin).
  - Ownership transfer: Owner selects another active member to become the new Owner.
  - Leave workspace: allowed for any member except the sole remaining Owner.
  - Workspace soft-deletion: soft-delete with timestamp and retention window (Owner only).
  - Suspension: platform administrator capability to freeze tenant access instantly.

### 1.4 Memberships & Invitations Lifecycle
- **Member Invitations:**
  - Invite by email with pre-assigned role (`Owner`, `Admin`, `Manager`, `Member`, `Support Agent`).
  - Cryptographically random invitation token with expiration (default: 7 days) and single-use validation.
  - Email notification dispatched with accept link (`/accept-invitation?token=...`).
  - Resend pending invitation (refreshes expiration) and revoke pending invitation.
  - Invitation email match validation: logged-in user must match the invitee's email.
- **Acceptance Workflows:**
  - Existing registered user: accepts invite and is directly added to workspace memberships.
  - New user: guided through registration + verification during the invitation acceptance flow.
- **Member Directory & Administration:**
  - Paginated member table with name, email, avatar, role, status (`active`, `suspended`), and join date.
  - Search members by name or email; filter by role and status.
  - Change member role (requester cannot assign a role higher than their own; cannot demote the last Owner).
  - Suspend and reactivate members.
  - Remove member from workspace (automatically cascades to removing team memberships within that workspace).

### 1.5 Teams Management
- **Team Organization:**
  - Create team with `name` and optional `description`.
  - Edit team details and delete team.
  - Assign a designated Team Lead (`leadUserId`).
- **Team Membership Linkage:**
  - Add and remove members to/from teams.
  - Many-to-many relationship: members can belong to zero, one, or multiple teams.
  - Team member view showing all associated members with team lead indicators.

### 1.6 Roles & Permission Matrix (RBAC)
- **Predefined Roles:**
  1. **Owner:** Unrestricted workspace control, billing, ownership transfer, organization deletion.
  2. **Admin:** Manage workspace settings, members, teams, roles, security, and audit logs.
  3. **Manager:** Supervise operational records, teams, and assignments.
  4. **Member:** Access permitted workspace resources, collaborate on assigned items.
  5. **Support Agent:** Dedicated support ticket queue handling and customer resolution.
- **Permission Model:**
  - Explicit granular permission keys (e.g., `organization.update`, `members.invite`, `members.manage`, `teams.manage`, `audit.read`).
  - Role-to-permissions mapping resolved dynamically per organization membership.
  - Permissions resolved fresh on each request or cached briefly with cache eviction on role change.
  - Backend `@RequirePermission(...)` decorator enforced by `PermissionGuard`.
  - Current permissions exposed via `GET /me` or workspace context endpoint.
  - Frontend `usePermission` hook and `<Can>` authorization wrapper component.
  - Read-only Roles & Permissions viewer displaying the permission matrix.
  - Dedicated **403 Permission Denied** screen when unauthorized actions or pages are visited.

### 1.7 Security Audit Trail
- **Comprehensive Event Logging:**
  - Auth events: register, login, failed login, logout, password change, password reset.
  - Workspace events: organization created, settings modified, slug changed, ownership transferred.
  - Membership events: invite dispatched, invite accepted, invite revoked, member role changed, member suspended, member removed.
  - Team events: team created, team updated, team deleted, team lead assigned.
- **Immutability & Contextual Attributes:**
  - Every entry records: `actorId`, `organizationId` (or null for platform), `action`, `targetType`, `targetId`, `metadata` (sanitized changes), `ipAddress`, `userAgent`, `requestId`, `status` (`success` | `failure`), and timestamp.
  - Strict exclusion of secrets, tokens, and passwords from logs.
- **Audit Viewer UI:**
  - Administrative audit table with date range picker, actor search, action filter, and paginated browsing.
  - Audit details slide-over drawer showing sanitized metadata diffs and request IDs.

### 1.8 In-App Notifications (MVP 1 Core Operational Baseline)
- Topbar notifications bell with unread badge counter.
- Interactive notification dropdown panel showing recent workspace notifications (e.g., "Invited to workspace", "Role updated").
- "Mark as read" and "Mark all as read" actions.
- Inbox Notifications page (`/inbox/notifications`) for complete notification history.

### 1.9 Email Service Adapter
- Provider-agnostic mailer adapter:
  - Development mode: local console logging / mock SMTP catcher.
  - Production mode: SMTP / transactional email provider adapter.
- Responsive HTML and plain-text templates for:
  1. Account Email Verification.
  2. Password Reset Request.
  3. Workspace Member Invitation.
- Asynchronous, fire-and-forget dispatching to prevent outbound network latency from blocking API responses.

### 1.10 UI Components, Feedback & Error Handling
- **Toast Notifications:** Global toast system (success, error, warning, info) for clear action confirmations.
- **Confirmation Modals:** Accessible dialogs with double-confirmation for destructive operations (Delete workspace, Remove member, Revoke invite, Revoke session).
- **Comprehensive UI States:** Loading skeletons, empty states (`EmptyState`), permission denied (`PermissionDenied`), and error states (`ErrorState`).
- **Standardized Error Responses:** Centralized error codes ([`errorCodes.ts`](file:///d:/mern/nexora/client/src/config/errorCodes.ts)) displaying correlation `requestId` for troubleshooting.

### 1.11 Platform Administration (Internal Operator Area)
- Distinct `/platform` area accessible exclusively to global platform administrators (`isPlatformAdmin: true`).
- Platform Overview: tenant count, active users count, system uptime metrics.
- Global Organizations: list all tenants, inspect owner, suspend or reactivate workspaces.
- Global Users: list all platform users, suspend, reactivate, or disable accounts.
- Platform Audit Log: system-level administrative events.
- System Health: real-time live/ready status for server process and MongoDB cluster.

---

## 2. Complete Menus & Submenus Inventory

### 2.1 Public & Authentication Routes (Outside Workspace Shell)
| Menu / View | Route | Access | Key Components & Purpose |
|---|---|---|---|
| Login | `/login` | Public | Email & password form, redirect to intended URL |
| Register | `/register` | Public | Name, email, password strength meter, TOS acceptance |
| Verify Email | `/verify-email` | Public | Token validation handler, resend verification button |
| Forgot Password | `/forgot-password` | Public | Email input for password reset link |
| Reset Password | `/reset-password` | Public | New password form via reset token |
| Accept Invitation | `/accept-invitation` | Public / Auth | Validates invite token, accepts membership or triggers sign-up |
| Workspaces Directory | `/workspaces` | Authenticated | List all user workspaces, switch workspace, last-used badge |
| Create Workspace | `/workspaces/new` | Authenticated | Organization name, auto-slug generator, creation submit |

### 2.2 Topbar Navbar Controls (Workspace Context)
| Control | Component | Purpose & Interaction |
|---|---|---|
| Sidebar Collapse Toggle | `SidebarToggle` | Leftmost item: collapses/expands desktop icon rail (`Ctrl+B`); opens mobile drawer |
| Workspace Switcher | `WorkspaceSwitcher` / `UserMenu` | Current workspace name + badge; dropdown to switch tenant or jump to `/workspaces` |
| Global Search Launcher | `SearchTrigger` | `Ctrl+K` command palette launcher for quick navigation |
| Quick Create (+) | `QuickCreateMenu` | Fast creation dropdown (New Member Invite, New Team) |
| Notifications Bell | `NotificationsMenu` | Badge counter, recent alerts dropdown, "Mark all as read" |
| User Profile Menu | `UserMenu` | Avatar, user name & role chip; links to `/account/*`, workspace settings, logout |

### 2.3 Workspace Sidebar Navigation (`/workspace/:workspaceSlug`)
Base layout: [`AppLayout.tsx`](file:///d:/mern/nexora/client/src/layouts/AppLayout.tsx) with full-width outlet.

| Section | Menu | Submenu | Route | MVP 1 Implementation Status |
|---|---|---|---|---|
| **Home** | Dashboard | — | `/workspace/:slug/dashboard` | **Active MVP 1:** Workspace overview & welcome KPI cards |
| | My Work | — | `/workspace/:slug/my-work` | Reserved / Phase 1 |
| | Inbox | Notifications | `/workspace/:slug/inbox/notifications` | **Active MVP 1:** Notification center & filters |
| | Calendar | — | `/workspace/:slug/calendar` | Reserved / Phase 1 |
| **Sales** | CRM | Companies | `/workspace/:slug/crm/companies` | Route placeholder (Core MVP) |
| | | Contacts | `/workspace/:slug/crm/contacts` | Route placeholder (Core MVP) |
| | | Leads | `/workspace/:slug/crm/leads` | Route placeholder (Core MVP) |
| | | Opportunities | `/workspace/:slug/crm/opportunities` | Route placeholder (Core MVP) |
| | | Activities | `/workspace/:slug/crm/activities` | Route placeholder (Core MVP) |
| **Work** | Projects | — | `/workspace/:slug/projects` | Route placeholder (Core MVP) |
| | Tasks | — | `/workspace/:slug/tasks` | Route placeholder (Core MVP) |
| **Content** | Documents | — | `/workspace/:slug/documents` | Route placeholder (Core MVP) |
| **Service** | Support | Tickets | `/workspace/:slug/support/tickets` | Route placeholder (Core MVP) |
| **Operations**| Automations | — | `/workspace/:slug/automations` | Reserved / Phase 1 |
| | Reports | — | `/workspace/:slug/reports` | Reserved / Phase 1 |
| **Admin** | **User Management** | Members | `/workspace/:slug/users/members` | **Active MVP 1:** Member directory, role modification, suspend/remove |
| | | Invitations | `/workspace/:slug/users/invitations` | **Active MVP 1:** Pending invites, resend/revoke, invite modal |
| | | Teams | `/workspace/:slug/users/teams` | **Active MVP 1:** Team management, team leads, member assignment |
| | | Roles & Permissions | `/workspace/:slug/users/roles` | **Active MVP 1:** Read-only system permission matrix |
| | | Security & Sessions | `/workspace/:slug/users/security` | **Active MVP 1:** Member session controls, workspace security policies |
| | **Settings** | General | `/workspace/:slug/settings/general` | **Active MVP 1:** Workspace name, slug, logo, timezone, delete org |
| | | Notifications | `/workspace/:slug/settings/notifications` | Reserved / Phase 1 |
| | | Integrations | `/workspace/:slug/settings/integrations` | Reserved / Phase 1 |

### 2.4 Personal Account Settings (`/account`)
| Menu | Route | Features & View |
|---|---|---|
| Profile | `/account/profile` | Name, avatar upload/URL, timezone, locale settings |
| Password | `/account/password` | Current password verification, new password submission |
| Sessions | `/account/sessions` | Active session devices, IP address, revocation buttons |

### 2.5 Platform Admin Area (`/platform`)
| Menu | Route | Features & View |
|---|---|---|
| Overview | `/platform` | High-level metrics: total tenants, active users, system status |
| Organizations | `/platform/organizations` | Global tenant table, suspend / reactivate buttons |
| Users | `/platform/users` | Global user directory, status toggle (`active`, `suspended`, `disabled`) |
| Platform Audit | `/platform/audit` | System-wide audit log viewer |
| Health Probes | `/platform/health` | Live and readiness probe status |

---

## 3. Module Boundaries (Backend & Frontend)

### 3.1 Backend Modules (`server/src/modules/`)
Adhering to strict file limits (< 200 lines per file) and layer isolation:

```
server/src/modules/
├── auth/                       # Authentication, JWT, Refresh Tokens, Password Hashing
│   ├── auth.controller.ts      # Endpoints: login, register, refresh, logout, reset
│   ├── auth.service.ts         # Business logic, token issuing, session coordination
│   ├── guards/                 # JwtAuthGuard, LocalAuthGuard, RefreshTokenGuard
│   ├── strategies/             # JwtStrategy, LocalStrategy, RefreshTokenStrategy
│   └── dto/                    # LoginDto, RegisterDto, ForgotPasswordDto, ResetPasswordDto
├── users/                      # User entity, profile settings, platform user admin
│   ├── users.controller.ts     # Profile and user update endpoints
│   ├── users.service.ts        # User query and update logic
│   ├── users.repository.ts     # User database operations
│   └── schemas/user.schema.ts  # Global user schema (UUID _id)
├── sessions/                   # Session tracking and rotation
│   ├── sessions.service.ts     # Issue, rotate, revoke sessions, reuse detection
│   ├── sessions.repository.ts  # Session collection operations
│   └── schemas/session.schema.ts
├── organizations/              # Organization / Tenant management
│   ├── organizations.controller.ts # Org CRUD, slug verification, settings
│   ├── organizations.service.ts    # Creation with owner assignment, slug logic
│   ├── organizations.repository.ts # Org queries and updates
│   └── schemas/organization.schema.ts
├── memberships/                # Tenant memberships & access
│   ├── memberships.controller.ts   # Member directory, role changes, member removal
│   ├── memberships.service.ts      # Membership management, last-owner check
│   ├── memberships.repository.ts   # Tenant-scoped queries ({ organizationId })
│   ├── guards/                     # TenantGuard (resolves org context), PermissionGuard
│   └── schemas/membership.schema.ts
├── invitations/                # Workspace member invitations
│   ├── invitations.controller.ts   # Create invite, list pending, resend, revoke, accept
│   ├── invitations.service.ts      # Cryptographic token creation, invite acceptance
│   └── schemas/invitation.schema.ts
├── teams/                      # Teams and team memberships
│   ├── teams.controller.ts         # Team CRUD, add/remove team members
│   ├── teams.service.ts            # Team management and lead assignment
│   ├── schemas/team.schema.ts      # Team entity
│   └── schemas/team-membership.schema.ts # Join schema
├── rbac/                       # Roles and Permission Matrix
│   ├── rbac.service.ts             # Predefined roles, permission lookup
│   ├── decorators/                 # @RequirePermission(...), @CurrentUser(), @Public()
│   └── schemas/role.schema.ts      # Role definitions and permissions array
├── audit/                      # Security and administrative audit trail
│   ├── audit.controller.ts         # Audit log querying with filters and pagination
│   ├── audit.service.ts            # Async event logger and query engine
│   └── schemas/audit-log.schema.ts # Immutable log schema
├── notifications/              # In-app notifications
│   ├── notifications.controller.ts # Get notifications, mark read, mark all read
│   ├── notifications.service.ts    # Dispatch alerts, query unread
│   └── schemas/notification.schema.ts
├── mailer/                     # Email adapter and HTML templates
│   ├── mailer.service.ts           # Verification, reset, invitation email sender
│   └── adapters/                   # ConsoleAdapter (dev), SmtpAdapter (prod)
└── health/                     # System liveness & readiness (already implemented)
    ├── health.controller.ts        # /health/live, /health/ready
    └── health.service.ts           # MongoDB connection probe
```

### 3.2 Frontend Architecture (`client/src/`)
Structured by feature domains; pages act as coordinators rendering modular subcomponents:

```
client/src/
├── components/
│   ├── ui/                     # Primitives: Button, Card, Modal, Input, Select, StatusBadge, etc.
│   ├── common/                 # Composites: PageHeader, EmptyState, ErrorState, Logo, Can, Toast
│   ├── layout/                 # Sidebar, Navbar, UserMenu, QuickCreate, Notifications
│   ├── auth/                   # LoginForm, RegisterForm, ForgotPasswordForm, ResetPasswordForm
│   ├── account/                # ProfileForm, PasswordForm, SessionListTable
│   ├── workspaces/             # WorkspaceCard, CreateWorkspaceModal, WorkspaceList
│   ├── members/                # MemberTable, InviteMemberModal, MemberRoleSelect, RemoveMemberModal
│   ├── teams/                  # TeamCard, TeamMemberModal, CreateTeamModal
│   ├── roles/                  # PermissionMatrixTable, RoleBadge
│   ├── audit/                  # AuditLogTable, AuditFilterBar, AuditDetailsDrawer
│   └── notifications/          # NotificationList, NotificationItem
├── pages/
│   ├── auth/                   # LoginPage, RegisterPage, VerifyEmailPage, ResetPasswordPage
│   ├── account/                # ProfilePage, PasswordPage, SessionsPage
│   ├── workspaces/             # WorkspacesPage, NewWorkspacePage
│   ├── dashboard/              # DashboardPage (Overview KPI cards)
│   ├── settings/               # GeneralSettingsPage, MembersSettingsPage, TeamsSettingsPage, RolesSettingsPage, SecuritySettingsPage
│   ├── activity/               # AuditLogPage
│   ├── inbox/                  # NotificationsPage
│   └── platform/               # PlatformOverviewPage, PlatformOrgsPage, PlatformUsersPage, PlatformAuditPage
├── services/                   # Axios API service clients (auth, org, member, team, audit, notification)
├── context/                    # AuthContext, WorkspaceContext, SidebarContext, ToastContext
└── routes/                     # router.tsx, publicRoutes.tsx, workspaceRoutes.tsx, guards/
```

---

## 4. Complete MongoDB Collections & Schemas

All collections strictly enforce:
1. **UUID v4 string** for `_id` and all relation foreign keys (via `IdUtil.generateUuid()`).
2. Extend `BaseDocument` (`_id`, `createdAt`, `updatedAt`, `createdBy`, `updatedBy`).
3. Tenant collections extend `TenantDocument` with a required, indexed `organizationId: string`.

### 4.1 Collection Inventory (11 Collections for MVP 1)

| # | Collection Name | Schema Class | Tenant-Scoped? | Primary Purpose |
|---|---|---|---|---|
| 1 | `users` | `User` | Global | User identity, credentials, status, platform flag |
| 2 | `sessions` | `Session` | Global | Active refresh sessions, device user-agent, IP, token hash |
| 3 | `organizations`| `Organization` | Global | Multi-tenant workspaces with unique slugs and settings |
| 4 | `memberships` | `Membership` | **Yes** (`organizationId`) | Links users to workspaces with assigned role and status |
| 5 | `invitations` | `Invitation` | **Yes** (`organizationId`) | Pending email invitations with single-use cryptographic tokens |
| 6 | `teams` | `Team` | **Yes** (`organizationId`) | Workspace teams with designated team lead |
| 7 | `team_memberships` | `TeamMembership` | **Yes** (`organizationId`) | Join collection linking workspace members to teams |
| 8 | `roles` | `Role` | Hybrid (System/Org) | Predefined roles and permission matrix definitions |
| 9 | `audit_logs` | `AuditLog` | **Yes** (`organizationId`) | Immutable log of security, tenant, and administrative events |
| 10| `email_tokens` | `EmailToken` | Global | Single-use verification and password reset tokens |
| 11| `notifications`| `Notification` | **Yes** (`organizationId`) | In-app alerts, read status, and links for workspace events |

---

### 4.2 Detailed Schema Definitions & Indexes

#### 1. `users`
Global collection storing user identity and authentication credentials.
```ts
{
  _id: string;               // UUID v4
  email: string;             // Lowercase normalized email (Unique)
  passwordHash: string;      // Argon2id cryptographic hash
  name: string;              // Full display name
  avatarUrl?: string;        // Profile picture URL
  timezone: string;          // Default: "UTC"
  locale: string;            // Default: "en-US"
  isEmailVerified: boolean;  // Default: false
  status: 'active' | 'suspended' | 'disabled'; // Default: 'active'
  isPlatformAdmin: boolean;  // Default: false
  createdAt: Date;
  updatedAt: Date;
}
```
*Indexes:*
- `{ email: 1 }` (Unique)
- `{ status: 1 }`
- `{ createdAt: -1 }`

---

#### 2. `sessions`
Global collection tracking authenticated user sessions, refresh token rotation, and devices.
```ts
{
  _id: string;               // UUID v4
  userId: string;            // UUID v4 -> users._id
  refreshTokenHash: string;  // SHA-256 hash of rotating refresh token
  userAgent?: string;        // Browser and operating system string
  ipAddress?: string;        // Client IP address
  expiresAt: Date;           // Expiration timestamp
  isRevoked: boolean;        // Default: false
  createdAt: Date;
  updatedAt: Date;
}
```
*Indexes:*
- `{ userId: 1, isRevoked: 1 }`
- `{ refreshTokenHash: 1 }`
- `{ expiresAt: 1 }` (TTL index for automatic MongoDB expiration cleanup)

---

#### 3. `organizations`
Global collection representing multi-tenant workspaces.
```ts
{
  _id: string;               // UUID v4
  name: string;              // Workspace name (e.g. "Acme Operations")
  slug: string;              // URL slug (lowercase, kebab-cased, unique)
  logoUrl?: string;          // Workspace brand logo
  timezone: string;          // Default: "UTC"
  locale: string;            // Default: "en-US"
  ownerId: string;           // UUID v4 -> users._id (Current workspace Owner)
  status: 'active' | 'suspended' | 'deleted'; // Default: 'active'
  deletedAt?: Date;          // Retention timestamp for soft deletion
  createdAt: Date;
  updatedAt: Date;
}
```
*Indexes:*
- `{ slug: 1 }` (Unique)
- `{ ownerId: 1 }`
- `{ status: 1 }`

---

#### 4. `memberships`
Tenant-scoped collection linking users to organizations with assigned roles.
```ts
{
  _id: string;               // UUID v4
  organizationId: string;    // UUID v4 -> organizations._id (Tenant scope)
  userId: string;            // UUID v4 -> users._id
  roleId: string;            // UUID v4 -> roles._id or role slug ('owner', 'admin', etc.)
  status: 'active' | 'suspended'; // Default: 'active'
  joinedAt: Date;            // Timestamp when member joined
  createdAt: Date;
  updatedAt: Date;
}
```
*Indexes:*
- `{ organizationId: 1, userId: 1 }` (Unique compound index)
- `{ organizationId: 1, status: 1 }`
- `{ userId: 1 }`

---

#### 5. `invitations`
Tenant-scoped collection managing pending member invitations.
```ts
{
  _id: string;               // UUID v4
  organizationId: string;    // UUID v4 -> organizations._id (Tenant scope)
  email: string;             // Normalized invitee email address
  roleId: string;            // Pre-assigned role ID or slug
  invitedById: string;       // UUID v4 -> users._id (Requester)
  tokenHash: string;         // SHA-256 hash of single-use invitation token
  status: 'pending' | 'accepted' | 'revoked' | 'expired'; // Default: 'pending'
  expiresAt: Date;           // Expiration timestamp (e.g., 7 days)
  createdAt: Date;
  updatedAt: Date;
}
```
*Indexes:*
- `{ organizationId: 1, email: 1 }`
- `{ tokenHash: 1 }` (Unique)
- `{ expiresAt: 1 }`

---

#### 6. `teams`
Tenant-scoped collection for internal functional teams.
```ts
{
  _id: string;               // UUID v4
  organizationId: string;    // UUID v4 -> organizations._id (Tenant scope)
  name: string;              // Team name (e.g., "Customer Success", "Engineering")
  description?: string;      // Team description
  leadUserId?: string;       // UUID v4 -> users._id (Designated Team Lead)
  createdAt: Date;
  updatedAt: Date;
}
```
*Indexes:*
- `{ organizationId: 1, name: 1 }` (Unique compound index)
- `{ organizationId: 1, createdAt: -1 }`

---

#### 7. `team_memberships`
Tenant-scoped collection joining members to teams.
```ts
{
  _id: string;               // UUID v4
  organizationId: string;    // UUID v4 -> organizations._id (Tenant scope)
  teamId: string;            // UUID v4 -> teams._id
  userId: string;            // UUID v4 -> users._id
  joinedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
```
*Indexes:*
- `{ organizationId: 1, teamId: 1, userId: 1 }` (Unique compound index)
- `{ organizationId: 1, userId: 1 }`

---

#### 8. `roles`
System and tenant role definitions and permission mappings.
```ts
{
  _id: string;               // UUID v4
  organizationId?: string;   // Null for system roles; set for custom tenant roles
  name: string;              // "Owner", "Admin", "Manager", "Member", "Support Agent"
  slug: string;              // 'owner' | 'admin' | 'manager' | 'member' | 'support_agent'
  description: string;
  permissions: string[];     // e.g. ['organization.update', 'members.invite', 'teams.manage']
  isSystem: boolean;         // Default: true for predefined roles
  createdAt: Date;
  updatedAt: Date;
}
```
*Indexes:*
- `{ organizationId: 1, slug: 1 }` (Unique)
- `{ isSystem: 1 }`

---

#### 9. `audit_logs`
Tenant-scoped immutable log recording security and administrative operations.
```ts
{
  _id: string;               // UUID v4
  organizationId?: string;   // Null for global platform actions; set for workspace actions
  actorId: string;           // UUID v4 -> users._id
  action: string;            // e.g. 'auth.login', 'member.invite', 'role.change'
  targetType: string;        // 'user' | 'organization' | 'membership' | 'team' | 'session'
  targetId?: string;         // UUID v4 of affected target
  metadata?: Record<string, any>; // Sanitized JSON diff/context (no secrets)
  ipAddress?: string;
  userAgent?: string;
  requestId: string;         // Correlation ID from request-id middleware
  status: 'success' | 'failure';
  createdAt: Date;
}
```
*Indexes:*
- `{ organizationId: 1, createdAt: -1 }`
- `{ actorId: 1, createdAt: -1 }`
- `{ organizationId: 1, action: 1 }`
- `{ requestId: 1 }`

---

#### 10. `email_tokens`
Global collection storing single-use tokens for email verification, password reset, and email change.
```ts
{
  _id: string;               // UUID v4
  userId: string;            // UUID v4 -> users._id
  type: 'verify_email' | 'reset_password' | 'change_email';
  tokenHash: string;         // SHA-256 hash of token
  metadata?: { newEmail?: string }; // Used for email change verification
  expiresAt: Date;           // Expiration timestamp
  isUsed: boolean;           // Default: false
  createdAt: Date;
}
```
*Indexes:*
- `{ tokenHash: 1 }` (Unique)
- `{ userId: 1, type: 1 }`
- `{ expiresAt: 1 }` (TTL index for automatic deletion)

---

#### 11. `notifications`
Tenant-scoped in-app notifications for workspace activity.
```ts
{
  _id: string;               // UUID v4
  organizationId: string;    // UUID v4 -> organizations._id (Tenant scope)
  recipientUserId: string;   // UUID v4 -> users._id (Target recipient)
  actorUserId?: string;      // UUID v4 -> users._id (Who triggered the alert)
  title: string;             // Short notification headline
  message: string;           // Detailed description
  type: 'member_invited' | 'role_changed' | 'team_assigned' | 'security_alert' | 'system';
  link?: string;             // Relative deep link (e.g. "/workspace/acme/settings/members")
  isRead: boolean;           // Default: false
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```
*Indexes:*
- `{ organizationId: 1, recipientUserId: 1, isRead: 1 }`
- `{ recipientUserId: 1, createdAt: -1 }`

---

## 5. Architectural Quality Checklist (Nexora Standards)

- [x] **Zero MongoDB `ObjectId` usage:** All identifiers are UUID v4 strings via `IdUtil.generateUuid()`.
- [x] **Strict Tenant Isolation:** Every tenant schema extends `TenantDocument` with `organizationId: string`, and all queries enforce `{ organizationId }`. Foreign IDs return 404 to avoid ID enumeration.
- [x] **UI Modularity:** Pages are lean coordinators (< 200 lines); subcomponents placed under `components/<module>/`.
- [x] **Design Tokens:** Strict `rounded-md`, flat borders, zero drop shadows (`no shadow-*`), theme tokens sourced from `client/src/index.css`.
- [x] **Interaction States:** Pointer cursor globally, full hover/focus/active/disabled states on all interactive elements.
- [x] **API Standards:** Standard success envelope `createApiResponse()` and exception responses handled by `AllExceptionsFilter`.
