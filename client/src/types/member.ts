export interface WorkspaceMember {
  id: string
  userId: string
  name: string
  email: string
  avatarUrl?: string
  role: string
  status: string
  joinedAt: string
}

export interface WorkspaceInvitation {
  id: string
  email: string
  role: string
  status: string
  expiresAt: string
  createdAt?: string
}

export interface InviteMemberPayload {
  email: string
  role: string
}

export interface AcceptInvitationPayload {
  token: string
  name?: string
  password?: string
}
