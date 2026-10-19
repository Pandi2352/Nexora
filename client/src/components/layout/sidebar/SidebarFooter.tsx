import { NavLink } from 'react-router-dom'
import { Avatar } from '@/components/ui'
import { paths, workspaceSegments } from '@/config/paths'
import { useSidebar } from '@/context/sidebar/sidebar-context'
import { mockMembershipRole, mockUser } from '@/data/user'
import { useWorkspaceSlug } from '@/hooks/useWorkspaceSlug'
import { cn } from '@/lib/cn'
import { SidebarFlyout } from './SidebarFlyout'

// The collapse/expand toggle lives at the end of the navbar (navbar/SidebarToggle).
export function SidebarFooter() {
  const { isCollapsed } = useSidebar()
  const slug = useWorkspaceSlug()

  const accountLink = (
    <NavLink
      to={paths.workspace(slug, workspaceSegments.account)}
      aria-label={isCollapsed ? `${mockUser.name}, ${mockMembershipRole}` : undefined}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-md p-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
          isCollapsed && 'justify-center',
          isActive ? 'bg-brand-50' : 'hover:bg-slate-100',
        )
      }
    >
      <Avatar name={mockUser.name} />
      {!isCollapsed && (
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium text-slate-900">{mockUser.name}</span>
          <span className="block truncate text-xs text-slate-500">{mockMembershipRole}</span>
        </span>
      )}
    </NavLink>
  )

  return (
    <div className="shrink-0 border-t border-slate-200 p-3">
      {isCollapsed ? (
        <SidebarFlyout label={mockUser.name}>{accountLink}</SidebarFlyout>
      ) : (
        accountLink
      )}
    </div>
  )
}
