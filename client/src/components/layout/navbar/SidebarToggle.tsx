import { Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { IconButton } from '@/components/ui'
import { useSidebar } from '@/context/sidebar/sidebar-context'
import { SIDEBAR_ID } from '../sidebar/sidebarStyles'

/** Desktop: collapse/expand the icon rail. Mobile: open the drawer. Also Ctrl+B. */
export function SidebarToggle() {
  const { isDesktop, isCollapsed, isMobileOpen, toggle } = useSidebar()

  const label = isDesktop
    ? isCollapsed
      ? 'Expand sidebar'
      : 'Collapse sidebar'
    : 'Open navigation'
  const Icon = isDesktop ? (isCollapsed ? PanelLeftOpen : PanelLeftClose) : Menu

  return (
    <IconButton
      aria-label={label}
      title={`${label} (Ctrl+B)`}
      aria-controls={SIDEBAR_ID}
      aria-expanded={isDesktop ? !isCollapsed : isMobileOpen}
      onClick={toggle}
    >
      <Icon className="size-5" />
    </IconButton>
  )
}
