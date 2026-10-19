import { X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Logo } from '@/components/common/Logo'
import { IconButton } from '@/components/ui'
import { paths } from '@/config/paths'
import { useSidebar } from '@/context/sidebar/sidebar-context'
import { mockWorkspaces } from '@/data/workspaces'
import { useWorkspaceSlug } from '@/hooks/useWorkspaceSlug'
import { cn } from '@/lib/cn'

export function SidebarBrand() {
  const { isCollapsed, closeMobile } = useSidebar()
  const slug = useWorkspaceSlug()
  const workspace = mockWorkspaces.find((w) => w.slug === slug)

  return (
    <div
      className={cn(
        'flex h-16 shrink-0 items-center border-b border-slate-200',
        isCollapsed ? 'justify-center px-3' : 'gap-3 px-4',
      )}
    >
      <Link
        to={paths.workspace(slug)}
        aria-label="Nexora OS home"
        className="flex min-w-0 items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
      >
        <Logo
          size="md"
          variant={isCollapsed ? 'mark' : 'full'}
          subtitle={workspace?.name}
        />
      </Link>
      <IconButton aria-label="Close navigation" onClick={closeMobile} className="ml-auto lg:hidden">
        <X className="size-5" />
      </IconButton>
    </div>
  )
}
