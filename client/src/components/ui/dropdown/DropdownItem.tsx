import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useDropdown } from './dropdown-context'

interface DropdownItemProps {
  label: string
  description?: string
  icon?: LucideIcon
  /** Renders a link when set, otherwise a button. */
  to?: string
  onSelect?: () => void
  onClick?: () => void
  disabled?: boolean
  /** Small note at the end of the row (e.g. "Needs auth API"). */
  hint?: string
  /** Element at the end of the row (e.g. a check mark). */
  trailing?: ReactNode
}

const itemClass =
  'flex w-full items-start gap-3 px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50 focus-visible:bg-slate-50 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent'

export function DropdownItem({
  label,
  description,
  icon: Icon,
  to,
  onSelect,
  onClick,
  disabled,
  hint,
  trailing,
}: DropdownItemProps) {
  const { close } = useDropdown()

  const handleClick = () => {
    ;(onSelect ?? onClick)?.()
    close()
  }

  const content = (
    <>
      {Icon && <Icon className="mt-0.5 size-4 shrink-0 text-slate-400" aria-hidden />}
      <span className="min-w-0 flex-1">
        <span className="block font-medium text-slate-800">{label}</span>
        {description && <span className="block text-xs text-slate-500">{description}</span>}
      </span>
      {hint && <span className="text-[11px] text-slate-400">{hint}</span>}
      {trailing}
    </>
  )

  if (to && !disabled) {
    return (
      <Link to={to} role="menuitem" onClick={handleClick} className={itemClass}>
        {content}
      </Link>
    )
  }

  return (
    <button
      type="button"
      role="menuitem"
      onClick={handleClick}
      disabled={disabled}
      className={itemClass}
    >
      {content}
    </button>
  )
}
