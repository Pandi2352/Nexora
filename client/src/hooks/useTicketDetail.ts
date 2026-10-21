import { useCallback, useEffect, useState } from 'react'
import { toast } from '@/components/ui'
import { extractApiError } from '@/lib/api-client'
import { supportService } from '@/services/support.service'
import type {
  CreateReplyPayload,
  ResolveTicketPayload,
  Ticket,
  TicketEvent,
  TicketPriority,
  TicketReply,
  TicketStatus,
} from '@/types/support'
import { useWorkspaceSlug } from './useWorkspaceSlug'

/** Ticket, conversation and history, plus every action available on the detail page. */
export function useTicketDetail(ticketId: string) {
  const slug = useWorkspaceSlug()
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [replies, setReplies] = useState<TicketReply[]>([])
  const [events, setEvents] = useState<TicketEvent[]>([])
  const [loadError, setLoadError] = useState<unknown>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [busy, setBusy] = useState<string | null>(null)

  const refreshActivity = useCallback(async () => {
    const [nextReplies, nextEvents] = await Promise.all([
      supportService.listReplies(slug, ticketId),
      supportService.listEvents(slug, ticketId),
    ])
    setReplies(nextReplies)
    setEvents(nextEvents)
  }, [slug, ticketId])

  useEffect(() => {
    if (!slug) return
    let active = true
    setIsLoading(true)
    Promise.all([supportService.getTicket(slug, ticketId), refreshActivity()])
      .then(([loaded]) => {
        if (!active) return
        setTicket(loaded)
        setLoadError(null)
      })
      .catch((err: unknown) => active && setLoadError(err))
      .finally(() => active && setIsLoading(false))
    return () => {
      active = false
    }
  }, [slug, ticketId, refreshActivity])

  /** Runs an action, shows the server's message on failure, then refreshes the timeline. */
  const run = useCallback(
    async (key: string, action: () => Promise<Ticket>, success?: string) => {
      setBusy(key)
      try {
        setTicket(await action())
        if (success) toast.success(success)
        await refreshActivity()
        return true
      } catch (err) {
        toast.error(extractApiError(err).message)
        return false
      } finally {
        setBusy(null)
      }
    },
    [refreshActivity],
  )

  return {
    slug,
    ticket,
    replies,
    events,
    loadError,
    isLoading,
    busy,
    changeStatus: (status: TicketStatus) =>
      run('status', () => supportService.changeStatus(slug, ticketId, status), 'Status updated'),
    changePriority: (priority: TicketPriority) =>
      run(
        'priority',
        () => supportService.updateTicket(slug, ticketId, { priority }),
        'Priority updated — SLA targets recalculated',
      ),
    assign: (assigneeId: string | null) =>
      run(
        'assign',
        () => supportService.assign(slug, ticketId, assigneeId),
        assigneeId ? 'Ticket assigned' : 'Ticket unassigned',
      ),
    resolve: (payload: ResolveTicketPayload) =>
      run('resolve', () => supportService.resolve(slug, ticketId, payload), 'Ticket resolved'),
    reopen: (reason?: string) =>
      run('reopen', () => supportService.reopen(slug, ticketId, reason), 'Ticket reopened'),
    addReply: (payload: CreateReplyPayload) =>
      run(
        'reply',
        async () => (await supportService.addReply(slug, ticketId, payload)).ticket,
        payload.type === 'reply' ? 'Reply sent' : 'Internal note added',
      ),
  }
}
