// Route paths. Components never hard-code URLs; they build them from here.

/** Paths under /workspace/:workspaceSlug. Routes and sidebar items both use these. */
export const workspaceSegments = {
  dashboard: 'dashboard',
  myWork: 'my-work',
  inbox: 'inbox',
  calendar: 'calendar',
  crmCompanies: 'crm/companies',
  crmContacts: 'crm/contacts',
  crmLeads: 'crm/leads',
  crmOpportunities: 'crm/opportunities',
  crmActivities: 'crm/activities',
  crmBusinessUnits: 'crm/business-units',
  projects: 'projects',
  tasks: 'tasks',
  documents: 'documents',
  supportTickets: 'support/tickets',
  automations: 'automations',
  reports: 'reports',
  activity: 'activity',
  notifications: 'notifications',
  account: 'account',
  settingsGeneral: 'settings/general',
  settingsMembers: 'settings/members',
  settingsTeams: 'settings/teams',
  settingsRoles: 'settings/roles',
  settingsNotifications: 'settings/notifications',
  settingsIntegrations: 'settings/integrations',
  settingsSecurity: 'settings/security',
} as const

export type WorkspaceSegment = (typeof workspaceSegments)[keyof typeof workspaceSegments]

export const paths = {
  home: '/',
  welcome: '/welcome',
  login: '/login',
  register: '/register',
  verifyEmail: '/verify-email',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  acceptInvitation: '/accept-invitation',
  oauthCallback: '/auth/callback',
  sessionExpired: '/session-expired',
  twoFactor: '/two-factor',
  workspaces: '/workspaces',
  newWorkspace: '/workspaces/new',
  error: '/error/:status',
  errorPage: (status: number) => `/error/${status}`,
  workspaceRoot: '/workspace/:workspaceSlug',
  workspace: (slug: string, segment: WorkspaceSegment = workspaceSegments.dashboard) =>
    `/workspace/${slug}/${segment}`,
} as const
