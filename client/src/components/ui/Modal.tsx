import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { IconButton } from './IconButton'
import { cn } from '@/lib/cn'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  className?: string
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  '2xl': 'max-w-5xl',
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  className,
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-[2px] animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        className={cn(
          'w-full max-h-[90vh] rounded-md border border-slate-200 bg-white text-slate-900 flex flex-col',
          sizeClasses[size],
          className,
        )}
      >
        {(title || description) && (
          <div className="flex items-start justify-between p-5 border-b border-slate-100">
            <div>
              {title && (
                <h2 id="modal-title" className="text-base font-semibold text-slate-900">
                  {title}
                </h2>
              )}
              {description && (
                <p className="mt-1 text-xs text-slate-500 leading-normal">{description}</p>
              )}
            </div>
            <IconButton
              aria-label="Close dialog"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 -mr-1"
            >
              <X className="size-4" />
            </IconButton>
          </div>
        )}

        <div className="p-5 overflow-y-auto">{children}</div>

        {footer && (
          <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-slate-100 bg-slate-50/50 rounded-b-md">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
