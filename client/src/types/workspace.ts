export interface Workspace {
  id: string
  name: string
  slug: string
  logoUrl?: string
  role?: string
  timezone?: string
  locale?: string
  membersCount?: number
  createdAt?: string
}

export interface CreateWorkspacePayload {
  name: string
  slug?: string
  timezone?: string
  locale?: string
}

export interface UpdateWorkspacePayload {
  name?: string
  slug?: string
  logoUrl?: string
  timezone?: string
  locale?: string
}
