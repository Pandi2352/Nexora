export interface AuditLogItem {
  id: string
  actorId: string
  actorName: string
  actorEmail: string
  action: string
  targetType: string
  targetId?: string
  metadata?: Record<string, unknown>
  ipAddress?: string
  userAgent?: string
  status: 'success' | 'failure'
  createdAt: string
}

export interface AuditLogsResponse {
  items: AuditLogItem[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}
