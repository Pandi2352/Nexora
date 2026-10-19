import { useState } from 'react'
import { Button, Input, Modal, Select, Textarea, type SelectOption } from '@/components/ui'
import type { ActivityOutcome, ActivityType, CreateActivityPayload } from '@/types/crm'

interface LogActivityModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (payload: CreateActivityPayload) => Promise<void>
  companyOptions: SelectOption[]
}

const TYPE_OPTIONS: SelectOption[] = [
  { value: 'cold_call', label: 'Cold Call' },
  { value: 'meeting', label: 'Discovery Meeting' },
  { value: 'proposal_submitted', label: 'Proposal Submitted' },
  { value: 'follow_up', label: 'Follow Up' },
  { value: 'email', label: 'Email' },
  { value: 'note', label: 'Note' },
]

const STATUS_OPTIONS: SelectOption[] = [
  { value: 'completed', label: 'Completed' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'cancelled', label: 'Cancelled' },
]

const OUTCOME_OPTIONS: SelectOption[] = [
  { value: 'positive', label: 'Positive' },
  { value: 'neutral', label: 'Neutral' },
  { value: 'negative', label: 'Negative' },
  { value: 'followup_needed', label: 'Follow-up Needed' },
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
      setError('Title is required')
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
      description="Record client touches, cold calls, meetings, and proposal submissions."
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-md bg-red-50 p-3 text-xs text-red-600 border border-red-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">Activity Type</label>
            <Select
              value={type}
              onChange={(val) => setType(val as ActivityType)}
              options={TYPE_OPTIONS}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">Related Company</label>
            <Select
              value={companyId}
              onChange={(val) => setCompanyId(val)}
              options={[{ value: '', label: 'None / General' }, ...companyOptions]}
            />
          </div>
        </div>

        <Input
          label="Subject / Title"
          placeholder={
            type === 'cold_call'
              ? 'e.g. Discovery call with Head of Engineering'
              : type === 'proposal_submitted'
              ? 'e.g. Enterprise Cloud Migration Proposal'
              : 'e.g. Demo presentation'
          }
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        {type === 'proposal_submitted' && (
          <Input
            label="Proposal Quotation Value (₹)"
            hint="Enter proposal quoted value in Indian Rupees (₹)"
            type="number"
            min={0}
            placeholder="e.g. 2500000"
            value={proposalValue}
            onChange={(e) => setProposalValue(e.target.value ? Number(e.target.value) : '')}
          />
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">Status</label>
            <Select
              value={status}
              onChange={(val) => setStatus(val as 'completed' | 'scheduled' | 'cancelled')}
              options={STATUS_OPTIONS}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">Outcome</label>
            <Select
              value={outcome}
              onChange={(val) => setOutcome(val as ActivityOutcome)}
              options={OUTCOME_OPTIONS}
            />
          </div>
          <Input
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <Textarea
          label="Notes & Summary"
          rows={3}
          placeholder="Key discussion points, customer feedback, next steps..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="flex items-center justify-end gap-2 border-t border-slate-200 pt-3">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" size="sm" disabled={isSubmitting}>
            {isSubmitting ? 'Logging...' : 'Save Activity'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
