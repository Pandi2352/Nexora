import { Star } from 'lucide-react'
import { Input, Select, Textarea, type SelectOption } from '@/components/ui'
import type { CreateLeadPayload } from '@/types/crm'

interface LeadFunnelFormProps {
  form: CreateLeadPayload
  onChange: (patch: Partial<CreateLeadPayload>) => void
  buOptions?: SelectOption[]
}

const DEFAULT_BU_OPTIONS: SelectOption[] = [
  { value: 'enterprise', label: 'Enterprise' },
  { value: 'mid_market', label: 'Mid Market' },
  { value: 'smb', label: 'SMB' },
  { value: 'government', label: 'Government' },
  { value: 'digital', label: 'Digital' },
]

const REV_TYPE_OPTIONS: SelectOption[] = [
  { value: 'recurring', label: 'Recurring' },
  { value: 'one_time', label: 'One Time' },
  { value: 'fixed_bid', label: 'Fixed Bid' },
  { value: 'time_and_materials', label: 'Time & Materials' },
]

const REV_CAT_OPTIONS: SelectOption[] = [
  { value: 'software_license', label: 'Software License' },
  { value: 'implementation', label: 'Implementation' },
  { value: 'managed_services', label: 'Managed Services' },
  { value: 'consulting', label: 'Consulting' },
]

const FREQ_OPTIONS: SelectOption[] = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'annually', label: 'Annually' },
  { value: 'milestone', label: 'Milestone' },
]

export function LeadFunnelForm({ form, onChange, buOptions }: LeadFunnelFormProps) {
  const options = buOptions && buOptions.length > 0 ? buOptions : DEFAULT_BU_OPTIONS

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-700">Business Unit</label>
          <Select
            value={form.businessUnit || (options[0]?.value as any) || 'enterprise'}
            onChange={(val) => onChange({ businessUnit: val as CreateLeadPayload['businessUnit'] })}
            options={options}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-700">Revenue Type</label>
          <Select
            value={form.revenueType || 'recurring'}
            onChange={(val) => onChange({ revenueType: val as CreateLeadPayload['revenueType'] })}
            options={REV_TYPE_OPTIONS}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-700">Revenue Category</label>
          <Select
            value={form.revenueCategory || 'software_license'}
            onChange={(val) => onChange({ revenueCategory: val as CreateLeadPayload['revenueCategory'] })}
            options={REV_CAT_OPTIONS}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-700">Revenue Frequency</label>
          <Select
            value={form.revenueFrequency || 'annually'}
            onChange={(val) => onChange({ revenueFrequency: val as CreateLeadPayload['revenueFrequency'] })}
            options={FREQ_OPTIONS}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Input
          label="Billing Start Month"
          type="month"
          value={form.billingStartMonth || ''}
          onChange={(e) => onChange({ billingStartMonth: e.target.value })}
        />
        <Input
          label="Annual Revenue Target (₹)"
          hint="Note: Enter expected annual revenue in Indian Rupees (₹)"
          type="number"
          min={0}
          step="1000"
          placeholder="e.g. 1500000"
          value={form.annualRevenueTarget !== undefined ? form.annualRevenueTarget : ''}
          onChange={(e) => onChange({ annualRevenueTarget: Number(e.target.value) || 0 })}
        />
        <Input
          label="Contract Period (Years)"
          hint="Enter contract duration 0 to some years"
          type="number"
          min={0}
          max={20}
          placeholder="0"
          value={form.contractPeriod !== undefined ? form.contractPeriod : ''}
          onChange={(e) => onChange({ contractPeriod: Number(e.target.value) || 0 })}
        />
      </div>

      {/* Must Win Toggle */}
      <div className="flex items-center justify-between rounded-md border border-amber-200 bg-amber-50/50 p-3">
        <div className="flex items-center gap-2">
          <Star className={`size-4 ${form.isMustWin ? 'fill-amber-500 text-amber-500' : 'text-slate-400'}`} />
          <div>
            <p className="text-xs font-medium text-slate-900">Must Win</p>
            <p className="text-[11px] text-slate-600">Mark this deal as a must-win opportunity</p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={!!form.isMustWin}
            onChange={(e) => onChange({ isMustWin: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
        </label>
      </div>

      <Textarea
        label="Scope of Work"
        rows={3}
        placeholder="Briefly describe the business scope, client requirements or deal context..."
        value={form.scope || ''}
        onChange={(e) => onChange({ scope: e.target.value })}
      />
    </div>
  )
}
