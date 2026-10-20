import { useState } from 'react'
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  UserCheck,
} from 'lucide-react'
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

  const isAlreadyQualified = lead.status === 'qualified'

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
      title={isAlreadyQualified ? 'Convert / Add Deal' : 'Convert Lead to Deal'}
      description="Transition this qualified lead into formal CRM operating records."
      size="md"
    >
      <div className="space-y-4">
        {error && (
          <div className="rounded-md bg-rose-50 p-3 text-xs text-rose-700 border border-rose-200">
            {error}
          </div>
        )}

        {/* Lead Account Summary Card */}
        <div className="rounded-md border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-brand-50/20 p-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-md border border-brand-200 bg-brand-50 text-brand-700 font-bold text-sm">
                {lead.companyName.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900 leading-tight">
                  {lead.companyName}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Target Quota: <strong className="text-slate-900">{formatINR(lead.annualRevenueTarget)}</strong>
                  {lead.businessUnit && ` · ${lead.businessUnit.replace(/_/g, ' ')}`}
                </p>
              </div>
            </div>

            {isAlreadyQualified ? (
              <span className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                <CheckCircle2 className="size-3.5" />
                Active Account
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-800">
                <Sparkles className="size-3 text-amber-600" />
                Ready to Convert
              </span>
            )}
          </div>
        </div>

        {/* Conversion Generated Artifacts */}
        <div className="rounded-md border border-slate-200 bg-white p-3 space-y-2.5 text-xs">
          <p className="font-semibold text-slate-800 text-[11px] uppercase tracking-wider">
            {isAlreadyQualified ? 'Records to be added / linked' : 'Operating records to be generated'}
          </p>

          <div className="grid gap-2">
            {/* Company Box */}
            <div className="flex items-start gap-2.5 rounded-md border border-slate-100 bg-slate-50/70 p-2.5">
              <Building2 className="size-4 text-brand-600 mt-0.5 shrink-0" />
              <div className="min-w-0">
                <span className="font-semibold text-slate-900">Company Master</span>
                <p className="text-[11px] text-slate-500 truncate">
                  {lead.companyName} ({isAlreadyQualified ? 'Linked existing account' : 'Created as prospect'})
                </p>
              </div>
            </div>

            {/* Contact Box */}
            <div className="flex items-start gap-2.5 rounded-md border border-slate-100 bg-slate-50/70 p-2.5">
              <UserCheck className="size-4 text-purple-600 mt-0.5 shrink-0" />
              <div className="min-w-0">
                <span className="font-semibold text-slate-900">Primary Contact</span>
                <p className="text-[11px] text-slate-500 truncate">
                  {lead.contactFirstName} {lead.contactLastName}
                  {lead.designation ? ` · ${lead.designation}` : ''} ({lead.contactEmail})
                </p>
              </div>
            </div>

            {/* Deal Box */}
            <div className="flex items-start gap-2.5 rounded-md border border-emerald-100 bg-emerald-50/40 p-2.5">
              <TrendingUp className="size-4 text-emerald-600 mt-0.5 shrink-0" />
              <div className="min-w-0">
                <span className="font-semibold text-emerald-900">Opportunity Deal</span>
                <p className="text-[11px] text-emerald-700 truncate">
                  {lead.companyName} — Deal · Stage: Qualification · {formatINR(lead.annualRevenueTarget)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-2 border-t border-slate-200 pt-3">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isSubmitting} className="cursor-pointer">
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="cursor-pointer bg-brand-600 hover:bg-brand-700 text-white"
          >
            {isSubmitting
              ? 'Converting...'
              : isAlreadyQualified
                ? 'Confirm & Add Deal'
                : 'Confirm Deal Conversion'}
            <ArrowRight className="size-3.5 ml-1.5" />
          </Button>
        </div>
      </div>
    </Modal>
  )
}
