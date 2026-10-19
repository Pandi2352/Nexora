import { useState } from 'react'
import { ArrowRight, Building2, TrendingUp, UserCheck } from 'lucide-react'
import { Button, Modal } from '@/components/ui'
import type { Lead } from '@/types/crm'
import { formatINR } from '../crm-formatters'

interface LeadConvertModalProps {
  open: boolean
  onClose: () => void
  lead: Lead | null
  onConvert: (leadId: string) => Promise<void>
}

export function LeadConvertModal({ open, onClose, lead, onConvert }: LeadConvertModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!lead) return null

  const handleConfirm = async () => {
    setIsSubmitting(true)
    setError(null)
    try {
      await onConvert(lead.id)
      onClose()
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to convert lead.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title="Convert Lead"
      description={`Convert "${lead.companyName}" from a lead into CRM operating records.`}
      size="md"
    >
      <div className="space-y-4">
        {error && (
          <div className="rounded-md bg-red-50 p-3 text-xs text-red-600 border border-red-200">
            {error}
          </div>
        )}

        <div className="rounded-md border border-slate-200 bg-slate-50 p-3 space-y-2 text-xs">
          <p className="font-medium text-slate-700">Converting this lead will automatically generate:</p>
          <ul className="space-y-1.5 text-slate-600">
            <li className="flex items-center gap-2">
              <Building2 className="size-3.5 text-brand-600 shrink-0" />
              <span><strong>Company:</strong> {lead.companyName}</span>
            </li>
            <li className="flex items-center gap-2">
              <UserCheck className="size-3.5 text-purple-600 shrink-0" />
              <span><strong>Contact:</strong> {lead.contactFirstName} {lead.contactLastName} ({lead.contactEmail})</span>
            </li>
            <li className="flex items-center gap-2">
              <TrendingUp className="size-3.5 text-emerald-600 shrink-0" />
              <span>
                <strong>Opportunity:</strong> {lead.companyName} — Deal ({formatINR(lead.annualRevenueTarget)})
              </span>
            </li>
          </ul>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate-200 pt-3">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleConfirm} disabled={isSubmitting}>
            {isSubmitting ? 'Converting...' : 'Confirm Conversion'}
            <ArrowRight className="size-3.5 ml-1.5" />
          </Button>
        </div>
      </div>
    </Modal>
  )
}
