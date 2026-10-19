import { useState, useRef, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface TooltipProps {
  content: ReactNode
  children: ReactNode
  placement?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
  delay?: number
}

export function Tooltip({
  content,
  children,
  placement = 'top',
  className,
  delay = 150,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const show = () => {
    timerRef.current = setTimeout(() => {
      setIsVisible(true)
    }, delay)
  }

  const hide = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    setIsVisible(false)
  }

  const placementClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-1.5',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-1.5',
    left: 'right-full top-1/2 -translate-y-1/2 mr-1.5',
    right: 'left-full top-1/2 -translate-y-1/2 ml-1.5',
  }

  if (!content) return <>{children}</>

  return (
    <div
      className="relative inline-flex items-center"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {isVisible && (
        <div
          role="tooltip"
          className={cn(
            'absolute z-50 pointer-events-none px-2 py-1 text-[11px] font-medium',
            'bg-slate-900 text-white rounded-md whitespace-nowrap',
            'border border-slate-700 select-none animate-in fade-in duration-100',
            placementClasses[placement],
            className,
          )}
        >
          {content}
        </div>
      )}
    </div>
  )
}
