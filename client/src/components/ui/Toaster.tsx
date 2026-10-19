import { useEffect, useState } from 'react'
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react'
import { dismissToast, subscribeToasts, type ToastItem, type ToastType } from './toast-service'
import { cn } from '@/lib/cn'

const typeStyles: Record<ToastType, { icon: typeof Info; container: string; iconColor: string }> = {
  success: {
    icon: CheckCircle2,
    container: 'border-emerald-200 bg-emerald-50/95 text-emerald-950 ring-1 ring-emerald-500/10',
    iconColor: 'text-emerald-600',
  },
  error: {
    icon: AlertCircle,
    container: 'border-rose-200 bg-rose-50/95 text-rose-950 ring-1 ring-rose-500/10',
    iconColor: 'text-rose-600',
  },
  warning: {
    icon: AlertTriangle,
    container: 'border-amber-200 bg-amber-50/95 text-amber-950 ring-1 ring-amber-500/10',
    iconColor: 'text-amber-600',
  },
  info: {
    icon: Info,
    container: 'border-sky-200 bg-sky-50/95 text-sky-950 ring-1 ring-sky-500/10',
    iconColor: 'text-sky-600',
  },
}

export function Toaster() {
  const [items, setItems] = useState<ToastItem[]>([])

  useEffect(() => {
    return subscribeToasts((updated) => setItems(updated))
  }, [])

  if (items.length === 0) return null

  return (
    <div
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
    >
      {items.map((item) => {
        const style = typeStyles[item.type]
        const Icon = style.icon

        return (
          <div
            key={item.id}
            role="status"
            className={cn(
              'pointer-events-auto flex items-start gap-3 p-3.5 rounded-md border text-xs sm:text-sm font-medium',
              'transition-all duration-200 animate-in slide-in-from-bottom-2 fade-in',
              style.container,
            )}
          >
            <Icon className={cn('size-4 shrink-0 mt-0.5', style.iconColor)} />
            <div className="flex-1 leading-snug break-words">{item.message}</div>
            <button
              type="button"
              onClick={() => dismissToast(item.id)}
              className="text-slate-400 hover:text-slate-600 cursor-pointer p-0.5 rounded-md transition-colors -mr-1 -mt-0.5"
              aria-label="Dismiss notification"
            >
              <X className="size-3.5" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
