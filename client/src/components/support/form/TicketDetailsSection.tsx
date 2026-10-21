import { FileText } from 'lucide-react'
import { FormSection } from '@/components/common/FormSection'
import { Input, Select, Textarea } from '@/components/ui'
import { CATEGORY_OPTIONS, CHANNEL_OPTIONS } from '../support-options'
import type { TicketFormErrors, TicketFormValues } from './ticket-form'

interface SectionProps {
  values: TicketFormValues
  errors: TicketFormErrors
  onChange: (patch: Partial<TicketFormValues>) => void
}

export function TicketDetailsSection({ values, errors, onChange }: SectionProps) {
  return (
    <FormSection
      icon={FileText}
      title="Request details"
      description="What the customer needs, in their words."
    >
      <Input
        label="Subject"
        required
        autoFocus
        maxLength={200}
        showCount
        placeholder="e.g. Unable to export invoices to PDF"
        value={values.subject}
        error={errors.subject}
        onChange={(e) => onChange({ subject: e.target.value })}
      />
      <Textarea
        label="Description"
        required
        rows={8}
        maxLength={10000}
        showCount
        placeholder="Steps to reproduce, what was expected, what happened, error messages, links…"
        value={values.description}
        error={errors.description}
        onChange={(e) => onChange({ description: e.target.value })}
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Select
          label="Category"
          options={CATEGORY_OPTIONS}
          value={values.category}
          onChange={(category) => onChange({ category })}
        />
        <Select
          label="Channel"
          hint="Where the request came in"
          options={CHANNEL_OPTIONS}
          value={values.channel}
          onChange={(channel) => onChange({ channel })}
        />
      </div>
    </FormSection>
  )
}
