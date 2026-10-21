import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import { TicketFilterBar } from '@/components/support/list/TicketFilterBar'
import { TicketQueueResults } from '@/components/support/list/TicketQueueResults'
import { TicketStatsStrip } from '@/components/support/list/TicketStatsStrip'
import { TicketViewTabs } from '@/components/support/list/TicketViewTabs'
import { ConfirmDialog, buttonVariants, toast } from '@/components/ui'
import { paths, workspaceSegments } from '@/config/paths'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { usePermission } from '@/hooks/usePermission'
import { useTicketList } from '@/hooks/useTicketList'
import { useWorkspaceMembers } from '@/hooks/useWorkspaceMembers'
import { useWorkspaceSlug } from '@/hooks/useWorkspaceSlug'
import { extractApiError } from '@/lib/api-client'
import { supportService } from '@/services/support.service'
import type { Ticket, TicketView } from '@/types/support'

export default function TicketsPage() {
  useDocumentTitle('Support tickets')
  const slug = useWorkspaceSlug()
  const list = useTicketList()
  const { options: memberOptions, nameById } = useWorkspaceMembers()
  const { hasPermission } = usePermission()
  const canEdit = hasPermission('tickets:write')
  const canDelete = hasPermission('tickets:manage')

  const [ticketToDelete, setTicketToDelete] = useState<Ticket | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const confirmDelete = async () => {
    if (!ticketToDelete) return
    setIsDeleting(true)
    try {
      await supportService.deleteTicket(slug, ticketToDelete.id)
      toast.success(`${ticketToDelete.ticketKey} deleted`)
      setTicketToDelete(null)
      list.reload()
    } catch (err) {
      toast.error(extractApiError(err).message)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Support tickets"
        description="Customer and internal requests with SLA tracking, replies, internal notes and resolutions."
        actions={
          canEdit && (
            <Link
              to={paths.workspace(slug, workspaceSegments.supportTicketNew)}
              className={buttonVariants({ variant: 'primary' })}
            >
              <Plus className="size-4" aria-hidden />
              New ticket
            </Link>
          )
        }
      />

      <TicketStatsStrip
        stats={list.stats}
        onShowUnassigned={() =>
          list.update({ view: 'active', assignee: 'unassigned', sla: undefined })
        }
        onShowBreached={() => list.update({ view: 'active', sla: 'breached', assignee: undefined })}
      />

      <TicketViewTabs
        value={list.query.view ?? 'active'}
        stats={list.stats}
        onChange={(view: TicketView) => list.update({ view })}
      />

      <TicketFilterBar
        query={list.query}
        searchDraft={list.searchDraft}
        onSearchChange={list.setSearchDraft}
        memberOptions={memberOptions}
        onChange={list.update}
        isFiltered={list.isFiltered}
        onReset={list.reset}
        onRefresh={list.reload}
        isRefreshing={list.isLoading}
      />

      <TicketQueueResults
        slug={slug}
        tickets={list.tickets}
        meta={list.meta}
        error={list.error}
        isLoading={list.isLoading}
        isFiltered={list.isFiltered}
        nameById={nameById}
        canEdit={canEdit}
        canDelete={canDelete}
        onDelete={setTicketToDelete}
        onRetry={list.reload}
        onPageChange={(page) => list.update({ page: String(page) })}
        onPageSizeChange={(size) => list.update({ limit: String(size), page: '1' })}
      />

      <ConfirmDialog
        isOpen={!!ticketToDelete}
        onClose={() => !isDeleting && setTicketToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete ticket?"
        description={
          ticketToDelete && (
            <span>
              <strong className="font-semibold text-slate-900">{ticketToDelete.ticketKey}</strong> “
              {ticketToDelete.subject}” will be removed from every queue. Its history stays in the
              audit log.
            </span>
          )
        }
        confirmLabel="Delete ticket"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  )
}
