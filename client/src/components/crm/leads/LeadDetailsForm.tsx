import { Input, Select, type SelectOption } from '@/components/ui'
import type { CreateLeadPayload } from '@/types/crm'

interface LeadDetailsFormProps {
  form: CreateLeadPayload
  onChange: (patch: Partial<CreateLeadPayload>) => void
  memberOptions: SelectOption[]
}

const STATUS_OPTIONS: SelectOption[] = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'in_discussion', label: 'In Discussion' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'proposal_sent', label: 'Proposal Sent' },
  { value: 'unqualified', label: 'Unqualified' },
]

const SOURCE_OPTIONS: SelectOption[] = [
  { value: 'website', label: 'Website' },
  { value: 'referral', label: 'Referral' },
  { value: 'cold_call', label: 'Cold Call' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'event', label: 'Event' },
  { value: 'partner', label: 'Partner' },
  { value: 'other', label: 'Other' },
]

const TYPE_OPTIONS: SelectOption[] = [
  { value: 'inbound', label: 'Inbound' },
  { value: 'outbound', label: 'Outbound' },
  { value: 'partner', label: 'Partner' },
  { value: 'expansion', label: 'Expansion' },
]

export function LeadDetailsForm({ form, onChange, memberOptions }: LeadDetailsFormProps) {
  return (
    <div className="space-y-4">
      <Input
        label="Company Name"
        placeholder="e.g. Acme Corp"
        value={form.companyName || ''}
        onChange={(e) => onChange({ companyName: e.target.value })}
        required
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-700">Lead Status</label>
          <Select
            value={form.status || 'new'}
            onChange={(val) => onChange({ status: val as CreateLeadPayload['status'] })}
            options={STATUS_OPTIONS}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-700">Lead Owner *</label>
          <Select
            value={form.leadOwnerId || ''}
            onChange={(val) => onChange({ leadOwnerId: val })}
            options={memberOptions}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-700">Lead Source</label>
          <Select
            value={form.source || 'website'}
            onChange={(val) => onChange({ source: val as CreateLeadPayload['source'] })}
            options={SOURCE_OPTIONS}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-700">Lead Type</label>
          <Select
            value={form.type || 'inbound'}
            onChange={(val) => onChange({ type: val as CreateLeadPayload['type'] })}
            options={TYPE_OPTIONS}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Input
          label="Meeting Date"
          type="date"
          value={form.meetingDate || ''}
          onChange={(e) => onChange({ meetingDate: e.target.value })}
        />
        <Input
          label="Next Contact Date"
          type="date"
          value={form.nextContactDate || ''}
          onChange={(e) => onChange({ nextContactDate: e.target.value })}
        />
        <Input
          label="Expected Conversion"
          type="date"
          value={form.expectedConversionDate || ''}
          onChange={(e) => onChange({ expectedConversionDate: e.target.value })}
        />
      </div>
    </div>
  )
}
