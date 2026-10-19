import { useEffect, useRef, useState } from 'react'
import { Check, Search } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/cn'
import type { SelectOption } from './select.types'

interface SelectMenuProps<T = string> {
  options: SelectOption<T>[]
  selectedValues: T[]
  multiple?: boolean
  searchable?: boolean
  className?: string
  placement?: 'top' | 'bottom'
  maxListHeight?: number
  onSelect: (opt: SelectOption<T>) => void
}

export function SelectMenu<T = string>({
  options,
  selectedValues,
  multiple = false,
  searchable = true,
  className,
  placement = 'bottom',
  maxListHeight,
  onSelect,
}: SelectMenuProps<T>) {
  const [search, setSearch] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (searchable) {
      searchInputRef.current?.focus()
    }
  }, [searchable])

  const filtered = options.filter(
    (opt) =>
      opt.label.toLowerCase().includes(search.toLowerCase()) ||
      (opt.description && opt.description.toLowerCase().includes(search.toLowerCase())),
  )

  return (
    <div
      role="listbox"
      aria-multiselectable={multiple}
      className={cn(
        'absolute z-50 w-full rounded-md border border-slate-200 bg-white py-1.5 animate-in fade-in duration-100',
        placement === 'top' ? 'bottom-full mb-1' : 'top-full mt-1',
        className,
      )}
    >
      {searchable && (
        <div className="px-2 pb-1.5 border-b border-slate-100">
          <div className="relative flex items-center">
            <Search className="size-3.5 absolute left-2.5 text-slate-400 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-md border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 outline-none focus:outline-none focus:border-brand-500 focus:bg-white transition-colors"
            />
          </div>
        </div>
      )}

      <div
        style={maxListHeight ? { maxHeight: `${maxListHeight}px` } : undefined}
        className="max-h-60 overflow-y-auto custom-scrollbar pt-1"
      >
        {filtered.length === 0 ? (
          <div className="px-3 py-6 text-center text-xs text-slate-500">
            No matching options
          </div>
        ) : (
          filtered.map((opt) => {
            const isSelected = selectedValues.includes(opt.value)
            const Icon = opt.icon

            return (
              <div
                key={String(opt.value)}
                role="option"
                aria-selected={isSelected}
                aria-disabled={opt.disabled}
                onClick={() => !opt.disabled && onSelect(opt)}
                className={cn(
                  'flex items-center justify-between px-3 py-2 text-xs sm:text-sm cursor-pointer select-none transition-colors',
                  isSelected ? 'bg-brand-50 text-brand-700 font-medium' : 'text-slate-800 hover:bg-slate-50',
                  opt.disabled && 'cursor-not-allowed opacity-50 hover:bg-transparent',
                )}
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  {Icon && (
                    <Icon className={cn('size-4 shrink-0', isSelected ? 'text-brand-600' : 'text-slate-400')} />
                  )}
                  <div className="min-w-0">
                    <p className="truncate leading-tight">{opt.label}</p>
                    {opt.description && (
                      <p className="text-[11px] font-normal text-slate-500 truncate mt-0.5">
                        {opt.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {opt.badge && (
                    <Badge variant="neutral" size="sm">
                      {opt.badge}
                    </Badge>
                  )}
                  {isSelected && <Check className="size-4 text-brand-600 shrink-0" />}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
