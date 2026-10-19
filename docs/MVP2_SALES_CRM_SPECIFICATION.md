# Nexora OS — MVP 2: Sales CRM Specification

> **Module Status:** In Specification & Implementation  
> **Target Release:** MVP 2  
> **Architecture Compliance:** Node 20.19.4 · NestJS + MongoDB (`server/`) · React + Vite + TypeScript (`client/`) · UUID v4 IDs · Organization Tenant Scoping (`organizationId`) · Strict `rounded-md` & No Drop Shadows.

---

## 1. Executive Summary & Scope

The **Sales CRM** module delivers an enterprise-grade customer relationship and revenue pipeline management suite for Nexora OS. It equips teams with end-to-end sales lifecycle tracking:
1. **Company Management (CRUD)**: Accounts, organizational hierarchy, business metadata, and associated contacts.
2. **Comprehensive Lead Management**:
   - **Company Details**: Company association and corporate metadata.
   - **Lead Details**: Status, owner assignment, acquisition source, lead type, key meeting schedules, follow-up contact dates, and expected conversion dates.
   - **Funnel & Financial Information**: Business unit, revenue type, revenue category, revenue frequency, billing start month, annual revenue target (in INR ₹), contract duration, must-win deal flag, and engagement scope text.
   - **Contact Profile**: Full professional identity including salutation, gender, designation, phone, email, date of birth, bio description, LinkedIn URL, and Twitter handle.
3. **Sales Operations & Pipeline Kanban**: Visual lead and opportunity pipelines with stage progression, probabilities, value summaries, and quotation lifecycle tracking.
4. **Sales Activity Tracking**: Chronological logging and follow-ups for cold calls, discovery meetings, product demonstrations, follow-up touchpoints, and proposals submitted to companies.

---

## 2. Domain Data Model & Schemas

### 2.1 Company Schema (`companies`)
| Field | Type | Required | Description |
|---|---|---|---|
| `id` | String (UUID v4) | Yes | Primary unique identifier |
| `organizationId` | String (UUID v4) | Yes | Tenant isolation key |
| `name` | String | Yes | Company legal or business name |
| `industry` | String | No | Technology, Finance, Healthcare, Manufacturing, etc. |
| `website` | String | No | URL (e.g. `https://acme.inc`) |
| `phone` | String | No | Primary business telephone |
| `email` | String | No | General corporate email address |
| `address` | Object | No | `{ street, city, state, postalCode, country }` |
| `annualRevenue` | Number | No | Annual turnover in INR (₹) |
| `employeeCount` | String | No | `1-10`, `11-50`, `51-200`, `201-500`, `500+` |
| `status` | String | Yes | `prospect`, `customer`, `partner`, `inactive` |
| `ownerId` | String (UUID v4) | No | Account executive / owner user ID |
| `createdAt` | Date | Yes | Creation timestamp |
| `updatedAt` | Date | Yes | Last update timestamp |

### 2.2 Contact Schema (`contacts`)
| Field | Type | Required | Description |
|---|---|---|---|
| `id` | String (UUID v4) | Yes | Primary unique identifier |
| `organizationId` | String (UUID v4) | Yes | Tenant isolation key |
| `companyId` | String (UUID v4) | No | Linked company reference |
| `firstName` | String | Yes | Contact first name |
| `lastName` | String | Yes | Contact last name |
| `salutation` | String | No | `Mr.`, `Ms.`, `Mrs.`, `Dr.`, `Prof.` |
| `gender` | String | No | `male`, `female`, `non_binary`, `prefer_not_to_say` |
| `designation` | String | No | Job title (e.g. `Chief Technology Officer`) |
| `email` | String | Yes | Corporate email address |
| `phone` | String | No | Direct telephone / mobile number |
| `dateOfBirth` | Date | No | Contact birth date |
| `description` | String | No | Bio, notes, background summary |
| `linkedInUrl` | String | No | LinkedIn profile link |
| `twitterHandle` | String | No | Twitter / X profile handle |
| `isPrimary` | Boolean | Yes | Primary point of contact flag (default `false`) |
| `createdAt` | Date | Yes | Creation timestamp |
| `updatedAt` | Date | Yes | Last update timestamp |

### 2.3 Lead Schema (`leads`)
Full schema covering the user's exact specification:
| Group | Field | Type | Required | Description |
|---|---|---|---|---|
| **Base** | `id` | String (UUID v4) | Yes | Primary unique identifier |
| | `organizationId` | String (UUID v4) | Yes | Tenant scoping key |
| | `companyName` | String | Yes | Name of the prospective enterprise |
| | `companyId` | String (UUID v4) | No | Optional linked existing Company |
| **Lead Details** | `status` | String | Yes | `new`, `contacted`, `in_discussion`, `qualified`, `proposal_sent`, `unqualified` |
| | `leadOwnerId` | String (UUID v4) | Yes | Assigned workspace member user ID |
| | `source` | String | Yes | `website`, `referral`, `cold_call`, `linkedin`, `event`, `partner`, `other` |
| | `type` | String | Yes | `inbound`, `outbound`, `partner`, `expansion` |
| | `meetingDate` | Date | No | Scheduled demo or discovery meeting |
| | `nextContactDate` | Date | No | Follow-up touchpoint date |
| | `expectedConversionDate` | Date | No | Target close or qualification date |
| **Funnel Info** | `businessUnit` | String | Yes | `enterprise`, `mid_market`, `smb`, `government`, `digital` |
| | `revenueType` | String | Yes | `recurring`, `one_time`, `fixed_bid`, `time_and_materials` |
| | `revenueCategory` | String | Yes | `software_license`, `implementation`, `managed_services`, `consulting` |
| | `revenueFrequency` | String | Yes | `monthly`, `quarterly`, `annually`, `milestone` |
| | `billingStartMonth` | String | No | E.g. `2026-11` or month string |
| | `annualRevenueTarget` | Number | Yes | Expected annual revenue in Indian Rupees (₹) |
| | `contractPeriod` | Number | Yes | Contract duration in years (e.g. `1`, `2`, `3`, `5`) |
| | `isMustWin` | Boolean | Yes | Switch: "Mark this deal as a must-win opportunity" |
| | `scope` | String | No | Detailed engagement and deliverables scope |
| **Contact Info** | `contactFirstName` | String | Yes | Primary contact first name |
| | `contactLastName` | String | Yes | Primary contact last name |
| | `salutation` | String | No | `Mr.`, `Ms.`, `Mrs.`, `Dr.`, `Prof.` |
| | `gender` | String | No | `male`, `female`, `non_binary`, `prefer_not_to_say` |
| | `designation` | String | No | Job title (e.g. `Head of Procurement`) |
| | `contactEmail` | String | Yes | Direct email address |
| | `contactPhone` | String | No | Contact telephone |
| | `dateOfBirth` | Date | No | Contact birth date |
| | `contactDescription` | String | No | Background or personality notes |
| | `linkedInUrl` | String | No | LinkedIn profile URL |
| | `twitterHandle` | String | No | Twitter / X handle |
| **Metadata** | `createdAt` | Date | Yes | Creation timestamp |
| | `updatedAt` | Date | Yes | Last update timestamp |

### 2.4 Sales Activity Schema (`sales_activities`)
| Field | Type | Required | Description |
|---|---|---|---|
| `id` | String (UUID v4) | Yes | Primary unique identifier |
| `organizationId` | String (UUID v4) | Yes | Tenant scoping key |
| `type` | String | Yes | `cold_call`, `meeting`, `proposal_submitted`, `follow_up`, `email`, `note` |
| `title` | String | Yes | Summary of the sales touchpoint |
| `description` | String | No | Detailed conversation notes or proposal link |
| `companyId` | String (UUID v4) | No | Target company |
| `leadId` | String (UUID v4) | No | Target lead |
| `contactId` | String (UUID v4) | No | Associated contact |
| `performedById` | String (UUID v4) | Yes | Sales rep who executed the activity |
| `scheduledAt` | Date | No | Future scheduled date/time |
| `completedAt` | Date | No | Execution timestamp |
| `status` | String | Yes | `scheduled`, `completed`, `cancelled` |
| `outcome` | String | No | `positive`, `neutral`, `negative`, `followup_needed` |
| `proposalValue` | Number | No | Submitted proposal value in INR (₹) |
| `createdAt` | Date | Yes | Creation timestamp |
| `updatedAt` | Date | Yes | Last update timestamp |

### 2.5 Opportunity & Quotation Pipeline Schema (`opportunities`)
| Field | Type | Required | Description |
|---|---|---|---|
| `id` | String (UUID v4) | Yes | Primary unique identifier |
| `organizationId` | String (UUID v4) | Yes | Tenant scoping key |
| `title` | String | Yes | Opportunity / Deal name |
| `companyId` | String (UUID v4) | Yes | Target customer or prospect account |
| `leadId` | String (UUID v4) | No | Source lead reference |
| `stage` | String | Yes | `qualification`, `needs_analysis`, `proposal_quote`, `negotiation`, `closed_won`, `closed_lost` |
| `value` | Number | Yes | Deal / Quote amount in INR (₹) |
| `probability` | Number | Yes | Win likelihood (0–100%) |
| `expectedCloseDate` | Date | Yes | Target close date |
| `ownerId` | String (UUID v4) | Yes | Deal owner |
| `isMustWin` | Boolean | Yes | Strategic deal flag |
| `quotationNumber` | String | No | Quotation reference code (e.g. `NX-Q-2026-001`) |
| `quotationStatus` | String | No | `draft`, `sent`, `accepted`, `declined` |
| `notes` | String | No | Deal notes & requirements |
| `createdAt` | Date | Yes | Creation timestamp |
| `updatedAt` | Date | Yes | Last update timestamp |

---

## 3. Backend Architecture & Endpoints

### 3.1 Module Layout (`server/src/modules/crm/`)
```
server/src/modules/crm/
├── crm.module.ts
├── companies/
│   ├── schemas/company.schema.ts
│   ├── dto/create-company.dto.ts
│   ├── dto/update-company.dto.ts
│   ├── company.repository.ts
│   ├── company.service.ts
│   └── company.controller.ts
├── contacts/
│   ├── schemas/contact.schema.ts
│   ├── dto/create-contact.dto.ts
│   ├── dto/update-contact.dto.ts
│   ├── contact.repository.ts
│   ├── contact.service.ts
│   └── contact.controller.ts
├── leads/
│   ├── schemas/lead.schema.ts
│   ├── dto/create-lead.dto.ts
│   ├── dto/update-lead.dto.ts
│   ├── lead.repository.ts
│   ├── lead.service.ts
│   └── lead.controller.ts
├── activities/
│   ├── schemas/sales-activity.schema.ts
│   ├── dto/create-activity.dto.ts
│   ├── dto/update-activity.dto.ts
│   ├── sales-activity.repository.ts
│   ├── sales-activity.service.ts
│   └── sales-activity.controller.ts
└── opportunities/
    ├── schemas/opportunity.schema.ts
    ├── dto/create-opportunity.dto.ts
    ├── dto/update-opportunity.dto.ts
    ├── opportunity.repository.ts
    ├── opportunity.service.ts
    └── opportunity.controller.ts
```

### 3.2 REST API Routes
All endpoints require authentication (`JwtAuthGuard`) and workspace tenant extraction (`@CurrentOrg() organizationId`):

#### Companies:
- `GET /api/crm/companies` — List companies (with pagination, search, industry filter)
- `POST /api/crm/companies` — Create company
- `GET /api/crm/companies/:id` — Get company with linked contacts & opportunities
- `PUT /api/crm/companies/:id` — Update company
- `DELETE /api/crm/companies/:id` — Delete / archive company

#### Contacts:
- `GET /api/crm/contacts` — List contacts (search by name, email, company)
- `POST /api/crm/contacts` — Create contact
- `GET /api/crm/contacts/:id` — Get contact details
- `PUT /api/crm/contacts/:id` — Update contact
- `DELETE /api/crm/contacts/:id` — Delete contact

#### Leads:
- `GET /api/crm/leads` — List leads (filtered by status, owner, must-win, business unit)
- `POST /api/crm/leads` — Create lead (with full lead, funnel, and contact payload)
- `GET /api/crm/leads/:id` — Get lead full details
- `PUT /api/crm/leads/:id` — Update lead
- `POST /api/crm/leads/:id/convert` — Convert lead into Company + Contact + Opportunity
- `DELETE /api/crm/leads/:id` — Delete lead

#### Sales Activities:
- `GET /api/crm/activities` — List activities (cold calls, meetings, proposals)
- `POST /api/crm/activities` — Log new activity or schedule future follow-up
- `PUT /api/crm/activities/:id` — Update status, outcome, or notes
- `DELETE /api/crm/activities/:id` — Delete activity record

#### Opportunities & Quotations:
- `GET /api/crm/opportunities` — List opportunities (pipeline stages or table)
- `POST /api/crm/opportunities` — Create opportunity / quote
- `PUT /api/crm/opportunities/:id/stage` — Update pipeline stage (drag-and-drop support)
- `PUT /api/crm/opportunities/:id` — Update opportunity details
- `DELETE /api/crm/opportunities/:id` — Delete opportunity

---

## 4. Frontend Architecture & User Interface

### 4.1 Client Directory Structure (`client/src/`)
```
client/src/
├── types/crm.ts                 # Full TypeScript interfaces for Company, Contact, Lead, Activity, Opportunity
├── services/crm.service.ts       # Unified API client for CRM operations
├── pages/crm/
│   ├── CompaniesPage.tsx        # Company management table, search, quick create
│   ├── ContactsPage.tsx         # Contacts directory, cards & table view
│   ├── LeadsPage.tsx            # Leads overview & funnel metrics
│   ├── OpportunitiesPage.tsx    # Pipeline Kanban board & quotation stages
│   └── ActivitiesPage.tsx       # Cold calls, meetings & proposal activity log
└── components/crm/
    ├── companies/
    │   ├── CompanyModal.tsx     # Create / Edit Company form
    │   ├── CompanyTable.tsx     # Data table with sorting & actions
    │   └── CompanyDetailDrawer.tsx
    ├── leads/
    │   ├── CreateLeadModal.tsx  # Multi-section Lead Form (Lead Details, Funnel Info, Contact Info)
    │   ├── LeadStatusBadge.tsx  # Color-coded status badge
    │   ├── LeadCard.tsx         # Quick view card with Must-Win indicator
    │   └── LeadConvertModal.tsx # 1-click lead to deal converter
    ├── activities/
    │   ├── LogActivityModal.tsx # Modal to log cold calls, meetings, proposals
    │   ├── ActivityTimeline.tsx # Chronological visual feed
    │   └── ActivityTypeIcon.tsx
    └── opportunities/
        ├── PipelineKanban.tsx   # Drag & drop Kanban columns
        ├── OpportunityCard.tsx  # Deal summary card with INR value
        └── OpportunityModal.tsx
```

### 4.2 Lead Form Breakdown (User Specification Alignment)
The Lead creation modal is structured into 3 distinct visual sections with live validation:

1. **Company & Lead Details**:
   - Company Name (`Input`, required)
   - Lead Status (`Select`: New, Contacted, In Discussion, Qualified, Proposal Sent, Unqualified)
   - Lead Owner (`Select` with workspace team members, required)
   - Lead Source (`Select`: Website, Referral, Cold Call, LinkedIn, Event, Partner, Other)
   - Lead Type (`Select`: Inbound, Outbound, Partner, Expansion)
   - Meeting Date (`Input type="datetime-local"`)
   - Next Contact Date (`Input type="date"`)
   - Expected Conversion Date (`Input type="date"`)

2. **Funnel Information**:
   - Business Unit (`Select`: Enterprise, Mid-Market, SMB, Government, Digital)
   - Revenue Type (`Select`: Recurring, One-time, Fixed Bid, Time & Material)
   - Revenue Category (`Select`: Software License, Implementation, Managed Services, Consulting)
   - Revenue Frequency (`Select`: Monthly, Quarterly, Annually, Milestone)
   - Billing Start Month (`Input type="month"`)
   - Annual Revenue Target (`Input type="number"`, placeholder `₹ Enter expected annual revenue in INR`)
   - Contract Period (`Input type="number"`, min `0`, max `20`, label `Contract duration (Years)`)
   - Must-Win Opportunity Switch (`Toggle` switch with amber star badge and label *"Mark this deal as a must-win opportunity"*)
   - Scope of Work (`Textarea`, rows `3`, placeholder *"Enter scope summary and key requirements"*)

3. **Contact Details**:
   - First Name & Last Name (`Input`, required)
   - Salutation (`Select`: Mr., Ms., Mrs., Dr., Prof.)
   - Gender (`Select`: Male, Female, Non-Binary, Prefer not to say)
   - Designation (`Input`, e.g. CTO, Procurement Manager)
   - Contact Email (`Input type="email"`, required)
   - Contact Phone Number (`Input type="tel"`)
   - Date of Birth (`Input type="date"`)
   - Description / Notes (`Textarea`)
   - LinkedIn Profile ID / URL (`Input`)
   - Twitter / X Profile ID (`Input`)

---

## 5. UI Design Guidelines Compliance

- **Rounded Corners**: Strictly `rounded-md` across all cards, modals, inputs, and badges.
- **Drop Shadows**: Strictly 0 drop shadows (`no shadow-*`), relying on borders (`border border-slate-200`) and subtle slate backgrounds (`bg-slate-50`).
- **Interactive State Cursors**: Every interactive button, tab, row, checkbox, and select trigger displays `cursor-pointer`.
- **Currency Format**: Formatted in Indian Rupees (`₹ 1,50,000`) using `Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' })`.

---

## 6. Implementation Plan & Phases

| Phase | Description | Deliverables |
|---|---|---|
| **Phase 1** | **Backend CRM Foundation** | MongoDB Mongoose schemas, Repositories, NestJS Services, DTOs with `class-validator`, and Controllers in `server/src/modules/crm/`. Registered in `AppModule`. |
| **Phase 2** | **Frontend Types & Services** | `client/src/types/crm.ts` and `client/src/services/crm.service.ts` connected to the backend endpoints. |
| **Phase 3** | **Company CRUD & Contacts UI** | `CompanyModal`, `CompanyTable`, and `CompaniesPage` in `client/src/pages/crm/CompaniesPage.tsx`. `ContactsPage` in `client/src/pages/crm/ContactsPage.tsx`. |
| **Phase 4** | **Leads Management & Form** | Complete 3-section Lead Creation Modal, Lead listing, filtering by status and Must-Win flag in `LeadsPage.tsx`. |
| **Phase 5** | **Sales Activity & Pipeline Operations** | Log activity modal for cold calls, meetings, proposals in `ActivitiesPage.tsx`. Pipeline Kanban and opportunity stages in `OpportunitiesPage.tsx`. |
| **Phase 6** | **Verification & Testing** | Unit tests, client smoke test suite execution (`smoke.test.tsx`), TypeScript typechecking (`npm run typecheck`), and server production build (`nest build`). |
