import { useState, useMemo } from 'react'
import { Plus, Check, X } from 'lucide-react'
import { Button, Input, Select, Tooltip, type SelectOption } from '@/components/ui'

const DEFAULT_INDUSTRIES = [
  'Technology',
  'Software & SaaS',
  'Finance & Banking',
  'Healthcare & Life Sciences',
  'Manufacturing',
  'Consulting & Professional Services',
  'Retail & E-commerce',
  'Real Estate & Construction',
  'Telecommunications',
  'Education',
  'Logistics & Supply Chain',
  'Energy & Utilities',
  'Media & Advertising',
  'Hospitality & Travel',
  'Other',
]

interface IndustrySelectProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function IndustrySelect({ value, onChange, disabled }: IndustrySelectProps) {
  const [customIndustries, setCustomIndustries] = useState<string[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [newIndustry, setNewIndustry] = useState('')

  const options = useMemo<SelectOption[]>(() => {
    const combined = Array.from(new Set([...DEFAULT_INDUSTRIES, ...customIndustries, ...(value ? [value] : [])]))
    return combined.map((ind) => ({ value: ind, label: ind }))
  }, [customIndustries, value])

  const handleAddCustom = () => {
    const trimmed = newIndustry.trim()
    if (!trimmed) return
    if (!customIndustries.includes(trimmed)) {
      setCustomIndustries((prev) => [...prev, trimmed])
    }
    onChange(trimmed)
    setNewIndustry('')
    setIsCreating(false)
  }

  if (isCreating) {
    return (
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          New Industry Name
        </label>
        <div className="flex items-center gap-1.5">
          <Input
            value={newIndustry}
            onChange={(e) => setNewIndustry(e.target.value)}
            placeholder="e.g. Artificial Intelligence, Biotech..."
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleAddCustom()
              } else if (e.key === 'Escape') {
                setIsCreating(false)
              }
            }}
          />
          <Button
            type="button"
            size="md"
            variant="primary"
            onClick={handleAddCustom}
            disabled={!newIndustry.trim()}
            className="shrink-0 cursor-pointer"
          >
            <Check className="size-4 mr-1" />
            Add
          </Button>
          <Button
            type="button"
            size="md"
            variant="secondary"
            onClick={() => setIsCreating(false)}
            className="shrink-0 cursor-pointer"
          >
            <X className="size-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-end gap-2">
      <div className="flex-1">
        <Select
          label="Industry"
          value={value}
          options={options}
          onChange={(val) => onChange(val || '')}
          placeholder="Select industry..."
          searchable
          clearable
          disabled={disabled}
        />
      </div>
      <Tooltip content="Create new custom industry">
        <button
          type="button"
          onClick={() => setIsCreating(true)}
          disabled={disabled}
          className="mb-0.5 size-9.5 shrink-0 flex items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-slate-600 hover:text-brand-600 hover:bg-brand-50 hover:border-brand-200 transition-colors cursor-pointer"
          aria-label="Create industry"
        >
          <Plus className="size-4" />
        </button>
      </Tooltip>
    </div>
  )
}
