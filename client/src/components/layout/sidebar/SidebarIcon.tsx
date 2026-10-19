import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

interface SidebarIconProps {
  icon: LucideIcon
  active: boolean
}

export function SidebarIcon({ icon: Icon, active }: SidebarIconProps) {
  return (
    <Icon
      aria-hidden
      className={cn(
        'size-5 shrink-0',
        active ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-600',
      )}
    />
  )
}
