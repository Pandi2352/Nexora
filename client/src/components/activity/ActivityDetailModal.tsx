import { Button, Modal, Badge } from '@/components/ui'
import type { AuditLogItem } from '@/types/audit'
import { ActivityActionBadge } from './ActivityActionBadge'

interface ActivityDetailModalProps {
  event: AuditLogItem | null
  isOpen: boolean
  onClose: () => void
}

export function ActivityDetailModal({
  event,
  isOpen,
  onClose,
}: ActivityDetailModalProps) {
  if (!event) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Audit Event Details"
      description={`Detailed immutable record for event ${event.id}`}
      size="lg"
    >
      <div className="space-y-4 text-xs">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 rounded-md border border-slate-200 bg-slate-50/70 p-3">
          <div>
            <span className="block text-[11px] text-slate-500 font-medium">Action</span>
            <div className="mt-1">
              <ActivityActionBadge action={event.action} />
            </div>
          </div>

          <div>
            <span className="block text-[11px] text-slate-500 font-medium">Status</span>
            <div className="mt-1">
              <Badge variant={event.status === 'success' ? 'success' : 'critical'} size="sm">
                {event.status}
              </Badge>
            </div>
          </div>

          <div>
            <span className="block text-[11px] text-slate-500 font-medium">Timestamp</span>
            <span className="mt-1 block font-mono text-[11px] text-slate-700">
              {new Date(event.createdAt).toLocaleString()}
            </span>
          </div>

          <div>
            <span className="block text-[11px] text-slate-500 font-medium">Actor</span>
            <span className="mt-0.5 block font-medium text-slate-900 truncate">
              {event.actorName}
            </span>
            <span className="block text-[10px] text-slate-500 truncate">{event.actorEmail}</span>
          </div>

          <div>
            <span className="block text-[11px] text-slate-500 font-medium">Target Type</span>
            <span className="mt-0.5 block font-mono text-[11px] text-slate-800">
              {event.targetType} {event.targetId ? `(${event.targetId.slice(0, 8)}…)` : ''}
            </span>
          </div>

          <div>
            <span className="block text-[11px] text-slate-500 font-medium">IP Address</span>
            <span className="mt-0.5 block font-mono text-[11px] text-slate-700">
              {event.ipAddress || 'Internal / System'}
            </span>
          </div>
        </div>

        {event.metadata && Object.keys(event.metadata).length > 0 && (
          <div>
            <span className="block text-xs font-semibold text-slate-700 mb-1.5">
              Event Payload & Metadata
            </span>
            <pre className="rounded-md border border-slate-200 bg-slate-900 p-3 font-mono text-[11px] text-slate-100 overflow-x-auto max-h-56">
              {JSON.stringify(event.metadata, null, 2)}
            </pre>
          </div>
        )}

        {event.userAgent && (
          <div className="text-[11px] text-slate-500 truncate">
            <span className="font-semibold text-slate-600">Client Agent: </span>
            {event.userAgent}
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button variant="ghost" onClick={onClose} className="cursor-pointer">
            Close
          </Button>
        </div>
      </div>
    </Modal>
  )
}
