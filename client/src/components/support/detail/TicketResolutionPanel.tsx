import { CheckCircle2, CircleSlash, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { Button, Input, Select, Textarea } from '@/components/ui'
import type { ResolutionType, ResolveTicketPayload, Ticket } from '@/types/support'
import { formatDateTime } from '../support-formatters'
import { ACTIVE_STATUSES, RESOLUTION_LABELS, RESOLUTION_OPTIONS } from '../support-options'

interface TicketResolutionPanelProps {
  ticket: Ticket
  nameById: Map<string, string>
  canEdit: boolean
  busy: string | null
  onResolve: (payload: ResolveTicketPayload) => Promise<boolean>
  onReopen: (reason?: string) => Promise<boolean>
}

/** Inline resolve form for active tickets; resolution summary + reopen for finished ones (SUP-012). */
export function TicketResolutionPanel({
  ticket,
  nameById,
  canEdit,
  busy,
  onResolve,
  onReopen,
}: TicketResolutionPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [type, setType] = useState<ResolutionType>('fixed')
  const [summary, setSummary] = useState('')
  const [reason, setReason] = useState('')
  const isActive = ACTIVE_STATUSES.includes(ticket.status)

  if (isActive) {
    if (!canEdit) return null
    if (!isOpen) {
      return (
        <Button variant="success" onClick={() => setIsOpen(true)}>
          <CheckCircle2 className="size-4" aria-hidden />
          Resolve ticket
        </Button>
      )
    }
    const submit = async () => {
      if (summary.trim() && (await onResolve({ type, summary: summary.trim() }))) setIsOpen(false)
    }
    return (
      <div className="space-y-3 rounded-md border border-emerald-200 bg-emerald-50/50 p-4">
        <p className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
          <CheckCircle2 className="size-4" aria-hidden /> Resolve this ticket
        </p>
        <Select label="Resolution" options={RESOLUTION_OPTIONS} value={type} onChange={setType} />
        <Textarea
          label="Summary"
          rows={3}
          maxLength={5000}
          placeholder="What was done, so the next person can find it quickly"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="success"
            onClick={submit}
            loading={busy === 'resolve'}
            disabled={!summary.trim()}
          >
            Mark resolved
          </Button>
        </div>
      </div>
    )
  }

  const resolution = ticket.resolution
  return (
    <div
      className={
        resolution
          ? 'rounded-md border border-emerald-200 bg-emerald-50/50 p-4'
          : 'rounded-md border border-slate-200 bg-slate-50 p-4'
      }
    >
      <p className="flex items-center gap-2 text-sm font-semibold text-slate-900">
        {resolution ? (
          <CheckCircle2 className="size-4 text-emerald-700" aria-hidden />
        ) : (
          <CircleSlash className="size-4 text-slate-500" aria-hidden />
        )}
        {resolution
          ? `Resolved — ${RESOLUTION_LABELS[resolution.type]}`
          : 'Closed without a resolution'}
      </p>
      {resolution && (
        <>
          <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{resolution.summary}</p>
          <p className="mt-2 text-xs text-slate-500">
            by {nameById.get(resolution.resolvedBy) ?? 'a former member'} ·{' '}
            {formatDateTime(ticket.resolvedAt)}
          </p>
        </>
      )}
      {canEdit && (
        <div className="mt-3 flex flex-col gap-2 border-t border-slate-200 pt-3 sm:flex-row">
          <div className="flex-1">
            <Input
              aria-label="Reason for reopening"
              placeholder="Reason for reopening (optional)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            loading={busy === 'reopen'}
            onClick={() =>
              void onReopen(reason.trim() || undefined).then((ok) => ok && setReason(''))
            }
          >
            <RotateCcw className="size-4" aria-hidden />
            Reopen ticket
          </Button>
        </div>
      )}
    </div>
  )
}
