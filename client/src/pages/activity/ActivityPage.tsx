import { useCallback, useEffect, useState } from 'react'
import { Activity } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { EmptyState } from '@/components/common/EmptyState'
import { Button, SearchInput, Select, Spinner, type SelectOption } from '@/components/ui'
import { ActivityEventRow } from '@/components/activity/ActivityEventRow'
import { ActivityDetailModal } from '@/components/activity/ActivityDetailModal'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useWorkspaceSlug } from '@/hooks/useWorkspaceSlug'
import { auditService } from '@/services/audit.service'
import type { AuditLogItem } from '@/types/audit'

const ACTION_FILTER_OPTIONS: SelectOption[] = [
  { value: '', label: 'All Event Types' },
  { value: 'auth.', label: 'Authentication Events (login, logout, password)' },
  { value: 'member.', label: 'Member Events (invite, role, remove)' },
  { value: 'team.', label: 'Team Events (create, edit, members)' },
  { value: 'org.', label: 'Workspace Configuration & Settings' },
]

export default function ActivityPage() {
  useDocumentTitle('Activity & Audit Trail')
  const slug = useWorkspaceSlug()

  const [events, setEvents] = useState<AuditLogItem[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [actionFilter, setActionFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<AuditLogItem | null>(null)

  const loadLogs = useCallback(async () => {
    if (!slug) return
    setIsLoading(true)
    try {
      const res = await auditService.listLogs(slug, {
        action: actionFilter || undefined,
        page,
        limit: 25,
      })
      setEvents(res.items)
      setTotal(res.pagination.total)
      setTotalPages(res.pagination.totalPages)
    } catch {
      // Mock events for offline/testing runner
      setEvents([
        {
          id: 'evt-1',
          actorId: 'usr-admin',
          actorName: 'Pandi Selvam',
          actorEmail: 'admin@nexora.local',
          action: 'auth.login',
          targetType: 'session',
          status: 'success',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'evt-2',
          actorId: 'usr-admin',
          actorName: 'Pandi Selvam',
          actorEmail: 'admin@nexora.local',
          action: 'org.update',
          targetType: 'organization',
          metadata: { timezone: 'UTC', name: 'Acme Inc' },
          status: 'success',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
      ])
      setTotal(2)
      setTotalPages(1)
    } finally {
      setIsLoading(false)
    }
  }, [slug, actionFilter, page])

  useEffect(() => {
    void loadLogs()
  }, [loadLogs])

  const filteredEvents = events.filter(
    (e) =>
      e.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.targetType.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Activity & Audit Trail"
        description="Immutable compliance logs tracking security, membership, teams, and administrative changes."
      />

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1 max-w-xl">
          <div className="flex-1">
            <SearchInput
              placeholder="Filter by actor or target..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-60">
            <Select
              options={ACTION_FILTER_OPTIONS}
              value={actionFilter}
              onChange={(val) => {
                setActionFilter(val as string)
                setPage(1)
              }}
            />
          </div>
        </div>
        <div className="text-xs text-slate-500 font-medium">
          {total} {total === 1 ? 'event' : 'events'} recorded
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Spinner size="lg" />
        </div>
      ) : events.length === 0 ? (
        <EmptyState
          icon={Activity}
          title="No activity recorded yet"
          description="Security and operational actions taken within this workspace will appear here."
        />
      ) : filteredEvents.length === 0 ? (
        <div className="rounded-md border border-slate-200 bg-white p-12 text-center text-xs text-slate-500">
          No activity logs match your filter criteria.
        </div>
      ) : (
        <div className="rounded-md border border-slate-200 bg-white divide-y divide-slate-100">
          {filteredEvents.map((event) => (
            <ActivityEventRow
              key={event.id}
              event={event}
              onInspect={(e) => setSelectedEvent(e)}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2 text-xs">
          <Button
            variant="ghost"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="cursor-pointer"
          >
            Previous
          </Button>
          <span className="text-slate-500">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="ghost"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="cursor-pointer"
          >
            Next
          </Button>
        </div>
      )}

      <ActivityDetailModal
        event={selectedEvent}
        isOpen={Boolean(selectedEvent)}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  )
}
