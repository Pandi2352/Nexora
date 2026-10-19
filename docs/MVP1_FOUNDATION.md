# Nexora OS — MVP 1: Foundation

Goal: secure login and multi-tenant workspaces, with members, teams and permissions working end to end.

---

## 1. Authentication

- Register with name, email, password
- Password strength validation
- Email verification link (expires, single-use)
- Resend verification email
- Login with email and password
- Generic error on failed login (does not reveal whether the email exists)
- Rate limiting on login, register, reset and verify
- Access token kept in memory (short-lived)
- Refresh token in an HttpOnly cookie (rotated on every refresh)
- Refresh-token reuse detection, which revokes the session
- Silent refresh when the page loads
- Logout (revoke current session)
- Logout from all devices
- Forgot password: email with reset link
- Reset password (token expires, single-use)
- Revoke all sessions after a password reset or change
- Block login for suspended or disabled accounts
- Protected routes redirect to login
- Redirect back to the intended page after login

## 2. Users & Profile

- View my profile
- Update name, avatar, timezone, locale
- Change password (current password required)
- Change email (re-verification required)
- View active sessions
- Revoke a single session
- Account status: active, suspended, disabled
- Theme preference (light / dark / system)

## 3. Organizations

- Create organization (name, slug)
- Slug normalized and unique
- Creator becomes Owner automatically
- List my organizations
- Switch organization
- Workspace selection page after login
- Remember the last used workspace
- Reject access to workspaces where the user is not a member
- Organization settings: name, logo, timezone, locale
- Change slug (owner / admin)
- Transfer ownership (owner only)
- Leave organization (not allowed for the last owner)
- Suspend organization (platform admin), which blocks access
- Delete organization (owner, soft delete with a retention period)

## 4. Members & Invitations

- Invite a member by email with a role
- Invitation email with link
- Invitation expires and can be used only once
- Accept invitation (existing user)
- Accept invitation and register (new user)
- Invitation email must match the signed-in user
- Resend invitation
- Revoke a pending invitation
- List pending invitations
- List members with role, status and join date
- Search and filter members
- Change a member's role
- Suspend or reactivate a member
- Remove a member
- Cannot remove or demote the last owner
- Cannot assign a role higher than your own

## 5. Teams

- Create team (name, description)
- Edit or delete team
- List teams
- Add or remove team members
- Assign a team lead
- View a member's teams
- A member can belong to multiple teams

## 6. Roles & Permissions

- Predefined roles: Owner, Admin, Manager, Member, Support Agent
- Explicit permission list (e.g. `members.invite`, `teams.manage`)
- Role → permission mapping
- Permissions resolved per organization membership
- Backend permission guard on every protected endpoint
- Tenant guard: active membership required for every workspace request
- Records in another tenant return 404
- Permission changes take effect immediately
- `GET /me` returns the user's permissions for the active organization
- Frontend `usePermission` hook and `<Can>` wrapper
- Sidebar and actions hidden by permission
- Permission-denied page for 403
- Platform admin role kept separate from tenant roles
- Roles page: view the permission matrix (read-only)

---

## Supporting modules (needed for MVP 1)

### 7. Audit (security events)

- Log: register, login, failed login, logout, password reset/change
- Log: organization created/updated, ownership transferred
- Log: invite sent/accepted/revoked, role changed, member removed
- Each entry stores actor, organization, action, target, time, request ID and outcome
- Never logs passwords or tokens
- Audit list page (admins only), filters and pagination

### 8. Email

- Email service adapter (provider can be swapped)
- Templates: verification, password reset, invitation
- Development: log emails or use a local mail catcher
- Handle send failures without breaking the request

### 9. App Shell (frontend)

- Public layout (auth pages)
- Workspace layout: sidebar, topbar, page header
- Organization switcher
- Profile menu
- Responsive sidebar (drawer on mobile)
- Toasts, loading skeletons, empty and error states
- 404 page

### 10. Platform Admin (basic)

- List organizations, suspend / reactivate
- List users, suspend / disable
- Platform audit log
- Access limited to platform admins

### 11. Core Backend

- `/api/v1` prefix
- Global validation (DTO whitelist)
- Standard error format with request ID
- Request ID and structured logging
- Config validated at startup
- Swagger docs
- Health endpoints (live / ready)
- Security headers, CORS, body size limits

---

## Pages

| Page | Route |
|---|---|
| Login | `/login` |
| Register | `/register` |
| Verify email | `/verify-email` |
| Forgot password | `/forgot-password` |
| Reset password | `/reset-password` |
| Accept invitation | `/accept-invitation` |
| Workspaces | `/workspaces` |
| New workspace | `/workspaces/new` |
| Dashboard (placeholder) | `/workspace/:slug/dashboard` |
| Settings · General | `/workspace/:slug/settings/general` |
| Settings · Members | `/workspace/:slug/settings/members` |
| Settings · Teams | `/workspace/:slug/settings/teams` |
| Settings · Roles | `/workspace/:slug/settings/roles` |
| Settings · Security | `/workspace/:slug/settings/security` |
| Audit log | `/workspace/:slug/activity/audit` |
| Account · Profile | `/account/profile` |
| Account · Password | `/account/password` |
| Account · Sessions | `/account/sessions` |
| Platform · Organizations | `/platform/organizations` |
| Platform · Users | `/platform/users` |

## Collections

`users` · `sessions` · `organizations` · `memberships` · `invitations` · `teams` · `team_memberships` · `roles` · `audit_logs` · `email_tokens`

---

## Tests (must pass)

- Register → verify → login → logout
- Forgot → reset password → old sessions revoked
- Refresh token rotation, and reuse detection revokes the session
- Login rate limit
- Create organization → owner assigned
- Invite → accept → member appears
- Expired or used invitation rejected
- Member of Org A cannot access Org B (read / update / delete)
- Member without permission gets 403
- Role change takes effect immediately
- Suspended member or organization blocked
- Last owner cannot be removed
- Platform routes blocked for tenant owners

## Done when

- [ ] All items above work from UI to API to database
- [ ] All tests above pass in CI
- [ ] Swagger documents every MVP 1 endpoint
- [ ] No secrets in the repo; `.env.example` complete
