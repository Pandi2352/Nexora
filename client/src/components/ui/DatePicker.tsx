import { useEffect, useId, useMemo, useRef, useState } from 'react'
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react'
import { useAutoPlacement } from '@/hooks/useAutoPlacement'
import { Tooltip } from './Tooltip'

export interface DatePickerProps {
  value?: string // YYYY-MM-DD format
  onChange?: (date: string) => void
  label?: string
  placeholder?: string
  hint?: string
  error?: string
  required?: boolean
  disabled?: boolean
  minDate?: string
  maxDate?: string
  className?: string
  showPresets?: boolean
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

function parseISODate(iso?: string): Date | null {
  if (!iso) return null
  const parts = iso.split('-')
  if (parts.length !== 3 || !parts[0] || !parts[1] || !parts[2]) return null
  const y = parseInt(parts[0], 10)
  const m = parseInt(parts[1], 10) - 1
  const d = parseInt(parts[2], 10)
  if (isNaN(y) || isNaN(m) || isNaN(d)) return null
  return new Date(y, m, d)
}

function formatISODate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function formatDisplayDate(iso?: string): string {
  const d = parseISODate(iso)
  if (!d) return ''
  return d.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function DatePicker({
  value,
  onChange,
  label,
  placeholder = 'Select date...',
  hint,
  error,
  required = false,
  disabled = false,
  minDate,
  maxDate,
  className = '',
  showPresets = true,
}: DatePickerProps) {
  const id = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const { placement, updatePosition } = useAutoPlacement(containerRef, isOpen, {
    minSpace: 360,
  })
  const [alignRight, setAlignRight] = useState(false)

  const selectedDate = useMemo(() => parseISODate(value), [value])

  // Calendar view month & year
  const [viewDate, setViewDate] = useState<Date>(() => selectedDate || new Date())

  // Keep viewDate in sync when value changes externally
  useEffect(() => {
    if (selectedDate) {
      setViewDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1))
    }
  }, [selectedDate])

  // Auto-detect horizontal viewport boundary on open
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      const popoverWidth = 290
      const spaceRight = window.innerWidth - rect.left
      setAlignRight(spaceRight < popoverWidth)
    }
  }, [isOpen])

  // Click outside listener
  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const viewYear = viewDate.getFullYear()
  const viewMonth = viewDate.getMonth()

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation()
    setViewDate(new Date(viewYear, viewMonth - 1, 1))
  }

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation()
    setViewDate(new Date(viewYear, viewMonth + 1, 1))
  }

  const handleSelectDay = (day: Date) => {
    onChange?.(formatISODate(day))
    setIsOpen(false)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange?.('')
  }

  const handlePreset = (offsetDays: number) => {
    const d = new Date()
    d.setDate(d.getDate() + offsetDays)
    onChange?.(formatISODate(d))
    setViewDate(new Date(d.getFullYear(), d.getMonth(), 1))
    setIsOpen(false)
  }

  // Calendar matrix calculation
  const calendarDays = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1).getDay()
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate()

    const days: Array<{ date: Date; isCurrentMonth: boolean }> = []

    // Previous month padding
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(viewYear, viewMonth - 1, daysInPrevMonth - i),
        isCurrentMonth: false,
      })
    }

    // Current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(viewYear, viewMonth, i),
        isCurrentMonth: true,
      })
    }

    // Next month padding to fill 6 weeks grid (42 days)
    const remaining = 42 - days.length
    for (let i = 1; i <= remaining; i++) {
      days.push({
        date: new Date(viewYear, viewMonth + 1, i),
        isCurrentMonth: false,
      })
    }

    return days
  }, [viewYear, viewMonth])

  const todayStr = formatISODate(new Date())

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-semibold text-slate-700 mb-1"
        >
          {label}
          {required && <span className="text-rose-500 ml-0.5">*</span>}
        </label>
      )}

      {/* Trigger Input Field */}
      <div
        id={id}
        tabIndex={disabled ? -1 : 0}
        role="button"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => {
          if (!disabled) {
            if (!isOpen) updatePosition()
            setIsOpen(!isOpen)
          }
        }}
        onKeyDown={(e) => {
          if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault()
            if (!isOpen) updatePosition()
            setIsOpen(!isOpen)
          }
        }}
        className={`flex h-10 w-full items-center justify-between rounded-md border bg-white px-3 text-xs transition-colors cursor-pointer select-none focus:outline-none focus:ring-1 focus:ring-brand-500 ${
          error
            ? 'border-rose-300 ring-1 ring-rose-500'
            : isOpen
              ? 'border-brand-500 ring-1 ring-brand-500'
              : 'border-slate-300 hover:border-slate-400'
        } ${disabled ? 'bg-slate-50 opacity-60 cursor-not-allowed' : ''}`}
      >
        <div className="flex items-center gap-2 truncate">
          <CalendarIcon
            className={`size-4 shrink-0 ${
              value ? 'text-brand-600' : 'text-slate-400'
            }`}
          />
          <span className={value ? 'text-slate-900 font-medium' : 'text-slate-400'}>
            {value ? formatDisplayDate(value) : placeholder}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {value && !disabled && (
            <Tooltip content="Clear date">
              <button
                type="button"
                onClick={handleClear}
                className="flex size-5 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
                aria-label="Clear date"
              >
                <X className="size-3.5" />
              </button>
            </Tooltip>
          )}
        </div>
      </div>

      {hint && !error && <p className="mt-1 text-[11px] text-slate-400">{hint}</p>}
      {error && <p className="mt-1 text-[11px] font-medium text-rose-600">{error}</p>}

      {/* Popover Calendar Window */}
      {isOpen && (
        <div
          className={`absolute z-50 w-72 rounded-md border border-slate-200 bg-white p-3 focus:outline-none ${
            placement === 'top' ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
          } ${alignRight ? 'right-0' : 'left-0'}`}
        >
          {/* Quick Presets Strip */}
          {showPresets && (
            <div className="flex items-center gap-1 border-b border-slate-100 pb-2.5 mb-2.5 overflow-x-auto">
              <button
                type="button"
                onClick={() => handlePreset(0)}
                className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200 cursor-pointer transition-colors"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => handlePreset(1)}
                className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200 cursor-pointer transition-colors"
              >
                Tomorrow
              </button>
              <button
                type="button"
                onClick={() => handlePreset(7)}
                className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200 cursor-pointer transition-colors"
              >
                +1 Wk
              </button>
              <button
                type="button"
                onClick={() => handlePreset(30)}
                className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200 cursor-pointer transition-colors"
              >
                +1 Mo
              </button>
            </div>
          )}

          {/* Month/Year Navigation Header */}
          <div className="flex items-center justify-between pb-2">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="flex size-7 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 cursor-pointer transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="size-4" />
            </button>

            <span className="text-xs font-bold text-slate-900">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>

            <button
              type="button"
              onClick={handleNextMonth}
              className="flex size-7 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 cursor-pointer transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>

          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 text-center text-[10px] font-semibold text-slate-400 py-1">
            {DAY_LABELS.map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 pt-1">
            {calendarDays.map(({ date, isCurrentMonth }, idx) => {
              const dateStr = formatISODate(date)
              const isSelected = value === dateStr
              const isToday = dateStr === todayStr
              const isDisabled = Boolean(
                (minDate && dateStr < minDate) || (maxDate && dateStr > maxDate),
              )

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => handleSelectDay(date)}
                  className={`flex size-8 items-center justify-center rounded-md text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-brand-600 text-white font-bold'
                      : isToday
                        ? 'border border-brand-500 font-bold text-brand-700 hover:bg-brand-50'
                        : isCurrentMonth
                          ? 'text-slate-800 hover:bg-slate-100'
                          : 'text-slate-300 hover:bg-slate-50'
                  } ${isDisabled ? 'opacity-30 cursor-not-allowed hover:bg-transparent' : ''}`}
                >
                  {date.getDate()}
                </button>
              )
            })}
          </div>

          {/* Footer Reset & Close */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-2 mt-2 text-[11px]">
            <button
              type="button"
              onClick={() => handlePreset(0)}
              className="text-brand-600 hover:underline font-medium cursor-pointer"
            >
              Set Today
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
