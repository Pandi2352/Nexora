import { useSidebar } from '@/context/sidebar/sidebar-context'
import { cn } from '@/lib/cn'
import { SidebarBrand } from './SidebarBrand'
import { SidebarFooter } from './SidebarFooter'
import { SidebarNav } from './SidebarNav'
import { SIDEBAR_ID } from './sidebarStyles'

/**
 * Desktop (lg+): static column that collapses to an icon rail.
 * Mobile: off-canvas drawer with a backdrop.
 */
export function Sidebar() {
  const { isCollapsed, isDesktop, isMobileOpen, closeMobile } = useSidebar()
  const isHiddenDrawer = !isDesktop && !isMobileOpen

  return (
    <>
      <div
        aria-hidden
        onClick={closeMobile}
        className={cn(
          'fixed inset-0 z-40 bg-slate-900/40 transition-opacity lg:hidden',
          isMobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />
      <aside
        id={SIDEBAR_ID}
        inert={isHiddenDrawer}
        className={cn(
          'flex h-dvh shrink-0 flex-col border-r border-slate-200 bg-white',
          'max-lg:fixed max-lg:inset-y-0 max-lg:left-0 max-lg:z-50 max-lg:w-(--sidebar-width) max-lg:transition-transform max-lg:duration-200',
          isMobileOpen ? 'max-lg:translate-x-0' : 'max-lg:-translate-x-full',
          'lg:transition-[width] lg:duration-200',
          isCollapsed ? 'lg:w-(--sidebar-width-collapsed)' : 'lg:w-(--sidebar-width)',
        )}
      >
        <SidebarBrand />
        <SidebarNav />
        <SidebarFooter />
      </aside>
    </>
  )
}
