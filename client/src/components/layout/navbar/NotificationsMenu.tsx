import { Bell, BellOff } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Dropdown } from '@/components/ui'
import { paths, workspaceSegments } from '@/config/paths'
import { useWorkspaceSlug } from '@/hooks/useWorkspaceSlug'

// Notification data arrives with the notifications module (MVP Operations).
export function NotificationsMenu() {
  const slug = useWorkspaceSlug()

  return (
    <Dropdown
      label="Notifications"
      menuClassName="w-96"
      triggerClassName="relative size-9 justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900"
      trigger={<Bell className="size-5" aria-hidden />}
    >
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <p className="text-sm font-semibold text-slate-900">Notifications</p>
        <button
          type="button"
          disabled
          className="text-xs font-medium text-brand-600 hover:text-brand-700 disabled:cursor-default disabled:text-slate-400"
        >
          Mark all as read
        </button>
      </div>
      <div className="flex flex-col items-center px-4 py-10 text-center">
        <BellOff className="size-5 text-slate-400" aria-hidden />
        <p className="mt-2 text-sm text-slate-500">You're all caught up.</p>
      </div>
      <Link
        to={paths.workspace(slug, workspaceSegments.notifications)}
        className="block border-t border-slate-100 py-2.5 text-center text-sm font-medium text-brand-600 hover:bg-slate-50"
      >
        View all notifications
      </Link>
    </Dropdown>
  )
}
