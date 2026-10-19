import type { ReactNode } from 'react'

export function DropdownLabel({ children }: { children: ReactNode }) {
  return (
    <p className="px-3 pb-1 pt-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
      {children}
    </p>
  )
}

export function DropdownSeparator() {
  return <div role="separator" className="my-1 border-t border-slate-100" />
}
