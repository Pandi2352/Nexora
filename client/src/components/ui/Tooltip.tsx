import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
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
  const [coords, setCoords] = useState<CSSProperties>({})
  const [arrowAlign, setArrowAlign] = useState<'center' | 'left' | 'right'>('center')
  const triggerRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth

    const isNearRight = viewportWidth - rect.right < 80
    const isNearLeft = rect.left < 80
    const centerX = rect.left + rect.width / 2

    let align: 'center' | 'left' | 'right' = 'center'
    let style: CSSProperties = {
      position: 'fixed',
      zIndex: 9999,
      pointerEvents: 'none',
    }

    if (placement === 'top') {
      if (isNearRight) {
        align = 'right'
        style = {
          ...style,
          top: `${rect.top - 8}px`,
          left: `${rect.right}px`,
          transform: 'translate(-100%, -100%)',
        }
      } else if (isNearLeft) {
        align = 'left'
        style = {
          ...style,
          top: `${rect.top - 8}px`,
          left: `${rect.left}px`,
          transform: 'translate(0, -100%)',
        }
      } else {
        align = 'center'
        style = {
          ...style,
          top: `${rect.top - 8}px`,
          left: `${centerX}px`,
          transform: 'translate(-50%, -100%)',
        }
      }
    } else if (placement === 'bottom') {
      if (isNearRight) {
        align = 'right'
        style = {
          ...style,
          top: `${rect.bottom + 8}px`,
          left: `${rect.right}px`,
          transform: 'translate(-100%, 0)',
        }
      } else if (isNearLeft) {
        align = 'left'
        style = {
          ...style,
          top: `${rect.bottom + 8}px`,
          left: `${rect.left}px`,
          transform: 'translate(0, 0)',
        }
      } else {
        align = 'center'
        style = {
          ...style,
          top: `${rect.bottom + 8}px`,
          left: `${centerX}px`,
          transform: 'translate(-50%, 0)',
        }
      }
    } else if (placement === 'left') {
      style = {
        ...style,
        top: `${rect.top + rect.height / 2}px`,
        left: `${rect.left - 8}px`,
        transform: 'translate(-100%, -50%)',
      }
    } else if (placement === 'right') {
      style = {
        ...style,
        top: `${rect.top + rect.height / 2}px`,
        left: `${rect.right + 8}px`,
        transform: 'translate(0, -50%)',
      }
    }

    setArrowAlign(align)
    setCoords(style)
  }, [placement])

  const show = () => {
    timerRef.current = setTimeout(() => {
      updatePosition()
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

  useEffect(() => {
    if (!isVisible) return

    const handleScrollOrResize = () => {
      updatePosition()
    }

    window.addEventListener('resize', handleScrollOrResize)
    window.addEventListener('scroll', handleScrollOrResize, true)

    return () => {
      window.removeEventListener('resize', handleScrollOrResize)
      window.removeEventListener('scroll', handleScrollOrResize, true)
    }
  }, [isVisible, updatePosition])

  if (!content) return <>{children}</>

  return (
    <>
      <div
        ref={triggerRef}
        className="inline-flex items-center"
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
      >
        {children}
      </div>

      {isVisible &&
        createPortal(
          <div
            role="tooltip"
            style={coords}
            className={cn(
              'relative px-3 py-1.5 text-xs font-medium',
              'bg-slate-900 text-white rounded-md whitespace-nowrap shadow-none',
              'border border-slate-700/80 select-none animate-in fade-in zoom-in-95 duration-100',
              'flex items-center justify-center text-center leading-normal',
              className,
            )}
          >
            <span className="block text-center">{content}</span>
            {/* Modern arrow pointer pointing towards the trigger */}
            <span
              className={cn(
                'absolute size-1.5 rotate-45 bg-slate-900 border-slate-700/80 pointer-events-none',
                placement === 'top' &&
                  (arrowAlign === 'right'
                    ? 'right-3 -bottom-[3.5px] border-r border-b'
                    : arrowAlign === 'left'
                      ? 'left-3 -bottom-[3.5px] border-r border-b'
                      : 'left-1/2 -translate-x-1/2 -bottom-[3.5px] border-r border-b'),
                placement === 'bottom' &&
                  (arrowAlign === 'right'
                    ? 'right-3 -top-[3.5px] border-l border-t'
                    : arrowAlign === 'left'
                      ? 'left-3 -top-[3.5px] border-l border-t'
                      : 'left-1/2 -translate-x-1/2 -top-[3.5px] border-l border-t'),
                placement === 'left' && 'top-1/2 -translate-y-1/2 -right-[3.5px] border-t border-r',
                placement === 'right' && 'top-1/2 -translate-y-1/2 -left-[3.5px] border-b border-l',
              )}
            />
          </div>,
          document.body,
        )}
    </>
  )
}
