import { apiClient } from '@/lib/api-client'
import type { User } from '@/types/user'
import type { UserSession } from '@/types/session'

interface ApiResponseWrapper<T> {
  data: T
  message?: string
}

export interface UpdateProfilePayload {
  name?: string
  avatarUrl?: string
  timezone?: string
  locale?: string
}

export interface ChangePasswordPayload {
  currentPassword: string
  newPassword: string
}

export const userService = {
  async getProfile(): Promise<User> {
    const res = await apiClient.get<ApiResponseWrapper<User>>('/users/me')
    return res.data
  },

  async updateProfile(payload: UpdateProfilePayload): Promise<User> {
    const res = await apiClient.patch<ApiResponseWrapper<User>>('/users/me', payload)
    return res.data
  },

  async changePassword(payload: ChangePasswordPayload): Promise<string> {
    const res = await apiClient.post<ApiResponseWrapper<{ success: boolean }>>(
      '/users/me/password',
      payload,
    )
    return res.message || 'Password changed successfully'
  },

  async listSessions(): Promise<UserSession[]> {
    const res = await apiClient.get<ApiResponseWrapper<UserSession[]>>('/users/me/sessions')
    return res.data
  },

  async revokeSession(sessionId: string): Promise<string> {
    const res = await apiClient.delete<ApiResponseWrapper<{ message: string }>>(
      `/users/me/sessions/${sessionId}`,
    )
    return res.message || 'Session revoked successfully'
  },

  async revokeOtherSessions(): Promise<string> {
    const res = await apiClient.post<ApiResponseWrapper<{ message: string }>>(
      '/users/me/sessions/revoke-others',
    )
    return res.message || 'Other sessions revoked successfully'
  },
}
