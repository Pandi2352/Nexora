import type { ComponentType, MouseEvent } from 'react'
import { ChevronDown, X } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/cn'
import type { SelectOption, SelectSize } from './select.types'

interface SelectTriggerProps<T = string> {
  id?: string
  isOpen: boolean
  disabled?: boolean
  error?: boolean
  size?: SelectSize
  placeholder?: string
  multiple?: boolean
  selectedOptions: SelectOption<T>[]
  icon?: ComponentType<{ className?: string }>
  clearable?: boolean
  className?: string
  onToggle: () => void
  onRemoveItem?: (val: T, e: MouseEvent) => void
  onClear?: (e: MouseEvent) => void
}

const sizeClasses: Record<SelectSize, string> = {
  sm: 'min-h-9 px-3 text-xs',
  md: 'min-h-10 px-3 text-sm',
  lg: 'min-h-11 px-3 text-sm',
}

export function SelectTrigger<T = string>({
  id,
  isOpen,
  disabled,
  error,
  size = 'md',
  placeholder = 'Select an option...',
  multiple = false,
  selectedOptions,
  icon: Icon,
  clearable = false,
  className,
  onToggle,
  onRemoveItem,
  onClear,
}: SelectTriggerProps<T>) {
  const hasSelection = selectedOptions.length > 0

  return (
    <div
      id={id}
      role="combobox"
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onClick={() => !disabled && onToggle()}
      onKeyDown={(e) => {
        if (disabled) return
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
          e.preventDefault()
          onToggle()
        }
      }}
      className={cn(
        'group flex w-full items-center justify-between rounded-md border bg-white text-slate-900 transition-colors',
        'cursor-pointer select-none outline-none focus:outline-none focus-visible:outline-none',
        isOpen ? 'border-brand-500' : 'border-slate-300 hover:border-slate-400',
        error && 'border-rose-400 focus:border-rose-500',
        disabled && 'cursor-not-allowed bg-slate-50 text-slate-400 hover:border-slate-300',
        sizeClasses[size],
        className,
      )}
    >
      <div className="flex flex-1 flex-wrap items-center gap-1.5 min-w-0 pr-2">
        {Icon && <Icon className="size-4 text-slate-400 shrink-0 mr-1" />}

        {!hasSelection ? (
          <span className="text-slate-400 truncate">{placeholder}</span>
        ) : multiple ? (
          selectedOptions.map((opt) => (
            <Badge
              key={String(opt.value)}
              variant="neutral"
              size="sm"
              className="gap-1 pr-1 font-normal"
            >
              <span className="truncate max-w-[120px]">{opt.label}</span>
              {!disabled && onRemoveItem && (
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={(e) => onRemoveItem(opt.value, e)}
                  className="rounded hover:bg-slate-200 text-slate-400 hover:text-slate-700 cursor-pointer p-0.5"
                  aria-label={`Remove ${opt.label}`}
                >
                  <X className="size-3" />
                </button>
              )}
            </Badge>
          ))
        ) : selectedOptions[0] ? (
          (() => {
            const first = selectedOptions[0]
            const SelectedIcon = first.icon
            return (
              <div className="flex items-center gap-2 truncate">
                {SelectedIcon && <SelectedIcon className="size-4 text-slate-500 shrink-0" />}
                <span className="truncate">{first.label}</span>
              </div>
            )
          })()
        ) : null}
      </div>

      <div className="flex items-center gap-1 shrink-0 text-slate-400">
        {clearable && hasSelection && !disabled && onClear && (
          <button
            type="button"
            tabIndex={-1}
            onClick={onClear}
            className="p-1 rounded hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
            aria-label="Clear selection"
          >
            <X className="size-3.5" />
          </button>
        )}
        <ChevronDown
          className={cn('size-4 transition-transform duration-150', isOpen && 'rotate-180 text-brand-600')}
          aria-hidden="true"
        />
      </div>
    </div>
  )
}
