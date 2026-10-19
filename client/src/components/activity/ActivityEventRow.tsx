import { Eye } from 'lucide-react'
import { Avatar, Button } from '@/components/ui'
import type { AuditLogItem } from '@/types/audit'
import { ActivityActionBadge } from './ActivityActionBadge'

interface ActivityEventRowProps {
  event: AuditLogItem
  onInspect: (event: AuditLogItem) => void
}

export function ActivityEventRow({ event, onInspect }: ActivityEventRowProps) {
  const formattedDate = new Date(event.createdAt).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 transition-colors hover:bg-slate-50/70">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <Avatar name={event.actorName || 'User'} size="sm" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-slate-900">
              {event.actorName}
            </span>
            <ActivityActionBadge action={event.action} />
          </div>
          <p className="mt-0.5 text-[11px] text-slate-500 truncate">
            Target: <span className="font-medium text-slate-700">{event.targetType}</span>
            {event.targetId ? ` · ID: ${event.targetId.slice(0, 8)}…` : ''}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto shrink-0 border-t sm:border-0 border-slate-100 pt-2 sm:pt-0">
        <span className="text-[11px] text-slate-400 font-mono">
          {formattedDate}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onInspect(event)}
          className="cursor-pointer text-xs text-slate-600 hover:text-slate-900"
        >
          <Eye className="mr-1 size-3.5" />
          Inspect
        </Button>
      </div>
    </div>
  )
}
