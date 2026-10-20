import {
  Activity,
  Briefcase,
  CalendarDays,
  ChartColumn,
  FileText,
  FolderKanban,
  Handshake,
  Inbox,
  LayoutDashboard,
  LifeBuoy,
  Settings,
  SquareCheckBig,
  Users,
  Workflow,
} from 'lucide-react'
import { workspaceSegments as s } from '@/config/paths'
import type { NavLinkItem, NavSection } from '@/types/navigation'

// Sidebar menus. Source: docs/SIDEBAR_MENU.md (MVP and P1 items).
export const navigation: NavSection[] = [
  {
    id: 'home',
    label: 'Home',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, segment: s.dashboard },
      { id: 'my-work', label: 'My Work', icon: Briefcase, segment: s.myWork },
      { id: 'inbox', label: 'Inbox', icon: Inbox, segment: s.inbox },
      { id: 'calendar', label: 'Calendar', icon: CalendarDays, segment: s.calendar },
    ],
  },
  {
    id: 'sales',
    label: 'Sales',
    items: [
      {
        id: 'crm',
        label: 'CRM',
        icon: Handshake,
        children: [
          { id: 'crm-dashboard', label: 'CRM Dashboard', segment: s.crmDashboard },
          { id: 'companies', label: 'Companies', segment: s.crmCompanies },
          { id: 'contacts', label: 'Contacts', segment: s.crmContacts },
          { id: 'leads', label: 'Leads', segment: s.crmLeads },
          { id: 'opportunities', label: 'Opportunities', segment: s.crmOpportunities },
          { id: 'activities', label: 'Activities', segment: s.crmActivities },
          { id: 'business-units', label: 'Business Units', segment: s.crmBusinessUnits },
        ],
      },
    ],
  },
  {
    id: 'work',
    label: 'Work',
    items: [
      { id: 'projects', label: 'Projects', icon: FolderKanban, segment: s.projects },
      { id: 'tasks', label: 'Tasks', icon: SquareCheckBig, segment: s.tasks },
    ],
  },
  {
    id: 'content',
    label: 'Content',
    items: [{ id: 'documents', label: 'Documents', icon: FileText, segment: s.documents }],
  },
  {
    id: 'service',
    label: 'Service',
    items: [{ id: 'support', label: 'Support', icon: LifeBuoy, segment: s.supportTickets }],
  },
  {
    id: 'operations',
    label: 'Operations',
    items: [
      { id: 'automations', label: 'Automations', icon: Workflow, segment: s.automations },
      { id: 'reports', label: 'Reports', icon: ChartColumn, segment: s.reports },
      { id: 'activity', label: 'Activity', icon: Activity, segment: s.activity },
    ],
  },
  {
    id: 'admin',
    label: 'Admin',
    items: [
      {
        id: 'user-management',
        label: 'User Management',
        icon: Users,
        children: [
          { id: 'members', label: 'Members', segment: s.settingsMembers },
          { id: 'teams', label: 'Teams', segment: s.settingsTeams },
          { id: 'roles', label: 'Roles', segment: s.settingsRoles },
          { id: 'security', label: 'Authentication & Security', segment: s.settingsSecurity },
        ],
      },
      {
        id: 'settings',
        label: 'Settings',
        icon: Settings,
        children: [
          { id: 'general', label: 'General', segment: s.settingsGeneral },
          {
            id: 'settings-notifications',
            label: 'Notifications',
            segment: s.settingsNotifications,
          },
          { id: 'integrations', label: 'Integrations', segment: s.settingsIntegrations },
        ],
      },
    ],
  },
]

/** Workspace pages reached from outside the sidebar (navbar menus). Used for titles and breadcrumbs. */
export const hiddenNavigation: NavLinkItem[] = [
  { id: 'notifications', label: 'Notifications', segment: s.notifications },
  { id: 'account', label: 'My account', segment: s.account },
]
