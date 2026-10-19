# Nexora OS — MVP Modules

> **QA & Verification Guide:** For end-to-end user manuals, test cases, and upcoming feature architectures, see [`docs/MVP1_MANUAL_TESTING_AND_USER_GUIDE.md`](./MVP1_MANUAL_TESTING_AND_USER_GUIDE.md).

## Foundation (100% Complete)

1. Authentication ✅
   - Register, login, logout
   - Email verification
   - Forgot / reset password
   - Refresh session & family rotation
2. Users & Profile ✅
   - Profile, timezone, locale, active sessions
3. Organizations ✅
   - Create workspace, switch workspace
   - Organization settings & slug updates
4. Members & Invitations ✅
   - Invite, accept, remove, change role, revoke
5. Teams ✅
   - Create team, assign members, team lead
6. Roles & Permissions ✅
   - Predefined roles, 23 capability checks, `<Can>` guards

## Core

7. Dashboard ✅
   - KPI metrics, velocity spline chart, team donut, onboarding checklist, recent activity
8. CRM 🚀 (In Progress — [Specification](./MVP2_SALES_CRM_SPECIFICATION.md))
   - Companies (CRUD, accounts, industry, contacts)
   - Contacts (Directory, LinkedIn/Twitter, bio)
   - Leads (Lead details, Funnel info with INR target, Must-Win deal toggle, Contact info)
   - Opportunities & Pipelines (Kanban stages, quotations, deal value)
   - Sales Activities (Cold calls, meetings, follow-ups, proposals submitted)
9. Projects
   - Projects, project members
10. Tasks
    - Tasks, subtasks, list + Kanban, comments, labels
11. Documents
    - Folders, upload, download, access control
12. Support
    - Tickets, assign, replies, internal notes, resolution

## Operations

13. Notifications
    - In-app, read / unread, mark all read
14. Activity & Audit ✅
    - Activity feed, audit log, deep payload inspection
15. Search & Filters
    - Module-level search, filter, sort, pagination
16. Reports
    - Sales, work, support summaries, CSV export
17. Settings ✅ (General, members, teams, roles)
    - General, members, teams, roles, security

## Platform

18. Platform Admin
    - Organizations, users, audit, health
19. Health ✅
    - Liveness, readiness
