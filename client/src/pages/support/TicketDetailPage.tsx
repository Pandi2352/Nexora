import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ErrorState } from '@/components/common/ErrorState'
import { PageSkeleton } from '@/components/common/PageSkeleton'
import { TicketActivityTabs } from '@/components/support/detail/TicketActivityTabs'
import { TicketConversation } from '@/components/support/detail/TicketConversation'
import { TicketDetailHeader } from '@/components/support/detail/TicketDetailHeader'
import { TicketHistoryTimeline } from '@/components/support/detail/TicketHistoryTimeline'
import { TicketPropertiesCard } from '@/components/support/detail/TicketPropertiesCard'
import { TicketReplyComposer } from '@/components/support/detail/TicketReplyComposer'
import { TicketRequesterCard } from '@/components/support/detail/TicketRequesterCard'
import { TicketResolutionPanel } from '@/components/support/detail/TicketResolutionPanel'
import { TicketSlaCard } from '@/components/support/detail/TicketSlaCard'
import { ConfirmDialog, toast } from '@/components/ui'
import { paths, workspaceSegments } from '@/config/paths'
import { useAuth } from '@/context/auth/auth-context'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { usePermission } from '@/hooks/usePermission'
import { useTicketDetail } from '@/hooks/useTicketDetail'
import { useWorkspaceMembers } from '@/hooks/useWorkspaceMembers'
import { extractApiError } from '@/lib/api-client'
import { resolveError } from '@/lib/errors'
import { supportService } from '@/services/support.service'

/** Ticket workspace: conversation, history, properties, SLA and resolution (`/support/tickets/:id`). */
export default function TicketDetailPage() {
  const { ticketId = '' } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const detail = useTicketDetail(ticketId)
  const { options: memberOptions, nameById } = useWorkspaceMembers()
  const { hasPermission } = usePermission()
  const canEdit = hasPermission('tickets:write')
  const canManage = hasPermission('tickets:manage')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { ticket, slug } = detail
  useDocumentTitle(ticket ? `${ticket.ticketKey} · ${ticket.subject}` : 'Ticket')

  if (detail.loadError) return <ErrorState error={resolveError(detail.loadError)} />
  if (detail.isLoading || !ticket) return <PageSkeleton />

  const remove = async () => {
    setIsDeleting(true)
    try {
      await supportService.deleteTicket(slug, ticket.id)
      toast.success(`${ticket.ticketKey} deleted`)
      navigate(paths.workspace(slug, workspaceSegments.supportTickets))
    } catch (err) {
      toast.error(extractApiError(err).message)
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6 pb-16">
      <TicketDetailHeader
        ticket={ticket}
        slug={slug}
        canEdit={canEdit}
        canDelete={canManage}
        onDelete={() => setConfirmDelete(true)}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="min-w-0 space-y-6 xl:col-span-2">
          <TicketResolutionPanel
            ticket={ticket}
            nameById={nameById}
            canEdit={canEdit}
            busy={detail.busy}
            onResolve={detail.resolve}
            onReopen={detail.reopen}
          />
          <TicketActivityTabs
            conversationCount={detail.replies.length + 1}
            historyCount={detail.events.length}
            conversation={
              <div className="space-y-6">
                <TicketConversation ticket={ticket} replies={detail.replies} />
                {canEdit && ticket.status !== 'closed' && (
                  <TicketReplyComposer
                    status={ticket.status}
                    isSending={detail.busy === 'reply'}
                    onSend={detail.addReply}
                  />
                )}
              </div>
            }
            history={<TicketHistoryTimeline events={detail.events} nameById={nameById} />}
          />
        </div>

        <aside className="space-y-4">
          <TicketPropertiesCard
            ticket={ticket}
            memberOptions={memberOptions}
            currentUserId={user?.id}
            canEdit={canEdit}
            canManage={canManage}
            busy={detail.busy}
            onStatus={detail.changeStatus}
            onPriority={detail.changePriority}
            onAssign={detail.assign}
          />
          <TicketSlaCard ticket={ticket} />
          <TicketRequesterCard ticket={ticket} />
        </aside>
      </div>

      <ConfirmDialog
        isOpen={confirmDelete}
        onClose={() => !isDeleting && setConfirmDelete(false)}
        onConfirm={remove}
        title="Delete ticket?"
        description={`${ticket.ticketKey} will be removed from every queue. Its history stays in the audit log.`}
        confirmLabel="Delete ticket"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  )
}
