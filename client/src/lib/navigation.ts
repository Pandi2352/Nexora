import { hiddenNavigation, navigation } from '@/config/navigation'
import { paths } from '@/config/paths'
import type { NavItem, NavTrailItem } from '@/types/navigation'

export function isPathActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

/** Link target for a nav item: its own segment, or its first child's for groups. */
export function navItemHref(item: NavItem, slug: string) {
  const segment = item.segment ?? item.children?.[0]?.segment
  return segment ? paths.workspace(slug, segment) : paths.workspace(slug)
}

export function isGroupActive(item: NavItem, slug: string, pathname: string) {
  return (item.children ?? []).some((child) =>
    isPathActive(pathname, paths.workspace(slug, child.segment)),
  )
}

/** Trail (group → page) for the current workspace path, derived from the sidebar config. Used for page titles. */
export function findNavTrail(pathname: string, slug: string): NavTrailItem[] {
  for (const section of navigation) {
    for (const item of section.items) {
      if (item.segment && isPathActive(pathname, paths.workspace(slug, item.segment))) {
        return [{ label: item.label }]
      }

      const child = item.children?.find((c) =>
        isPathActive(pathname, paths.workspace(slug, c.segment)),
      )
      if (child) {
        const first = item.children?.[0]
        return [
          { label: item.label, to: first && paths.workspace(slug, first.segment) },
          { label: child.label },
        ]
      }
    }
  }

  const hidden = hiddenNavigation.find((h) =>
    isPathActive(pathname, paths.workspace(slug, h.segment)),
  )
  return hidden ? [{ label: hidden.label }] : []
}
