import { apiClient } from '@/lib/api-client'
import type {
  CreateTeamPayload,
  TeamDetail,
  TeamSummary,
  UpdateTeamPayload,
} from '@/types/team'

interface ApiResponseWrapper<T> {
  data: T
  message?: string
}

export const teamService = {
  async listTeams(orgSlug: string): Promise<TeamSummary[]> {
    const res = await apiClient.get<ApiResponseWrapper<TeamSummary[]>>(
      `/organizations/${orgSlug}/teams`,
    )
    return res.data
  },

  async getTeam(orgSlug: string, teamId: string): Promise<TeamDetail> {
    const res = await apiClient.get<ApiResponseWrapper<TeamDetail>>(
      `/organizations/${orgSlug}/teams/${teamId}`,
    )
    return res.data
  },

  async createTeam(
    orgSlug: string,
    payload: CreateTeamPayload,
  ): Promise<TeamSummary> {
    const res = await apiClient.post<ApiResponseWrapper<TeamSummary>>(
      `/organizations/${orgSlug}/teams`,
      payload,
    )
    return res.data
  },

  async updateTeam(
    orgSlug: string,
    teamId: string,
    payload: UpdateTeamPayload,
  ): Promise<TeamSummary> {
    const res = await apiClient.patch<ApiResponseWrapper<TeamSummary>>(
      `/organizations/${orgSlug}/teams/${teamId}`,
      payload,
    )
    return res.data
  },

  async deleteTeam(orgSlug: string, teamId: string): Promise<string> {
    const res = await apiClient.delete<ApiResponseWrapper<{ message: string }>>(
      `/organizations/${orgSlug}/teams/${teamId}`,
    )
    return res.message || 'Team deleted successfully'
  },

  async addMembers(
    orgSlug: string,
    teamId: string,
    userIds: string[],
  ): Promise<TeamDetail> {
    const res = await apiClient.post<ApiResponseWrapper<TeamDetail>>(
      `/organizations/${orgSlug}/teams/${teamId}/members`,
      { userIds },
    )
    return res.data
  },

  async removeMember(
    orgSlug: string,
    teamId: string,
    userId: string,
  ): Promise<string> {
    const res = await apiClient.delete<ApiResponseWrapper<{ message: string }>>(
      `/organizations/${orgSlug}/teams/${teamId}/members/${userId}`,
    )
    return res.message || 'Member removed from team'
  },
}
