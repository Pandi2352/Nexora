import { useCallback, useId, useMemo, useRef, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { useDismiss } from '@/hooks/useDismiss'
import { cn } from '@/lib/cn'
import { DropdownContext } from './dropdown-context'

interface DropdownProps {
  /** Accessible name of the trigger button. */
  label: string
  trigger: ReactNode
  children: ReactNode
  align?: 'start' | 'end'
  /** Open below (default) or above the trigger. */
  side?: 'bottom' | 'top'
  className?: string
  triggerClassName?: string
  /** Panel width/padding, e.g. `w-72 py-1.5`. */
  menuClassName?: string
}

/** Popover menu: closes on outside click, Escape, item select and route change. */
export function Dropdown({
  label,
  trigger,
  children,
  align = 'end',
  side = 'bottom',
  className,
  triggerClassName,
  menuClassName,
}: DropdownProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const menuId = useId()
  const { pathname } = useLocation()

  const close = useCallback(() => setOpen(false), [])
  const context = useMemo(() => ({ close }), [close])
  useDismiss(rootRef, close, open)

  const [lastPathname, setLastPathname] = useState(pathname)
  if (pathname !== lastPathname) {
    setLastPathname(pathname)
    setOpen(false)
  }

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <button
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          'inline-flex items-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
          triggerClassName,
        )}
      >
        {trigger}
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label={label}
          className={cn(
            'absolute z-40 max-w-[calc(100vw-2rem)] overflow-hidden rounded-md border border-slate-200 bg-white',
            side === 'bottom' ? 'top-full mt-2' : 'bottom-full mb-2',
            align === 'end' ? 'right-0' : 'left-0',
            menuClassName,
          )}
        >
          <DropdownContext value={context}>{children}</DropdownContext>
        </div>
      )}
    </div>
  )
}
