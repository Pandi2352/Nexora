import { Link } from 'react-router-dom'
import { Activity } from 'lucide-react'
import { Avatar } from '@/components/ui'
import { paths, workspaceSegments } from '@/config/paths'
import type { AuditLogItem } from '@/types/audit'
import { ActivityActionBadge } from '@/components/activity/ActivityActionBadge'

interface RecentActivityWidgetProps {
  slug: string
  events: AuditLogItem[]
}

export function RecentActivityWidget({ slug, events }: RecentActivityWidgetProps) {
  const displayEvents = events.slice(0, 5)

  return (
    <div className="rounded-md border border-slate-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Recent Workspace Activity</h3>
          <p className="text-xs text-slate-500">Live feed of security and administrative operations</p>
        </div>
        <Link
          to={paths.workspace(slug, workspaceSegments.activity)}
          className="text-xs font-medium text-brand-600 hover:text-brand-700 cursor-pointer"
        >
          View all activity →
        </Link>
      </div>

      {displayEvents.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-400">
          <Activity className="mx-auto size-6 text-slate-300 mb-1" />
          No recent activity recorded yet
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {displayEvents.map((evt) => (
            <div key={evt.id} className="flex items-center justify-between gap-3 py-3 text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <Avatar name={evt.actorName || 'User'} size="sm" />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-semibold text-slate-900 truncate">
                      {evt.actorName}
                    </span>
                    <ActivityActionBadge action={evt.action} />
                  </div>
                  <span className="text-[11px] text-slate-400 truncate block">
                    Target: {evt.targetType}
                  </span>
                </div>
              </div>
              <span className="shrink-0 text-[11px] font-mono text-slate-400">
                {new Date(evt.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
