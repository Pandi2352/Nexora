import { useState } from 'react'
import { Calendar, DollarSign, FileText, PhoneCall, Sparkles } from 'lucide-react'
import { Button, DatePicker, Input, Modal, Select, Textarea, type SelectOption } from '@/components/ui'
import type { ActivityOutcome, ActivityType, CreateActivityPayload } from '@/types/crm'

interface LogActivityModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (payload: CreateActivityPayload) => Promise<void>
  companyOptions: SelectOption[]
}

const TYPE_OPTIONS: SelectOption[] = [
  { value: 'cold_call', label: 'Cold Call Outreach' },
  { value: 'meeting', label: 'Discovery / Demo Meeting' },
  { value: 'proposal_submitted', label: 'Commercial Proposal Submitted' },
  { value: 'follow_up', label: 'Follow Up Touchpoint' },
  { value: 'email', label: 'Email Thread' },
  { value: 'note', label: 'Internal Account Note' },
]

const STATUS_OPTIONS: SelectOption[] = [
  { value: 'completed', label: 'Completed' },
  { value: 'scheduled', label: 'Scheduled Ahead' },
  { value: 'cancelled', label: 'Cancelled' },
]

const OUTCOME_OPTIONS: SelectOption[] = [
  { value: 'positive', label: 'Positive (Strong Buyer Interest)' },
  { value: 'neutral', label: 'Neutral (Further Evaluation)' },
  { value: 'negative', label: 'Negative (Not Interested / Bad Timing)' },
  { value: 'followup_needed', label: 'Action Required (Follow-up Scheduled)' },
]

export function LogActivityModal({
  isOpen,
  onClose,
  onSave,
  companyOptions,
}: LogActivityModalProps) {
  const [type, setType] = useState<ActivityType>('cold_call')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [companyId, setCompanyId] = useState('')
  const [status, setStatus] = useState<'completed' | 'scheduled' | 'cancelled'>('completed')
  const [outcome, setOutcome] = useState<ActivityOutcome>('positive')
  const [proposalValue, setProposalValue] = useState<number | ''>('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('Title / Subject is required')
      return
    }

    setIsSubmitting(true)
    setError(null)
    try {
      await onSave({
        type,
        title: title.trim(),
        description: description.trim() || undefined,
        companyId: companyId || undefined,
        status,
        outcome: status === 'completed' ? outcome : undefined,
        proposalValue: type === 'proposal_submitted' && proposalValue ? Number(proposalValue) : undefined,
        completedAt: status === 'completed' ? new Date(date).toISOString() : undefined,
        scheduledAt: status === 'scheduled' ? new Date(date).toISOString() : undefined,
      })
      setTitle('')
      setDescription('')
      setProposalValue('')
      onClose()
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to log activity.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Log Sales Activity"
      description="Record stakeholder interactions, cold calls, executive meetings, and quoted bids."
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="rounded-md bg-rose-50 p-3 text-xs text-rose-700 border border-rose-200">
            {error}
          </div>
        )}

        {/* Section 1: Classification & Account */}
        <div className="rounded-md border border-slate-200 bg-slate-50/50 p-4 space-y-3.5">
          <div className="flex items-center gap-2 border-b border-slate-200/80 pb-2">
            <PhoneCall className="size-4 text-brand-600 shrink-0" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Interaction Classification & Target Account
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Activity Touchpoint Type
              </label>
              <Select
                value={type}
                onChange={(val) => setType(val as ActivityType)}
                options={TYPE_OPTIONS}
              />
              <p className="mt-1 text-[11px] text-brand-600">
                Identifies interaction channel and CRM reporting bucket.
              </p>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Related Company / Client
              </label>
              <Select
                value={companyId}
                onChange={(val) => setCompanyId(val)}
                options={[{ value: '', label: 'General / No Company Linked' }, ...companyOptions]}
              />
              <p className="mt-1 text-[11px] text-slate-500">
                Associates touchpoint with account engagement history.
              </p>
            </div>
          </div>

          <div>
            <Input
              label="Subject / Headline"
              placeholder={
                type === 'cold_call'
                  ? 'e.g. Discovery call with Chief Technology Officer'
                  : type === 'proposal_submitted'
                  ? 'e.g. Enterprise Cloud Modernization Proposal v2'
                  : 'e.g. Architecture Demo & Stakeholder Walkthrough'
              }
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <p className="mt-1 text-[11px] text-slate-500">
              Brief summary headline for the activity feed.
            </p>
          </div>
        </div>

        {/* Section 2: Timing, Outcome & Commercials */}
        <div className="rounded-md border border-slate-200 bg-slate-50/50 p-4 space-y-3.5">
          <div className="flex items-center gap-2 border-b border-slate-200/80 pb-2">
            <Calendar className="size-4 text-blue-600 shrink-0" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Timing & Execution Outcome
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <DatePicker
                label="Activity Date"
                value={date}
                onChange={setDate}
                placeholder="Select date"
              />
              <p className="mt-1 text-[11px] text-blue-600 font-medium">
                Recorded or scheduled calendar date
              </p>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">Execution Status</label>
              <Select
                value={status}
                onChange={(val) => setStatus(val as 'completed' | 'scheduled' | 'cancelled')}
                options={STATUS_OPTIONS}
              />
              <p className="mt-1 text-[11px] text-slate-500">
                Current progress of this touchpoint
              </p>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">Buyer Sentiment / Outcome</label>
              <Select
                value={outcome}
                onChange={(val) => setOutcome(val as ActivityOutcome)}
                options={OUTCOME_OPTIONS}
              />
              <p className="mt-1 text-[11px] text-emerald-600">
                Customer reaction or needed next step
              </p>
            </div>
          </div>

          {type === 'proposal_submitted' && (
            <div className="rounded-md border border-emerald-200 bg-emerald-50/50 p-3 mt-2">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="size-4 text-emerald-600" />
                <span className="text-xs font-bold text-emerald-900">Quotation Commercials</span>
              </div>
              <Input
                label="Proposal Quotation Value (₹)"
                type="number"
                min={0}
                placeholder="e.g. 3500000"
                value={proposalValue}
                onChange={(e) => setProposalValue(e.target.value ? Number(e.target.value) : '')}
              />
              <p className="mt-1 text-[11px] text-emerald-700">
                Quoted contract bid value in Indian Rupees (₹)
              </p>
            </div>
          )}
        </div>

        {/* Section 3: Notes & Discussion Details */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 mb-1">
            <FileText className="size-3.5 text-slate-500" />
            <label className="text-xs font-semibold text-slate-700">
              Key Discussion Notes & Action Items
            </label>
          </div>
          <Textarea
            rows={3}
            placeholder="Key discussion takeaways, stakeholder feedback, competitor mentions, and next action items..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <p className="text-[11px] text-slate-400">
            Visible in account timeline and sales velocity analytics.
          </p>
        </div>

        {/* Footer controls */}
        <div className="flex items-center justify-end gap-2 border-t border-slate-200 pt-3">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isSubmitting} className="cursor-pointer">
            Cancel
          </Button>
          <Button type="submit" size="sm" disabled={isSubmitting} className="cursor-pointer bg-brand-600 hover:bg-brand-700 text-white">
            <Sparkles className="size-3.5 mr-1.5" />
            {isSubmitting ? 'Logging...' : 'Save Activity'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
