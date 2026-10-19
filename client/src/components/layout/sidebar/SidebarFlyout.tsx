import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { childRowClass } from './sidebarStyles'

export interface FlyoutLink {
  id: string
  label: string
  to: string
}

interface SidebarFlyoutProps {
  label: string
  /** Sub-pages listed in the flyout; omit for a plain label tooltip. */
  items?: FlyoutLink[]
  children: ReactNode
}

const VIEWPORT_MARGIN = 8

/**
 * Icon-rail mode: shows the item label (and sub-pages) beside the rail on hover or focus.
 * Uses fixed positioning so the scrolling nav does not clip it.
 */
export function SidebarFlyout({ label, items, children }: SidebarFlyoutProps) {
  const anchorRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const hideTimer = useRef<number | undefined>(undefined)
  const [anchor, setAnchor] = useState<DOMRect | null>(null)

  const show = () => {
    window.clearTimeout(hideTimer.current)
    if (anchorRef.current) setAnchor(anchorRef.current.getBoundingClientRect())
  }
  const hide = () => {
    window.clearTimeout(hideTimer.current)
    hideTimer.current = window.setTimeout(() => setAnchor(null), 100)
  }

  useEffect(() => () => window.clearTimeout(hideTimer.current), [])

  // Keep the panel inside the viewport for items near the bottom of the rail.
  useLayoutEffect(() => {
    const panel = panelRef.current
    if (!anchor || !panel) return
    const maxTop = window.innerHeight - panel.offsetHeight - VIEWPORT_MARGIN
    panel.style.top = `${Math.max(VIEWPORT_MARGIN, Math.min(anchor.top - 6, maxTop))}px`
  }, [anchor])

  return (
    <div
      ref={anchorRef}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) hide()
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape') setAnchor(null)
      }}
      onClick={() => setAnchor(null)}
    >
      {children}
      {anchor && (
        <div ref={panelRef} className="fixed z-50 pl-3" style={{ left: anchor.right }}>
          <div className="min-w-52 rounded-md border border-slate-200 bg-white py-1.5">
            <p className="px-3 py-1.5 text-sm font-semibold text-slate-900">{label}</p>
            {items && (
              <ul className="px-1.5 pb-0.5">
                {items.map((child) => (
                  <li key={child.id}>
                    <NavLink
                      to={child.to}
                      end
                      className={({ isActive }) => childRowClass(isActive)}
                    >
                      {child.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
