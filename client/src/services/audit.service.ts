import { apiClient } from '@/lib/api-client'
import type { AuditLogsResponse } from '@/types/audit'

interface ApiResponseWrapper<T> {
  data: T
  message?: string
}

export const auditService = {
  async listLogs(
    orgSlug: string,
    params?: { action?: string; page?: number; limit?: number },
  ): Promise<AuditLogsResponse> {
    const searchParams = new URLSearchParams()
    if (params?.action) searchParams.set('action', params.action)
    if (params?.page) searchParams.set('page', String(params.page))
    if (params?.limit) searchParams.set('limit', String(params.limit))

    const query = searchParams.toString()
    const url = `/organizations/${orgSlug}/audit${query ? `?${query}` : ''}`
    const res = await apiClient.get<ApiResponseWrapper<AuditLogsResponse>>(url)
    return res.data
  },
}
