import { UserCheck, UserMinus } from 'lucide-react'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Select,
  type SelectOption,
} from '@/components/ui'
import type { Ticket, TicketPriority, TicketStatus } from '@/types/support'
import { PRIORITY_OPTIONS, STATUS_TRANSITIONS, statusLabel } from '../support-options'

interface TicketPropertiesCardProps {
  ticket: Ticket
  memberOptions: SelectOption[]
  currentUserId?: string
  canEdit: boolean
  canManage: boolean
  busy: string | null
  onStatus: (status: TicketStatus) => void
  onPriority: (priority: TicketPriority) => void
  onAssign: (assigneeId: string | null) => void
}

/** Status (only allowed transitions), priority and assignee controls. */
export function TicketPropertiesCard(props: TicketPropertiesCardProps) {
  const { ticket, currentUserId } = props
  const isClosed = ticket.status === 'closed'
  const statusOptions: SelectOption[] = [ticket.status, ...STATUS_TRANSITIONS[ticket.status]].map(
    (s) => ({
      value: s,
      label: statusLabel(s),
    }),
  )
  // Agents can only take or release their own tickets; managers can route to anyone.
  const assigneeOptions = props.canManage
    ? props.memberOptions
    : props.memberOptions.filter((o) => o.value === currentUserId || o.value === ticket.assigneeId)
  const canTake =
    props.canEdit &&
    !isClosed &&
    !!currentUserId &&
    ticket.assigneeId !== currentUserId &&
    (props.canManage || !ticket.assigneeId)
  const canRelease =
    props.canEdit &&
    !isClosed &&
    !!ticket.assigneeId &&
    (props.canManage || ticket.assigneeId === currentUserId)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Properties</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select
          label="Status"
          options={statusOptions}
          value={ticket.status}
          disabled={!props.canEdit || statusOptions.length === 1 || props.busy === 'status'}
          hint={ticket.status === 'resolved' ? 'Reopen below to continue working on it' : undefined}
          onChange={(status) => status !== ticket.status && props.onStatus(status as TicketStatus)}
        />
        <Select
          label="Priority"
          options={PRIORITY_OPTIONS}
          value={ticket.priority}
          disabled={!props.canEdit || isClosed || props.busy === 'priority'}
          onChange={(priority) => priority !== ticket.priority && props.onPriority(priority)}
        />
        <div>
          <Select
            label="Assignee"
            placeholder="Unassigned"
            options={assigneeOptions}
            value={ticket.assigneeId}
            searchable
            disabled={
              !props.canEdit || isClosed || props.busy === 'assign' || assigneeOptions.length === 0
            }
            onChange={(assigneeId) =>
              assigneeId !== ticket.assigneeId && props.onAssign(assigneeId)
            }
          />
          <div className="mt-1.5 flex flex-wrap gap-1">
            {canTake && currentUserId && (
              <Button variant="ghost" size="sm" onClick={() => props.onAssign(currentUserId)}>
                <UserCheck className="size-4" aria-hidden />
                Assign to me
              </Button>
            )}
            {canRelease && (
              <Button variant="ghost" size="sm" onClick={() => props.onAssign(null)}>
                <UserMinus className="size-4" aria-hidden />
                Unassign
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
