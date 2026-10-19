import type { Workspace } from '@/types/workspace'

// Development mock data. Replaced by the organizations API in MVP 1.
export const mockWorkspaces: Workspace[] = [
  { id: '7c9e6679-7425-40de-944b-e07fc1f90ae7', name: 'Acme Inc', slug: 'acme' },
  { id: '3f2504e0-4f89-41d3-9a0c-0305e82c3301', name: 'Globex', slug: 'globex' },
]

export const defaultWorkspaceSlug = 'acme'
