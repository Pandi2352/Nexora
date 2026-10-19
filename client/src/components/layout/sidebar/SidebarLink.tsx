import { NavLink } from 'react-router-dom'
import { useSidebar } from '@/context/sidebar/sidebar-context'
import { useWorkspaceSlug } from '@/hooks/useWorkspaceSlug'
import { navItemHref } from '@/lib/navigation'
import type { NavItem } from '@/types/navigation'
import { SidebarFlyout } from './SidebarFlyout'
import { SidebarIcon } from './SidebarIcon'
import { navRowClass } from './sidebarStyles'

/** Top-level item without sub-pages. */
export function SidebarLink({ item }: { item: NavItem }) {
  const { isCollapsed } = useSidebar()
  const slug = useWorkspaceSlug()

  const link = (
    <NavLink
      to={navItemHref(item, slug)}
      aria-label={isCollapsed ? item.label : undefined}
      className={({ isActive }) => navRowClass(isActive, isCollapsed)}
    >
      {({ isActive }) => (
        <>
          <SidebarIcon icon={item.icon} active={isActive} />
          {!isCollapsed && <span className="flex-1 whitespace-nowrap">{item.label}</span>}
        </>
      )}
    </NavLink>
  )

  return <li>{isCollapsed ? <SidebarFlyout label={item.label}>{link}</SidebarFlyout> : link}</li>
}
