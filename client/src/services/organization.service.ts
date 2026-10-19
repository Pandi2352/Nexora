import { apiClient } from '@/lib/api-client'
import type {
  CreateWorkspacePayload,
  UpdateWorkspacePayload,
  Workspace,
} from '@/types/workspace'

interface ApiResponseWrapper<T> {
  data: T
  message?: string
}

export const organizationService = {
  async list(): Promise<Workspace[]> {
    const res = await apiClient.get<ApiResponseWrapper<Workspace[]>>('/organizations')
    return res.data
  },

  async get(idOrSlug: string): Promise<Workspace> {
    const res = await apiClient.get<ApiResponseWrapper<Workspace>>(`/organizations/${idOrSlug}`)
    return res.data
  },

  async create(payload: CreateWorkspacePayload): Promise<Workspace> {
    const res = await apiClient.post<ApiResponseWrapper<Workspace>>('/organizations', payload)
    return res.data
  },

  async update(idOrSlug: string, payload: UpdateWorkspacePayload): Promise<Workspace> {
    const res = await apiClient.patch<ApiResponseWrapper<Workspace>>(
      `/organizations/${idOrSlug}`,
      payload,
    )
    return res.data
  },

  async transferOwnership(idOrSlug: string, newOwnerUserId: string): Promise<string> {
    const res = await apiClient.post<ApiResponseWrapper<{ message: string }>>(
      `/organizations/${idOrSlug}/transfer-ownership`,
      { newOwnerUserId },
    )
    return res.message || 'Ownership transferred successfully'
  },

  async delete(idOrSlug: string): Promise<string> {
    const res = await apiClient.delete<ApiResponseWrapper<{ message: string }>>(
      `/organizations/${idOrSlug}`,
    )
    return res.message || 'Workspace deleted successfully'
  },

  async leave(idOrSlug: string): Promise<string> {
    const res = await apiClient.post<ApiResponseWrapper<{ message: string }>>(
      `/organizations/${idOrSlug}/leave`,
    )
    return res.message || 'Successfully left workspace'
  },
}
