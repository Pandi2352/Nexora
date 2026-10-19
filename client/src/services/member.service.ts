import { apiClient } from '@/lib/api-client'
import type {
  AcceptInvitationPayload,
  InviteMemberPayload,
  WorkspaceInvitation,
  WorkspaceMember,
} from '@/types/member'

interface ApiResponseWrapper<T> {
  data: T
  message?: string
}

export const memberService = {
  async listMembers(orgSlug: string): Promise<WorkspaceMember[]> {
    const res = await apiClient.get<ApiResponseWrapper<WorkspaceMember[]>>(
      `/organizations/${orgSlug}/members`,
    )
    return res.data
  },

  async updateRole(
    orgSlug: string,
    memberId: string,
    role: string,
  ): Promise<WorkspaceMember> {
    const res = await apiClient.patch<ApiResponseWrapper<WorkspaceMember>>(
      `/organizations/${orgSlug}/members/${memberId}/role`,
      { role },
    )
    return res.data
  },

  async removeMember(orgSlug: string, memberId: string): Promise<string> {
    const res = await apiClient.delete<ApiResponseWrapper<{ message: string }>>(
      `/organizations/${orgSlug}/members/${memberId}`,
    )
    return res.message || 'Member removed'
  },

  async listInvitations(orgSlug: string): Promise<WorkspaceInvitation[]> {
    const res = await apiClient.get<ApiResponseWrapper<WorkspaceInvitation[]>>(
      `/organizations/${orgSlug}/invitations`,
    )
    return res.data
  },

  async sendInvitation(
    orgSlug: string,
    payload: InviteMemberPayload,
  ): Promise<WorkspaceInvitation> {
    const res = await apiClient.post<ApiResponseWrapper<WorkspaceInvitation>>(
      `/organizations/${orgSlug}/invitations`,
      payload,
    )
    return res.data
  },

  async revokeInvitation(orgSlug: string, inviteId: string): Promise<string> {
    const res = await apiClient.delete<ApiResponseWrapper<{ message: string }>>(
      `/organizations/${orgSlug}/invitations/${inviteId}`,
    )
    return res.message || 'Invitation revoked'
  },

  async acceptInvitation(
    payload: AcceptInvitationPayload,
  ): Promise<{ organizationId: string; slug: string; message: string }> {
    const res = await apiClient.post<
      ApiResponseWrapper<{ organizationId: string; slug: string; message: string }>
    >('/invitations/accept', payload)
    return res.data
  },
}
