import { apiClient } from '@/lib/api-client'
import type { ApiResponse, PaginationMeta } from '@/types/api'
import type {
  CreateReplyPayload,
  CreateTicketPayload,
  ResolveTicketPayload,
  Ticket,
  TicketEvent,
  TicketListParams,
  TicketPage,
  TicketReply,
  TicketStats,
  TicketStatus,
  UpdateTicketPayload,
} from '@/types/support'

const base = (orgSlug: string) => `/organizations/${orgSlug}/support/tickets`
const one = (orgSlug: string, id: string) => `${base(orgSlug)}/${id}`

export const supportService = {
  async listTickets(orgSlug: string, params: TicketListParams = {}): Promise<TicketPage> {
    const res = await apiClient.get<ApiResponse<Ticket[]>>(base(orgSlug), { params })
    return { items: res.data, meta: res.meta as PaginationMeta }
  },

  async getStats(orgSlug: string): Promise<TicketStats> {
    return (await apiClient.get<ApiResponse<TicketStats>>(`${base(orgSlug)}/stats`)).data
  },

  async getTicket(orgSlug: string, id: string): Promise<Ticket> {
    return (await apiClient.get<ApiResponse<Ticket>>(one(orgSlug, id))).data
  },

  async createTicket(orgSlug: string, payload: CreateTicketPayload): Promise<Ticket> {
    return (await apiClient.post<ApiResponse<Ticket>>(base(orgSlug), payload)).data
  },

  async updateTicket(orgSlug: string, id: string, payload: UpdateTicketPayload): Promise<Ticket> {
    return (await apiClient.patch<ApiResponse<Ticket>>(one(orgSlug, id), payload)).data
  },

  async deleteTicket(orgSlug: string, id: string): Promise<void> {
    await apiClient.delete(one(orgSlug, id))
  },

  async changeStatus(
    orgSlug: string,
    id: string,
    status: TicketStatus,
    note?: string,
  ): Promise<Ticket> {
    return (
      await apiClient.post<ApiResponse<Ticket>>(`${one(orgSlug, id)}/status`, { status, note })
    ).data
  },

  async assign(orgSlug: string, id: string, assigneeId: string | null): Promise<Ticket> {
    return (await apiClient.post<ApiResponse<Ticket>>(`${one(orgSlug, id)}/assign`, { assigneeId }))
      .data
  },

  async resolve(orgSlug: string, id: string, payload: ResolveTicketPayload): Promise<Ticket> {
    return (await apiClient.post<ApiResponse<Ticket>>(`${one(orgSlug, id)}/resolve`, payload)).data
  },

  async reopen(orgSlug: string, id: string, reason?: string): Promise<Ticket> {
    return (await apiClient.post<ApiResponse<Ticket>>(`${one(orgSlug, id)}/reopen`, { reason }))
      .data
  },

  async listReplies(orgSlug: string, id: string): Promise<TicketReply[]> {
    return (await apiClient.get<ApiResponse<TicketReply[]>>(`${one(orgSlug, id)}/replies`)).data
  },

  async addReply(
    orgSlug: string,
    id: string,
    payload: CreateReplyPayload,
  ): Promise<{ reply: TicketReply; ticket: Ticket }> {
    return (
      await apiClient.post<ApiResponse<{ reply: TicketReply; ticket: Ticket }>>(
        `${one(orgSlug, id)}/replies`,
        payload,
      )
    ).data
  },

  async listEvents(orgSlug: string, id: string): Promise<TicketEvent[]> {
    return (await apiClient.get<ApiResponse<TicketEvent[]>>(`${one(orgSlug, id)}/events`)).data
  },
}
