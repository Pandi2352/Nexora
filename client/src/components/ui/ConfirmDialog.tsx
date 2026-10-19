import { useEffect, type ReactNode } from 'react'
import { Check, Loader2, Trash2, X } from 'lucide-react'
import { IconButton } from './IconButton'
import { cn } from '@/lib/cn'

export interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void | Promise<void>
  title: string
  description?: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'warning' | 'primary' | 'success'
  confirmColor?: 'green' | 'red' | 'brand'
  cancelColor?: 'red' | 'slate' | 'outline'
  isLoading?: boolean
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'warning',
  confirmColor,
  cancelColor = 'red',
  isLoading = false,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, isLoading, onClose])

  if (!isOpen) return null

  // Resolve button colors
  const activeConfirmColor = confirmColor || (variant === 'danger' ? 'green' : 'green')

  const confirmColorClasses =
    activeConfirmColor === 'red'
      ? 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white'
      : activeConfirmColor === 'brand'
        ? 'bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white'
        : 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white'

  const cancelColorClasses =
    cancelColor === 'slate'
      ? 'bg-slate-200 hover:bg-slate-300 active:bg-slate-400 text-slate-800'
      : cancelColor === 'outline'
        ? 'border border-slate-300 bg-white hover:bg-slate-100 text-slate-700'
        : 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/45 backdrop-blur-[2px] animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) {
          onClose()
        }
      }}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby={description ? 'confirm-dialog-desc' : undefined}
    >
      <div
        className={cn(
          'relative w-full max-w-md rounded-md border border-slate-200 bg-white p-7 text-slate-900',
          'flex flex-col items-center text-center animate-in zoom-in-95 duration-150',
        )}
      >
        {/* Top-right close button */}
        <IconButton
          aria-label="Close dialog"
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-3.5 right-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          <X className="size-4" />
        </IconButton>

        {/* Circular Warning Badge matching user design */}
        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-amber-400 text-white select-none shrink-0">
          <span className="text-3xl font-black font-sans leading-none">!</span>
        </div>

        {/* Centered Title */}
        <h2
          id="confirm-dialog-title"
          className="text-xl font-bold tracking-tight text-slate-900 mb-2"
        >
          {title}
        </h2>

        {/* Centered Description */}
        {description && (
          <div
            id="confirm-dialog-desc"
            className="text-sm text-slate-600 leading-relaxed mb-6 max-w-sm"
          >
            {description}
          </div>
        )}

        {/* Colored Action Buttons with related SVG icons */}
        <div className="flex items-center justify-center gap-3.5 w-full mt-1">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className={cn(
              'flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
              cancelColorClasses,
            )}
          >
            <X className="size-4" />
            <span>{cancelLabel}</span>
          </button>

          <button
            type="button"
            onClick={() => void onConfirm()}
            disabled={isLoading}
            className={cn(
              'flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
              confirmColorClasses,
            )}
          >
            {isLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : variant === 'danger' ? (
              <Trash2 className="size-4" />
            ) : (
              <Check className="size-4" />
            )}
            <span>{confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
