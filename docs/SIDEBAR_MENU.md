# Nexora OS — Sidebar Menu

Menus, submenus and features. Details live in [PRD.md](./PRD.md) and [FRONTEND_ARCHITECTURE.md](./FRONTEND_ARCHITECTURE.md).

Base path: `/workspace/:workspaceSlug`

**Phase tags:** `MVP` = P0 · `P1` = complete MVP · `P2` = post-MVP

---

## Topbar (always visible)

| Item | Features | Phase |
|---|---|---|
| Organization switcher | Switch workspace, create workspace | MVP |
| Global search | Search CRM, projects, tasks, tickets, documents | P1 |
| Quick create (+) | New task, contact, lead, ticket, project | P1 |
| Notifications bell | Unread count, recent notifications | MVP |
| Help | Docs, keyboard shortcuts, what's new | P2 |
| Profile menu | My profile · Change password · Theme · Log out | MVP |

---

## Sidebar groups

```
Home
  Dashboard
  My Work
  Inbox
  Calendar

Sales
  CRM

Work
  Projects
  Tasks
  Time Tracking
  Goals

Content
  Documents
  Knowledge Base
  Forms

Service
  Support

Operations
  Automations
  Reports
  Activity

Admin
  Settings
```

---

## HOME

### 1. Dashboard — `/dashboard`

| Feature | Phase |
|---|---|
| Key metrics cards | MVP |
| Task and ticket status summary | MVP |
| CRM pipeline summary | MVP |
| Overdue and upcoming work | MVP |
| Recent activity | MVP |
| Date-range filter | MVP |
| Customizable widgets | P2 |
| Multiple saved dashboards | P2 |

### 2. My Work — `/my-work`

| Submenu | Path | Features | Phase |
|---|---|---|---|
| Today | `/my-work/today` | Tasks due today, meetings, follow-ups | P1 |
| Assigned to me | `/my-work/assigned` | Tasks, tickets, leads assigned to me | P1 |
| Mentions | `/my-work/mentions` | Comments where I'm mentioned | P1 |
| Watching | `/my-work/watching` | Records I follow | P2 |

### 3. Inbox — `/inbox`

| Submenu | Path | Features | Phase |
|---|---|---|---|
| Notifications | `/inbox/notifications` | Unread / all, mark as read, mark all as read | MVP |
| Approvals | `/inbox/approvals` | Pending approval requests | P2 |
| Email | `/inbox/email` | Synced email, link emails to CRM records | P2 |

### 4. Calendar — `/calendar`

| Feature | Phase |
|---|---|
| Month / week / day views | P1 |
| Task due dates, CRM meetings, follow-ups | P1 |
| Create event from calendar | P1 |
| External calendar sync (Google / Outlook) | P2 |

---

## SALES

### 5. CRM — `/crm`

| Submenu | Path | Features | Phase |
|---|---|---|---|
| Companies | `/crm/companies` | List, create, edit, archive, search, filter | MVP |
| Contacts | `/crm/contacts` | List, create, edit, link to company | MVP |
| Leads | `/crm/leads` | Create, assign, source/status | MVP |
| Lead conversion | — | Convert lead to contact / opportunity | P1 |
| Opportunities | `/crm/opportunities` | Pipeline (Kanban), stages, value, probability, close date | MVP |
| Activities | `/crm/activities` | Calls, meetings, notes, follow-ups | MVP |
| Products | `/crm/products` | Product / service catalog with prices | P2 |
| Quotes | `/crm/quotes` | Create quotes from opportunities, PDF export | P2 |
| Import / Export | `/crm/import` | CSV import with mapping, CSV export | P1 |
| Duplicates | `/crm/duplicates` | Detect and merge duplicate records | P2 |

---

## WORK

### 6. Projects — `/projects`

| Submenu | Path | Features | Phase |
|---|---|---|---|
| All projects | `/projects` | List, create, archive | MVP |
| Project detail | `/projects/:projectId` | Overview, members, tasks, documents, activity | MVP |
| Milestones | `/projects/:projectId/milestones` | Milestones with due dates and progress | P1 |
| Timeline | `/projects/:projectId/timeline` | Gantt / timeline view | P2 |
| Templates | `/projects/templates` | Reusable project templates | P2 |

### 7. Tasks — `/tasks`

| Submenu | Path | Features | Phase |
|---|---|---|---|
| My tasks | `/tasks?view=mine` | Assigned to me | MVP |
| All tasks | `/tasks` | List and Kanban views, filters, sorting | MVP |
| Overdue | `/tasks?filter=overdue` | Overdue tasks | MVP |
| Saved views | `/tasks?view=:id` | Saved filter combinations | P2 |

Task features: subtasks, priority, status, due date, labels, comments, mentions, attachments (MVP) · dependencies, recurring tasks, checklists (P1) · bulk edit (P2).

### 8. Time Tracking — `/time`

| Submenu | Path | Features | Phase |
|---|---|---|---|
| Timesheet | `/time/timesheet` | Weekly time entries | P2 |
| Timer | — | Start / stop timer on a task | P2 |
| Time reports | `/time/reports` | Hours by user, project, client | P2 |

### 9. Goals — `/goals`

| Feature | Phase |
|---|---|
| Goals / OKRs by team or organization | P2 |
| Key results linked to projects and tasks | P2 |
| Progress tracking | P2 |

---

## CONTENT

### 10. Documents — `/documents`

| Submenu | Path | Features | Phase |
|---|---|---|---|
| All files | `/documents` | Folders, upload, download, search, filter | MVP |
| Recent | `/documents/recent` | Recently opened / uploaded | P1 |
| Shared with me | `/documents/shared` | Files shared with me | P1 |
| Trash | `/documents/trash` | Restore or permanently delete | P1 |
| Versions | — | Version history, replace file | P1 |
| Preview | — | In-app preview for PDF and images | P2 |

### 11. Knowledge Base — `/knowledge-base`

| Feature | Phase |
|---|---|
| Articles and categories | P2 |
| Rich-text editor | P2 |
| Internal vs public articles | P2 |
| Link articles to support tickets | P2 |

### 12. Forms — `/forms`

| Feature | Phase |
|---|---|
| Form builder (fields, validation) | P2 |
| Submissions create leads or tickets | P2 |
| Public form link | P2 |

---

## SERVICE

### 13. Support — `/support`

| Submenu | Path | Features | Phase |
|---|---|---|---|
| All tickets | `/support/tickets` | Create, assign, status, priority, category | MVP |
| My queue | `/support/tickets?view=mine` | Tickets assigned to me | MVP |
| Overdue / SLA | `/support/tickets?filter=overdue` | SLA breaches, escalation | P1 |
| Canned responses | `/support/canned-responses` | Saved reply templates | P1 |
| SLA policies | `/support/sla` | SLA rules by priority / category | P1 |
| Customer portal | `/support/portal` | External users submit and track tickets | P2 |
| Satisfaction (CSAT) | `/support/csat` | Rating after resolution | P2 |

Ticket features: replies, internal notes, history, resolution.

---

## OPERATIONS

### 14. Automations — `/automations`

| Submenu | Path | Features | Phase |
|---|---|---|---|
| Workflows | `/automations` | List, enable / disable | P1 |
| Create workflow | `/automations/new` | Trigger → condition → action | P1 |
| Execution logs | `/automations/logs` | Run history, failures, retries | P1 |
| Templates | `/automations/templates` | Ready-made workflows | P2 |
| Visual builder | — | Drag-and-drop workflow editor | P2 |

### 15. Reports — `/reports`

| Submenu | Path | Features | Phase |
|---|---|---|---|
| Sales | `/reports/sales` | Pipeline, win rate, forecast | MVP |
| Work | `/reports/work` | Task completion, overdue, workload | MVP |
| Support | `/reports/support` | Ticket volume, resolution time, SLA | MVP |
| Export | — | CSV export | MVP |
| Custom reports | `/reports/custom` | Build reports with filters and charts | P2 |
| Scheduled reports | `/reports/scheduled` | Email reports on a schedule | P2 |

### 16. Activity — `/activity`

| Submenu | Path | Features | Phase |
|---|---|---|---|
| Activity feed | `/activity` | Organization-wide activity | MVP |
| Audit log | `/activity/audit` | Security and admin events (admins only) | MVP |

---

## ADMIN

### 17. Settings — `/settings`

| Submenu | Path | Features | Phase |
|---|---|---|---|
| General | `/settings/general` | Org name, slug, logo, timezone, locale | MVP |
| Members | `/settings/members` | Invite, remove, change role, status | MVP |
| Teams | `/settings/teams` | Create teams, assign members | MVP |
| Roles | `/settings/roles` | Roles and permission matrix | MVP |
| Custom roles | `/settings/roles/new` | Create roles with custom permissions | P2 |
| Notifications | `/settings/notifications` | Notification preferences | P1 |
| Pipelines & stages | `/settings/pipelines` | CRM pipeline stages | P1 |
| Task statuses | `/settings/statuses` | Task and ticket status workflows | P1 |
| Tags & labels | `/settings/tags` | Manage tags and labels | P1 |
| Custom fields | `/settings/custom-fields` | Extra fields on CRM, tasks, tickets | P2 |
| Integrations | `/settings/integrations` | Connect external services | P1 |
| API keys | `/settings/api-keys` | Create / revoke API keys | P2 |
| Webhooks | `/settings/webhooks` | Outgoing webhooks, delivery logs | P2 |
| Security | `/settings/security` | Active sessions, password policy, 2FA | MVP / P2 (2FA) |
| Usage & limits | `/settings/usage` | Storage, members, records used | P1 |
| Billing & plan | `/settings/billing` | Plan, invoices, payment method | P2 |
| Data | `/settings/data` | Full data export, organization deletion | P1 |

### Personal settings — `/account` (from profile menu)

| Submenu | Path | Features | Phase |
|---|---|---|---|
| Profile | `/account/profile` | Name, avatar, timezone | MVP |
| Password | `/account/password` | Change password | MVP |
| Sessions | `/account/sessions` | Active sessions, log out others | P1 |
| Two-factor auth | `/account/2fa` | TOTP setup | P2 |
| Preferences | `/account/preferences` | Theme, language, notification channels | P1 |

---

## Platform admin sidebar — `/platform`

Separate area, platform administrators only.

| Menu | Path | Features | Phase |
|---|---|---|---|
| Overview | `/platform` | Platform stats | MVP |
| Organizations | `/platform/organizations` | List, suspend, manage tenants | MVP |
| Users | `/platform/users` | List, suspend, disable accounts | MVP |
| Audit | `/platform/audit` | Platform-level audit log | MVP |
| Health | `/platform/health` | System health | MVP |
| Jobs & queues | `/platform/jobs` | Queue depth, failed jobs, retry | P1 |
| Plans | `/platform/plans` | Subscription plans and limits | P2 |
| Feature flags | `/platform/feature-flags` | Enable features per organization | P2 |
| Announcements | `/platform/announcements` | In-app banners for all users | P2 |

---

## Visibility by role

| Menu | Owner | Admin | Manager | Member | Support Agent |
|---|:-:|:-:|:-:|:-:|:-:|
| Dashboard | ✓ | ✓ | ✓ | ✓ | ✓ |
| My Work | ✓ | ✓ | ✓ | ✓ | ✓ |
| Inbox | ✓ | ✓ | ✓ | ✓ | ✓ |
| Calendar | ✓ | ✓ | ✓ | ✓ | ✓ |
| CRM | ✓ | ✓ | ✓ | ✓ | – |
| Projects | ✓ | ✓ | ✓ | ✓ | – |
| Tasks | ✓ | ✓ | ✓ | ✓ | ✓ |
| Time Tracking | ✓ | ✓ | ✓ | ✓ | ✓ |
| Goals | ✓ | ✓ | ✓ | ✓ | – |
| Documents | ✓ | ✓ | ✓ | ✓ | ✓ |
| Knowledge Base | ✓ | ✓ | ✓ | ✓ | ✓ |
| Forms | ✓ | ✓ | ✓ | – | – |
| Support | ✓ | ✓ | ✓ | – | ✓ |
| Automations | ✓ | ✓ | – | – | – |
| Reports | ✓ | ✓ | ✓ | – | – |
| Activity / Audit | ✓ | ✓ | – | – | – |
| Settings | ✓ | ✓ | – | – | – |

Draft. Menus are hidden according to permissions, but the backend still enforces access. The final matrix will be in the authorization spec.

---

## Your additions

<!-- Add new menus / features here, then move them into the right group above. -->

| Menu / Submenu | Path | Features | Phase |
|---|---|---|---|
| | | | |
