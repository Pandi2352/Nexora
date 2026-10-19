import { Input, Select, Textarea, type SelectOption } from '@/components/ui'
import type { CreateLeadPayload } from '@/types/crm'

interface LeadContactFormProps {
  form: CreateLeadPayload
  onChange: (patch: Partial<CreateLeadPayload>) => void
}

const SALUTATION_OPTIONS: SelectOption[] = [
  { value: 'Mr.', label: 'Mr.' },
  { value: 'Ms.', label: 'Ms.' },
  { value: 'Mrs.', label: 'Mrs.' },
  { value: 'Dr.', label: 'Dr.' },
  { value: 'Prof.', label: 'Prof.' },
]

const GENDER_OPTIONS: SelectOption[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
]

export function LeadContactForm({ form, onChange }: LeadContactFormProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-700">Salutation</label>
          <Select
            value={form.salutation || 'Mr.'}
            onChange={(val) => onChange({ salutation: val as CreateLeadPayload['salutation'] })}
            options={SALUTATION_OPTIONS}
          />
        </div>
        <Input
          label="First Name"
          placeholder="John"
          value={form.contactFirstName || ''}
          onChange={(e) => onChange({ contactFirstName: e.target.value })}
          required
        />
        <Input
          label="Last Name"
          placeholder="Doe"
          value={form.contactLastName || ''}
          onChange={(e) => onChange({ contactLastName: e.target.value })}
          required
        />
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-700">Gender</label>
          <Select
            value={form.gender || 'male'}
            onChange={(val) => onChange({ gender: val as CreateLeadPayload['gender'] })}
            options={GENDER_OPTIONS}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          label="Designation / Role"
          placeholder="e.g. VP of Procurement"
          value={form.designation || ''}
          onChange={(e) => onChange({ designation: e.target.value })}
        />
        <Input
          label="Contact Email"
          type="email"
          placeholder="john.doe@company.com"
          value={form.contactEmail || ''}
          onChange={(e) => onChange({ contactEmail: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          label="Phone Number"
          type="tel"
          placeholder="+91 98765 43210"
          value={form.contactPhone || ''}
          onChange={(e) => onChange({ contactPhone: e.target.value })}
        />
        <Input
          label="Date of Birth"
          type="date"
          value={form.dateOfBirth || ''}
          onChange={(e) => onChange({ dateOfBirth: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          label="LinkedIn ID / URL"
          placeholder="https://linkedin.com/in/..."
          value={form.linkedInUrl || ''}
          onChange={(e) => onChange({ linkedInUrl: e.target.value })}
        />
        <Input
          label="Twitter / X Handle"
          placeholder="@handle"
          value={form.twitterHandle || ''}
          onChange={(e) => onChange({ twitterHandle: e.target.value })}
        />
      </div>

      <Textarea
        label="Contact Description / Notes"
        rows={2}
        placeholder="Background notes on this key stakeholder..."
        value={form.contactDescription || ''}
        onChange={(e) => onChange({ contactDescription: e.target.value })}
      />
    </div>
  )
}
