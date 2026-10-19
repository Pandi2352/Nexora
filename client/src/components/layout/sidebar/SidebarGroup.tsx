import { ChevronDown } from 'lucide-react'
import { useId, useMemo, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { paths } from '@/config/paths'
import { useSidebar } from '@/context/sidebar/sidebar-context'
import { useWorkspaceSlug } from '@/hooks/useWorkspaceSlug'
import { cn } from '@/lib/cn'
import { isGroupActive, navItemHref } from '@/lib/navigation'
import type { NavItem } from '@/types/navigation'
import { SidebarFlyout, type FlyoutLink } from './SidebarFlyout'
import { SidebarIcon } from './SidebarIcon'
import { childRowClass, navRowClass } from './sidebarStyles'

/** Item with sub-pages: an expandable list, or a flyout in icon-rail mode. */
export function SidebarGroup({ item }: { item: NavItem }) {
  const { isCollapsed } = useSidebar()
  const slug = useWorkspaceSlug()
  const { pathname } = useLocation()
  const isActive = isGroupActive(item, slug, pathname)
  const [isOpen, setOpen] = useState(isActive)
  const listId = useId()

  const links = useMemo<FlyoutLink[]>(
    () =>
      (item.children ?? []).map((child) => ({
        id: child.id,
        label: child.label,
        to: paths.workspace(slug, child.segment),
      })),
    [item.children, slug],
  )

  // Expand the group the user navigated into, e.g. via search or a notification.
  const [wasActive, setWasActive] = useState(isActive)
  if (isActive !== wasActive) {
    setWasActive(isActive)
    if (isActive) setOpen(true)
  }

  if (isCollapsed) {
    return (
      <li>
        <SidebarFlyout label={item.label} items={links}>
          <NavLink
            to={navItemHref(item, slug)}
            aria-label={item.label}
            className={navRowClass(isActive, true)}
          >
            <SidebarIcon icon={item.icon} active={isActive} />
          </NavLink>
        </SidebarFlyout>
      </li>
    )
  }

  return (
    <li>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={listId}
        onClick={() => setOpen((prev) => !prev)}
        className={navRowClass(isActive && !isOpen, false)}
      >
        <SidebarIcon icon={item.icon} active={isActive} />
        <span className={cn('flex-1 whitespace-nowrap text-left', isActive && 'text-slate-900')}>
          {item.label}
        </span>
        <ChevronDown
          aria-hidden
          className={cn(
            'size-4 shrink-0 text-slate-400 transition-transform duration-200',
            isOpen && 'rotate-180',
          )}
        />
      </button>

      <div
        id={listId}
        inert={!isOpen}
        className={cn(
          'grid transition-[grid-template-rows] duration-200 ease-out',
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
        <ul className="ml-5 mt-0.5 space-y-0.5 overflow-hidden border-l border-slate-200 pl-3">
          {links.map((child) => (
            <li key={child.id}>
              <NavLink to={child.to} end className={({ isActive: on }) => childRowClass(on)}>
                <span className="flex-1 whitespace-nowrap">{child.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </li>
  )
}
