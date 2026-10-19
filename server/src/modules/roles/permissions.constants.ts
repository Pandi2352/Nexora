export interface PermissionMetadata {
  key: string;
  name: string;
  description: string;
  category: 'Workspace' | 'Team & Members' | 'Projects & Tasks' | 'CRM' | 'Service & Audit';
}

export const PERMISSION_DEFINITIONS: PermissionMetadata[] = [
  // Workspace & Settings
  {
    key: 'org:read',
    name: 'View Workspace',
    description: 'View workspace profile, summary, and public details',
    category: 'Workspace',
  },
  {
    key: 'org:update',
    name: 'Update Workspace',
    description: 'Edit workspace name, logo, timezone, and general configuration',
    category: 'Workspace',
  },
  {
    key: 'org:delete',
    name: 'Delete Workspace',
    description: 'Permanently remove or soft-delete the workspace',
    category: 'Workspace',
  },
  {
    key: 'org:transfer',
    name: 'Transfer Ownership',
    description: 'Transfer workspace ownership to another administrator',
    category: 'Workspace',
  },

  // Members & Teams
  {
    key: 'members:read',
    name: 'View Members',
    description: 'View list of active members and pending invitations',
    category: 'Team & Members',
  },
  {
    key: 'members:invite',
    name: 'Invite Members',
    description: 'Send invitations to new users with assigned roles',
    category: 'Team & Members',
  },
  {
    key: 'members:manage',
    name: 'Manage Roles',
    description: 'Change member roles, suspend, or reactivate accounts',
    category: 'Team & Members',
  },
  {
    key: 'members:remove',
    name: 'Remove Members',
    description: 'Revoke workspace membership and access',
    category: 'Team & Members',
  },
  {
    key: 'teams:read',
    name: 'View Teams',
    description: 'View functional departments and team rosters',
    category: 'Team & Members',
  },
  {
    key: 'teams:create',
    name: 'Create Teams',
    description: 'Create new functional teams and departments',
    category: 'Team & Members',
  },
  {
    key: 'teams:manage',
    name: 'Manage Teams',
    description: 'Assign team leads and add/remove members from teams',
    category: 'Team & Members',
  },
  {
    key: 'teams:delete',
    name: 'Delete Teams',
    description: 'Disband and delete teams',
    category: 'Team & Members',
  },

  // Projects & Tasks
  {
    key: 'projects:read',
    name: 'View Projects',
    description: 'Browse workspace project boards and roadmaps',
    category: 'Projects & Tasks',
  },
  {
    key: 'projects:write',
    name: 'Create & Edit Projects',
    description: 'Create, edit, and manage project milestones',
    category: 'Projects & Tasks',
  },
  {
    key: 'projects:delete',
    name: 'Delete Projects',
    description: 'Archive or permanently delete projects',
    category: 'Projects & Tasks',
  },
  {
    key: 'tasks:manage',
    name: 'Manage Tasks',
    description: 'Create, assign, modify, and close tasks',
    category: 'Projects & Tasks',
  },

  // CRM
  {
    key: 'crm:read',
    name: 'View CRM Records',
    description: 'View leads, contacts, deals, and pipeline stages',
    category: 'CRM',
  },
  {
    key: 'crm:write',
    name: 'Manage CRM Records',
    description: 'Create and update contacts, deals, and activities',
    category: 'CRM',
  },
  {
    key: 'crm:delete',
    name: 'Delete CRM Records',
    description: 'Remove records from the CRM database',
    category: 'CRM',
  },

  // Service & Audit
  {
    key: 'tickets:read',
    name: 'View Support Tickets',
    description: 'Read customer service tickets and conversation history',
    category: 'Service & Audit',
  },
  {
    key: 'tickets:write',
    name: 'Respond to Tickets',
    description: 'Reply to customer queries and update ticket status',
    category: 'Service & Audit',
  },
  {
    key: 'tickets:manage',
    name: 'Manage Support Queue',
    description: 'Assign tickets to team members and set SLAs',
    category: 'Service & Audit',
  },
  {
    key: 'audit:read',
    name: 'View Audit Logs',
    description: 'Inspect security and administrative audit event trails',
    category: 'Service & Audit',
  },
];

export const SYSTEM_ROLE_PERMISSIONS: Record<string, string[]> = {
  owner: PERMISSION_DEFINITIONS.map((p) => p.key),
  admin: PERMISSION_DEFINITIONS.filter(
    (p) => p.key !== 'org:delete' && p.key !== 'org:transfer',
  ).map((p) => p.key),
  manager: [
    'org:read',
    'members:read',
    'teams:read',
    'teams:manage',
    'projects:read',
    'projects:write',
    'tasks:manage',
    'crm:read',
    'crm:write',
    'tickets:read',
    'tickets:write',
    'tickets:manage',
    'audit:read',
  ],
  member: [
    'org:read',
    'members:read',
    'teams:read',
    'projects:read',
    'projects:write',
    'tasks:manage',
    'crm:read',
    'crm:write',
    'tickets:read',
    'tickets:write',
  ],
  support_agent: [
    'org:read',
    'members:read',
    'teams:read',
    'tickets:read',
    'tickets:write',
    'crm:read',
  ],
};
