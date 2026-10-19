import { createContext, useContext } from 'react'

export interface SidebarContextValue {
  /** Desktop icon-rail mode (always false on mobile) */
  isCollapsed: boolean
  isDesktop: boolean
  isMobileOpen: boolean
  toggleCollapsed: () => void
  openMobile: () => void
  closeMobile: () => void
  /** Collapses on desktop, opens/closes the drawer on mobile */
  toggle: () => void
}

export const SidebarContext = createContext<SidebarContextValue | null>(null)

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context) throw new Error('useSidebar must be used inside <SidebarProvider>')
  return context
}
