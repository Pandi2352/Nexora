export interface UserSession {
  id: string
  userAgent: string
  ipAddress: string
  isCurrent: boolean
  createdAt: string
  expiresAt: string
}
