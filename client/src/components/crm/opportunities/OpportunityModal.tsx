import { useEffect, useState } from 'react'
import { Building2, DollarSign, FileText, Star } from 'lucide-react'
import { Button, DatePicker, Input, Modal, Select, Textarea, type SelectOption } from '@/components/ui'
import type { CreateOpportunityPayload, Opportunity, OpportunityStage, QuotationStatus } from '@/types/crm'

interface OpportunityModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (payload: CreateOpportunityPayload) => Promise<void>
  initialOpportunity?: Opportunity | null
  companyOptions: SelectOption[]
}

const STAGE_OPTIONS: SelectOption[] = [
  { value: 'qualification', label: '1. Qualification' },
  { value: 'needs_analysis', label: '2. Needs Analysis' },
  { value: 'proposal_quote', label: '3. Proposal / Quote' },
  { value: 'negotiation', label: '4. Negotiation' },
  { value: 'closed_won', label: '5. Closed Won' },
  { value: 'closed_lost', label: '6. Closed Lost' },
]

const QUOTE_STATUS_OPTIONS: SelectOption[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'sent', label: 'Sent to Client' },
  { value: 'accepted', label: 'Accepted / Signed' },
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
      setExpectedCloseDate(
        initialOpportunity.expectedCloseDate
          ? new Date(initialOpportunity.expectedCloseDate).toISOString().slice(0, 10)
          : '',
      )
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
      title={initialOpportunity ? 'Edit Opportunity / Deal' : 'New Opportunity / Deal'}
      description="Configure pipeline deal value, quotation parameters, expected closing date, and strategic priority."
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="rounded-md bg-rose-50 p-3 text-xs text-rose-700 border border-rose-200">
            {error}
          </div>
        )}

        {/* Section 1: Opportunity Identity */}
        <div className="rounded-md border border-slate-200 bg-slate-50/50 p-4 space-y-3.5">
          <div className="flex items-center gap-2 border-b border-slate-200/80 pb-2">
            <Building2 className="size-4 text-brand-600 shrink-0" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Deal & Account Details
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                label="Opportunity / Deal Title"
                placeholder="e.g. Enterprise Cloud Modernization"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <p className="mt-1 text-[11px] text-brand-600">
                A clear, recognizable title representing this deal or scope.
              </p>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Associated Company / Client
              </label>
              <Select
                value={companyId}
                onChange={(val) => {
                  setCompanyId(val)
                  const comp = companyOptions.find((c) => c.value === val)
                  if (comp) setCompanyName(comp.label)
                }}
                options={[{ value: '', label: 'Select client organization...' }, ...companyOptions]}
              />
              <p className="mt-1 text-[11px] text-slate-500">
                Links quotation metrics and pipeline reporting to this client.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Commercial Value & Pipeline Stage */}
        <div className="rounded-md border border-slate-200 bg-slate-50/50 p-4 space-y-3.5">
          <div className="flex items-center gap-2 border-b border-slate-200/80 pb-2">
            <DollarSign className="size-4 text-emerald-600 shrink-0" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Commercials & Pipeline Stage
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Input
                label="Deal Value (₹)"
                type="number"
                min={0}
                placeholder="e.g. 5000000"
                value={value}
                onChange={(e) => setValue(e.target.value ? Number(e.target.value) : '')}
                required
              />
              <p className="mt-1 text-[11px] text-emerald-600 font-medium">
                Contract revenue quota in Indian Rupees (₹)
              </p>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">Pipeline Stage</label>
              <Select
                value={stage}
                onChange={(val) => setStage(val as OpportunityStage)}
                options={STAGE_OPTIONS}
              />
              <p className="mt-1 text-[11px] text-blue-600">
                Current position in sales pipeline
              </p>
            </div>

            <div>
              <Input
                label="Win Probability (%)"
                type="number"
                min={0}
                max={100}
                value={probability}
                onChange={(e) => setProbability(Number(e.target.value) || 0)}
              />
              <p className="mt-1 text-[11px] text-purple-600">
                Forecasted confidence (0 - 100%)
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Quotation & Timeline */}
        <div className="rounded-md border border-slate-200 bg-slate-50/50 p-4 space-y-3.5">
          <div className="flex items-center gap-2 border-b border-slate-200/80 pb-2">
            <FileText className="size-4 text-sky-600 shrink-0" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Quotation & Closing Timeline
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <DatePicker
                label="Target Close Date"
                value={expectedCloseDate}
                onChange={setExpectedCloseDate}
                placeholder="Select close date"
              />
              <p className="mt-1 text-[11px] text-slate-500">
                Expected signature or closing date
              </p>
            </div>

            <div>
              <Input
                label="Quotation Number"
                placeholder="e.g. QT-2026-0042"
                value={quotationNumber}
                onChange={(e) => setQuotationNumber(e.target.value)}
              />
              <p className="mt-1 text-[11px] text-slate-500">
                Optional reference identifier for formal bid
              </p>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Quotation Status
              </label>
              <Select
                value={quotationStatus}
                onChange={(val) => setQuotationStatus(val as QuotationStatus)}
                options={QUOTE_STATUS_OPTIONS}
              />
              <p className="mt-1 text-[11px] text-slate-500">
                Approval and dispatch tracking
              </p>
            </div>
          </div>
        </div>

        {/* Must Win Priority Card */}
        <div className="flex items-center justify-between rounded-md border border-amber-200 bg-amber-50/60 p-3.5">
          <div className="flex items-center gap-2.5">
            <Star className={`size-5 ${isMustWin ? 'fill-amber-500 text-amber-500' : 'text-slate-400'}`} />
            <div>
              <p className="text-xs font-bold text-amber-950">Must-Win Strategic Deal</p>
              <p className="text-[11px] text-amber-800">
                Flags this opportunity across leadership pipeline dashboards for proactive executive engagement.
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isMustWin}
              onChange={(e) => setIsMustWin(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
          </label>
        </div>

        {/* Deal Notes */}
        <div>
          <Textarea
            label="Deal Scope & Strategic Notes"
            rows={3}
            placeholder="Contract terms, solution architecture, buyer committee key priorities, or negotiation points..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-end gap-2 border-t border-slate-200 pt-3">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isSubmitting} className="cursor-pointer">
            Cancel
          </Button>
          <Button type="submit" size="sm" disabled={isSubmitting} className="cursor-pointer bg-brand-600 hover:bg-brand-700 text-white">
            {isSubmitting ? 'Saving...' : initialOpportunity ? 'Update Deal' : 'Create Deal'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
