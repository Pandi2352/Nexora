import { Lock } from 'lucide-react'
import { Avatar } from '@/components/ui'
import { cn } from '@/lib/cn'
import { formatDateTime, formatRelative } from '../support-formatters'

interface TicketMessageProps {
  author: string
  body: string
  createdAt: string
  /** `requester` = original request, `reply` = public answer, `note` = staff-only. */
  kind: 'requester' | 'reply' | 'note'
}

const STYLES = {
  requester: { box: 'border-slate-200 bg-white', label: 'Requester' },
  reply: { box: 'border-brand-200 bg-brand-50/40', label: 'Reply' },
  note: { box: 'border-amber-200 bg-amber-50', label: 'Internal note' },
}

/** One entry in the ticket conversation. Text is rendered as plain text (no HTML). */
export function TicketMessage({ author, body, createdAt, kind }: TicketMessageProps) {
  const style = STYLES[kind]
  return (
    <article className="flex gap-3">
      <Avatar name={author} size="sm" className="mt-1" />
      <div className={cn('min-w-0 flex-1 rounded-md border p-4', style.box)}>
        <header className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
          <span className="font-semibold text-slate-900">{author}</span>
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-medium',
              kind === 'note' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600',
            )}
          >
            {kind === 'note' && <Lock className="size-3" aria-hidden />}
            {style.label}
          </span>
          <time dateTime={createdAt} title={formatDateTime(createdAt)} className="text-slate-500">
            {formatRelative(createdAt)}
          </time>
        </header>
        <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-800">
          {body}
        </p>
      </div>
    </article>
  )
}
