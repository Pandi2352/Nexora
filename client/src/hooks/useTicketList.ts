import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supportService } from '@/services/support.service'
import type { PaginationMeta } from '@/types/api'
import type { Ticket, TicketListParams, TicketStats } from '@/types/support'
import { useWorkspaceSlug } from './useWorkspaceSlug'

export type TicketFilterKey =
  'view' | 'search' | 'priority' | 'category' | 'assignee' | 'sla' | 'sort' | 'order'

const DEFAULTS = { view: 'active', sort: 'lastActivityAt', order: 'desc', page: '1', limit: '20' }

/** Ticket queue state. Filters live in the URL, so views are shareable and survive refresh. */
export function useTicketList() {
  const slug = useWorkspaceSlug()
  const [params, setParams] = useSearchParams()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [meta, setMeta] = useState<PaginationMeta | null>(null)
  const [stats, setStats] = useState<TicketStats | null>(null)
  const [error, setError] = useState<unknown>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [reloadKey, setReloadKey] = useState(0)
  const [searchDraft, setSearchDraft] = useState(params.get('search') ?? '')

  const query: TicketListParams = useMemo(() => {
    const get = (key: string) => params.get(key) ?? DEFAULTS[key as keyof typeof DEFAULTS] ?? ''
    return {
      view: get('view') as TicketListParams['view'],
      search: get('search') || undefined,
      priority: (get('priority') || undefined) as TicketListParams['priority'],
      category: (get('category') || undefined) as TicketListParams['category'],
      assignee: get('assignee') || undefined,
      sla: get('sla') === 'breached' ? 'breached' : undefined,
      sort: get('sort') as TicketListParams['sort'],
      order: get('order') as TicketListParams['order'],
      page: Number(get('page')) || 1,
      limit: Number(get('limit')) || 20,
    }
  }, [params])

  const update = useCallback(
    (changes: Partial<Record<TicketFilterKey | 'page' | 'limit', string | undefined>>) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          for (const [key, value] of Object.entries(changes)) {
            if (
              value === undefined ||
              value === '' ||
              value === DEFAULTS[key as keyof typeof DEFAULTS]
            )
              next.delete(key)
            else next.set(key, value)
          }
          if (!('page' in changes)) next.delete('page') // any filter change returns to page 1
          return next
        },
        { replace: true },
      )
    },
    [setParams],
  )

  // Debounce typing into the search box before it hits the URL and the API.
  useEffect(() => {
    const handle = setTimeout(() => {
      if (searchDraft !== (params.get('search') ?? '')) update({ search: searchDraft.trim() })
    }, 300)
    return () => clearTimeout(handle)
  }, [searchDraft, params, update])

  useEffect(() => {
    if (!slug) return
    let active = true
    setIsLoading(true)
    Promise.all([supportService.listTickets(slug, query), supportService.getStats(slug)])
      .then(([page, nextStats]) => {
        if (!active) return
        setTickets(page.items)
        setMeta(page.meta)
        setStats(nextStats)
        setError(null)
      })
      .catch((err: unknown) => active && setError(err))
      .finally(() => active && setIsLoading(false))
    return () => {
      active = false
    }
  }, [slug, query, reloadKey])

  const reset = () => {
    setSearchDraft('')
    setParams(new URLSearchParams(), { replace: true })
  }

  return {
    tickets,
    meta,
    stats,
    error,
    isLoading,
    query,
    searchDraft,
    setSearchDraft,
    update,
    reset,
    isFiltered: [...params.keys()].some((k) => k !== 'page' && k !== 'limit'),
    reload: () => setReloadKey((k) => k + 1),
  }
}
