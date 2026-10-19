import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { useHotkey } from '@/hooks/useHotkey'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { DESKTOP_QUERY, useMediaQuery } from '@/hooks/useMediaQuery'
import { SidebarContext } from './sidebar-context'

export function SidebarProvider({ children }: { children: ReactNode }) {
  const isDesktop = useMediaQuery(DESKTOP_QUERY)
  const [collapsedPref, setCollapsedPref] = useLocalStorage('nexora.sidebar.collapsed', false)
  const [isMobileOpen, setMobileOpen] = useState(false)
  const { pathname } = useLocation()

  const toggleCollapsed = useCallback(() => setCollapsedPref((prev) => !prev), [setCollapsedPref])
  const openMobile = useCallback(() => setMobileOpen(true), [])
  const closeMobile = useCallback(() => setMobileOpen(false), [])
  const toggle = useCallback(() => {
    if (isDesktop) toggleCollapsed()
    else setMobileOpen((prev) => !prev)
  }, [isDesktop, toggleCollapsed])

  // Close the drawer after navigating, or when the viewport grows to desktop.
  const closeKey = `${pathname}|${isDesktop}`
  const [lastCloseKey, setLastCloseKey] = useState(closeKey)
  if (closeKey !== lastCloseKey) {
    setLastCloseKey(closeKey)
    setMobileOpen(false)
  }

  // While the drawer is open: Escape closes it and the page behind does not scroll.
  useEffect(() => {
    if (!isMobileOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileOpen(false)
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [isMobileOpen])

  useHotkey('b', toggle)

  const value = useMemo(
    () => ({
      isCollapsed: isDesktop && collapsedPref,
      isDesktop,
      isMobileOpen,
      toggleCollapsed,
      openMobile,
      closeMobile,
      toggle,
    }),
    [isDesktop, collapsedPref, isMobileOpen, toggleCollapsed, openMobile, closeMobile, toggle],
  )

  return <SidebarContext value={value}>{children}</SidebarContext>
}
