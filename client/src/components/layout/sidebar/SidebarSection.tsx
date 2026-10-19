import { useSidebar } from '@/context/sidebar/sidebar-context'
import type { NavSection } from '@/types/navigation'
import { SidebarGroup } from './SidebarGroup'
import { SidebarLink } from './SidebarLink'

export function SidebarSection({ section, isFirst }: { section: NavSection; isFirst: boolean }) {
  const { isCollapsed } = useSidebar()
  const headingId = `nav-section-${section.id}`

  return (
    <div className={isFirst ? undefined : 'mt-5'}>
      {isCollapsed ? (
        !isFirst && <div aria-hidden className="mx-3 mb-3 border-t border-slate-100" />
      ) : (
        <p
          id={headingId}
          className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400"
        >
          {section.label}
        </p>
      )}
      <ul
        aria-labelledby={isCollapsed ? undefined : headingId}
        aria-label={isCollapsed ? section.label : undefined}
        className="space-y-0.5"
      >
        {section.items.map((item) =>
          item.children?.length ? (
            <SidebarGroup key={item.id} item={item} />
          ) : (
            <SidebarLink key={item.id} item={item} />
          ),
        )}
      </ul>
    </div>
  )
}
