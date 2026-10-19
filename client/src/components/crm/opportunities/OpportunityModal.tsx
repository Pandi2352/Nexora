import { useEffect, useState } from 'react'
import { Star } from 'lucide-react'
import { Button, Input, Modal, Select, Textarea, type SelectOption } from '@/components/ui'
import type { CreateOpportunityPayload, Opportunity, OpportunityStage, QuotationStatus } from '@/types/crm'

interface OpportunityModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (payload: CreateOpportunityPayload) => Promise<void>
  initialOpportunity?: Opportunity | null
  companyOptions: SelectOption[]
}

const STAGE_OPTIONS: SelectOption[] = [
  { value: 'qualification', label: 'Qualification' },
  { value: 'needs_analysis', label: 'Needs Analysis' },
  { value: 'proposal_quote', label: 'Proposal / Quote' },
  { value: 'negotiation', label: 'Negotiation' },
  { value: 'closed_won', label: 'Closed Won' },
  { value: 'closed_lost', label: 'Closed Lost' },
]

const QUOTE_STATUS_OPTIONS: SelectOption[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'sent', label: 'Sent' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'declined', label: 'Declined' },
]

export function OpportunityModal({
  isOpen,
  onClose,
  onSave,
  initialOpportunity,
  companyOptions,
}: OpportunityModalProps) {
  const [title, setTitle] = useState('')
  const [companyId, setCompanyId] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [stage, setStage] = useState<OpportunityStage>('qualification')
  const [value, setValue] = useState<number | ''>('')
  const [probability, setProbability] = useState<number>(50)
  const [expectedCloseDate, setExpectedCloseDate] = useState('')
  const [isMustWin, setIsMustWin] = useState(false)
  const [quotationNumber, setQuotationNumber] = useState('')
  const [quotationStatus, setQuotationStatus] = useState<QuotationStatus>('draft')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initialOpportunity) {
      setTitle(initialOpportunity.title)
      setCompanyId(initialOpportunity.companyId || '')
      setCompanyName(initialOpportunity.companyName || '')
      setStage(initialOpportunity.stage)
      setValue(initialOpportunity.value)
      setProbability(initialOpportunity.probability)
      setExpectedCloseDate(initialOpportunity.expectedCloseDate?.slice(0, 10) || '')
      setIsMustWin(initialOpportunity.isMustWin)
      setQuotationNumber(initialOpportunity.quotationNumber || '')
      setQuotationStatus(initialOpportunity.quotationStatus || 'draft')
      setNotes(initialOpportunity.notes || '')
    } else {
      setTitle('')
      setCompanyId('')
      setCompanyName('')
      setStage('qualification')
      setValue('')
      setProbability(50)
      setExpectedCloseDate('')
      setIsMustWin(false)
      setQuotationNumber('')
      setQuotationStatus('draft')
      setNotes('')
    }
    setError(null)
  }, [initialOpportunity, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('Opportunity title is required')
      return
    }
    if (value === '' || Number(value) < 0) {
      setError('Please enter a valid deal value in Indian Rupees (₹)')
      return
    }

    setIsSubmitting(true)
    setError(null)
    try {
      await onSave({
        title: title.trim(),
        companyId: companyId || undefined,
        companyName: companyName.trim() || undefined,
        stage,
        value: Number(value),
        probability,
        expectedCloseDate: expectedCloseDate ? new Date(expectedCloseDate).toISOString() : undefined,
        isMustWin,
        quotationNumber: quotationNumber.trim() || undefined,
        quotationStatus: quotationNumber ? quotationStatus : undefined,
        notes: notes.trim() || undefined,
      })
      onClose()
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to save deal.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialOpportunity ? 'Edit Opportunity' : 'Create Opportunity'}
      description="Track deal milestones, INR ₹ pipeline value, and quotation lifecycle."
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-md bg-red-50 p-3 text-xs text-red-600 border border-red-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Deal Title"
            placeholder="e.g. Enterprise License Expansion"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">Company</label>
            <Select
              value={companyId}
              onChange={(val) => {
                setCompanyId(val)
                const comp = companyOptions.find((c) => c.value === val)
                if (comp) setCompanyName(comp.label)
              }}
              options={[{ value: '', label: 'Select or write custom below' }, ...companyOptions]}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">Pipeline Stage</label>
            <Select
              value={stage}
              onChange={(val) => setStage(val as OpportunityStage)}
              options={STAGE_OPTIONS}
            />
          </div>
          <Input
            label="Deal Value (₹)"
            hint="Value in Indian Rupees (₹)"
            type="number"
            min={0}
            placeholder="e.g. 5000000"
            value={value}
            onChange={(e) => setValue(e.target.value ? Number(e.target.value) : '')}
            required
          />
          <Input
            label="Probability (%)"
            type="number"
            min={0}
            max={100}
            value={probability}
            onChange={(e) => setProbability(Number(e.target.value) || 0)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            label="Target Close Date"
            type="date"
            value={expectedCloseDate}
            onChange={(e) => setExpectedCloseDate(e.target.value)}
          />
          <Input
            label="Quotation Number"
            placeholder="e.g. QT-2026-0042"
            value={quotationNumber}
            onChange={(e) => setQuotationNumber(e.target.value)}
          />
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">Quotation Status</label>
            <Select
              value={quotationStatus}
              onChange={(val) => setQuotationStatus(val as QuotationStatus)}
              options={QUOTE_STATUS_OPTIONS}
            />
          </div>
        </div>

        {/* Must Win deal switch */}
        <div className="flex items-center justify-between rounded-md border border-amber-200 bg-amber-50/50 p-3">
          <div className="flex items-center gap-2">
            <Star className={`size-4 ${isMustWin ? 'fill-amber-500 text-amber-500' : 'text-slate-400'}`} />
            <div>
              <p className="text-xs font-medium text-slate-900">Must Win</p>
              <p className="text-[11px] text-slate-600">Mark this deal as a must-win opportunity</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isMustWin}
              onChange={(e) => setIsMustWin(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
          </label>
        </div>

        <Textarea
          label="Deal Notes & Scope"
          rows={2}
          placeholder="Contract terms, solution details or negotiation notes..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <div className="flex items-center justify-end gap-2 border-t border-slate-200 pt-3">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" size="sm" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : initialOpportunity ? 'Update Deal' : 'Create Deal'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
