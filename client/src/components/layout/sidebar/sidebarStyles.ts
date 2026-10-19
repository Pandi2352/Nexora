import { cn } from '@/lib/cn'

export const SIDEBAR_ID = 'app-sidebar'

export function navRowClass(active: boolean, collapsed: boolean): string {
  return cn(
    'group flex w-full items-center gap-3 rounded-md text-sm font-medium transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
    collapsed ? 'h-10 justify-center px-0' : 'px-3 py-2',
    active
      ? 'bg-brand-50 text-brand-700'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
  )
}

export function childRowClass(active: boolean): string {
  return cn(
    'flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
    active
      ? 'font-medium text-brand-700'
      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900',
  )
}
