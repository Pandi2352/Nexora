import { AlarmClock, Gauge, UserCheck } from 'lucide-react'
import { FormSection } from '@/components/common/FormSection'
import { Button, Select, TagInput, type SelectOption } from '@/components/ui'
import { formatDuration } from '../support-formatters'
import { PRIORITY_OPTIONS, SLA_TARGETS } from '../support-options'
import type { TicketFormValues } from './ticket-form'

interface TicketTriageSectionProps {
  values: TicketFormValues
  onChange: (patch: Partial<TicketFormValues>) => void
  memberOptions: SelectOption[]
  currentUserId?: string
  /** Assignment is set here only when creating; afterwards it changes from the ticket page. */
  isEditing: boolean
}

export function TicketTriageSection({
  values,
  onChange,
  memberOptions,
  currentUserId,
  isEditing,
}: TicketTriageSectionProps) {
  const sla = SLA_TARGETS[values.priority]

  return (
    <FormSection
      icon={Gauge}
      iconClassName="text-amber-600"
      title="Triage & routing"
      description="Priority drives the SLA targets."
      className="self-start xl:sticky xl:top-0"
    >
      <Select
        label="Priority"
        options={PRIORITY_OPTIONS}
        value={values.priority}
        onChange={(priority) => onChange({ priority })}
      />
      <div className="flex items-start gap-2 rounded-md border border-sky-200 bg-sky-50 px-3 py-2.5 text-xs text-sky-800">
        <AlarmClock className="mt-0.5 size-4 shrink-0" aria-hidden />
        <p>
          First response within <strong>{formatDuration(sla.firstResponse)}</strong>, resolution
          within <strong>{formatDuration(sla.resolution)}</strong>
          {isEditing && ', measured from when the ticket was opened'}.
        </p>
      </div>

      {isEditing ? (
        <p className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
          Change the assignee from the ticket page, so the handover is recorded in its history.
        </p>
      ) : (
        <div>
          <Select
            label="Assignee"
            placeholder="Leave unassigned"
            options={memberOptions}
            value={values.assigneeId}
            searchable
            clearable
            onChange={(assigneeId) => onChange({ assigneeId: assigneeId || undefined })}
          />
          {currentUserId && values.assigneeId !== currentUserId && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-1.5"
              onClick={() => onChange({ assigneeId: currentUserId })}
            >
              <UserCheck className="size-4" aria-hidden />
              Assign to me
            </Button>
          )}
        </div>
      )}

      <TagInput
        label="Tags"
        value={values.tags}
        onChange={(tags) => onChange({ tags })}
        hint="Up to 10 tags, e.g. invoices, export, vip"
      />
    </FormSection>
  )
}
