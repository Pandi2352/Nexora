import { Lock, MessageSquareReply, Send } from 'lucide-react'
import { useState, type KeyboardEvent } from 'react'
import { Button, Kbd, Select, Textarea, type SelectOption } from '@/components/ui'
import { cn } from '@/lib/cn'
import type { CreateReplyPayload, ReplyType, TicketStatus } from '@/types/support'
import { STATUS_TRANSITIONS, statusLabel } from '../support-options'

interface TicketReplyComposerProps {
  status: TicketStatus
  isSending: boolean
  onSend: (payload: CreateReplyPayload) => Promise<boolean>
}

const MODES: Array<{ id: ReplyType; label: string; icon: typeof Send }> = [
  { id: 'reply', label: 'Reply to requester', icon: MessageSquareReply },
  { id: 'internal_note', label: 'Internal note', icon: Lock },
]

/** Write a public reply or a staff-only note; optionally move the ticket to a new status. */
export function TicketReplyComposer({ status, isSending, onSend }: TicketReplyComposerProps) {
  const [mode, setMode] = useState<ReplyType>('reply')
  const [body, setBody] = useState('')
  const [nextStatus, setNextStatus] = useState<string>('')
  const isNote = mode === 'internal_note'

  const statusOptions: SelectOption[] = [
    { value: '', label: `Keep as ${statusLabel(status).toLowerCase()}` },
    ...STATUS_TRANSITIONS[status]
      .filter((s) => s !== 'closed')
      .map((s) => ({ value: s, label: `Set to ${statusLabel(s).toLowerCase()}` })),
  ]

  const submit = async () => {
    if (!body.trim() || isSending) return
    const ok = await onSend({
      type: mode,
      body: body.trim(),
      setStatus: (nextStatus || undefined) as TicketStatus | undefined,
    })
    if (ok) {
      setBody('')
      setNextStatus('')
    }
  }

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      void submit()
    }
  }

  return (
    <div
      className={cn('rounded-md border bg-white', isNote ? 'border-amber-300' : 'border-slate-200')}
    >
      <div role="tablist" aria-label="Message type" className="flex border-b border-slate-200">
        {MODES.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={mode === id}
            onClick={() => setMode(id)}
            className={cn(
              'flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500',
              mode === id
                ? id === 'internal_note'
                  ? 'border-amber-500 text-amber-800'
                  : 'border-brand-600 text-brand-700'
                : 'border-transparent text-slate-500 hover:text-slate-800',
            )}
          >
            <Icon className="size-3.5" aria-hidden />
            {label}
          </button>
        ))}
      </div>
      <div className={cn('space-y-3 p-3', isNote && 'bg-amber-50/60')}>
        <Textarea
          aria-label={isNote ? 'Internal note' : 'Reply'}
          rows={4}
          maxLength={10000}
          placeholder={isNote ? 'Visible to your team only…' : 'Write your reply to the requester…'}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-[11px] text-slate-500">
            <Kbd>Ctrl</Kbd> + <Kbd>Enter</Kbd> to send
          </span>
          <div className="flex items-center gap-2">
            <div className="w-56">
              <Select
                options={statusOptions}
                value={nextStatus}
                onChange={setNextStatus}
                size="sm"
              />
            </div>
            <Button
              variant={isNote ? 'secondary' : 'primary'}
              onClick={submit}
              loading={isSending}
              disabled={!body.trim()}
            >
              {!isSending && <Send className="size-4" aria-hidden />}
              {isNote ? 'Add note' : 'Send reply'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
