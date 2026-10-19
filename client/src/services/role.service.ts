import { apiClient } from '@/lib/api-client'
import type {
  RoleDefinition,
  RolesMatrixResponse,
  UserWorkspacePermissions,
} from '@/types/role'

interface ApiResponseWrapper<T> {
  data: T
  message?: string
}

export const roleService = {
  async getRoles(orgSlug: string): Promise<RoleDefinition[]> {
    const res = await apiClient.get<ApiResponseWrapper<RoleDefinition[]>>(
      `/organizations/${orgSlug}/roles`,
    )
    return res.data
  },

  async getMatrix(orgSlug: string): Promise<RolesMatrixResponse> {
    const res = await apiClient.get<ApiResponseWrapper<RolesMatrixResponse>>(
      `/organizations/${orgSlug}/roles/matrix`,
    )
    return res.data
  },

  async getMyPermissions(orgSlug: string): Promise<UserWorkspacePermissions> {
    const res = await apiClient.get<ApiResponseWrapper<UserWorkspacePermissions>>(
      `/organizations/${orgSlug}/roles/me`,
    )
    return res.data
  },
}
