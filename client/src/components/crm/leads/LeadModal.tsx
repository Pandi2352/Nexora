import { useEffect, useState } from 'react'
import { Building2, DollarSign, UserCheck } from 'lucide-react'
import { Button, Modal, type SelectOption } from '@/components/ui'
import type { CreateLeadPayload, Lead } from '@/types/crm'
import { LeadDetailsForm } from './LeadDetailsForm'
import { LeadFunnelForm } from './LeadFunnelForm'
import { LeadContactForm } from './LeadContactForm'

interface LeadModalProps {
  open: boolean
  onClose: () => void
  onSave: (payload: CreateLeadPayload) => Promise<void>
  initialLead?: Lead | null
  memberOptions: SelectOption[]
  buOptions?: SelectOption[]
}

const DEFAULT_LEAD: CreateLeadPayload = {
  companyName: '',
  status: 'new',
  leadOwnerId: '',
  source: 'website',
  type: 'inbound',
  businessUnit: 'enterprise',
  revenueType: 'recurring',
  revenueCategory: 'software_license',
  revenueFrequency: 'annually',
  annualRevenueTarget: 0,
  contractPeriod: 1,
  isMustWin: false,
  contactFirstName: '',
  contactLastName: '',
  salutation: 'Mr.',
  gender: 'male',
  contactEmail: '',
}

type TabKey = 'details' | 'funnel' | 'contact'

export function LeadModal({
  open,
  onClose,
  onSave,
  initialLead,
  memberOptions,
  buOptions,
}: LeadModalProps) {
  const [form, setForm] = useState<CreateLeadPayload>(DEFAULT_LEAD)
  const [activeTab, setActiveTab] = useState<TabKey>('details')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initialLead) {
      setForm({
        companyName: initialLead.companyName,
        companyId: initialLead.companyId,
        status: initialLead.status,
        leadOwnerId: initialLead.leadOwnerId,
        source: initialLead.source,
        type: initialLead.type,
        meetingDate: initialLead.meetingDate?.slice(0, 10),
        nextContactDate: initialLead.nextContactDate?.slice(0, 10),
        expectedConversionDate: initialLead.expectedConversionDate?.slice(0, 10),
        businessUnit: initialLead.businessUnit,
        revenueType: initialLead.revenueType,
        revenueCategory: initialLead.revenueCategory,
        revenueFrequency: initialLead.revenueFrequency,
        billingStartMonth: initialLead.billingStartMonth,
        annualRevenueTarget: initialLead.annualRevenueTarget,
        contractPeriod: initialLead.contractPeriod,
        isMustWin: initialLead.isMustWin,
        scope: initialLead.scope,
        contactFirstName: initialLead.contactFirstName,
        contactLastName: initialLead.contactLastName,
        salutation: initialLead.salutation,
        gender: initialLead.gender,
        designation: initialLead.designation,
        contactEmail: initialLead.contactEmail,
        contactPhone: initialLead.contactPhone,
        dateOfBirth: initialLead.dateOfBirth?.slice(0, 10),
        contactDescription: initialLead.contactDescription,
        linkedInUrl: initialLead.linkedInUrl,
        twitterHandle: initialLead.twitterHandle,
      })
    } else {
      const defaultOwner = memberOptions[0]?.value || ''
      setForm({ ...DEFAULT_LEAD, leadOwnerId: defaultOwner })
    }
    setActiveTab('details')
    setError(null)
  }, [initialLead, open, memberOptions])

  const handlePatch = (patch: Partial<CreateLeadPayload>) => {
    setForm((prev) => ({ ...prev, ...patch }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.companyName.trim()) {
      setActiveTab('details')
      setError('Company name is required.')
      return
    }
    if (
      !(form.contactFirstName || '').trim() ||
      !(form.contactLastName || '').trim() ||
      !(form.contactEmail || '').trim()
    ) {
      setActiveTab('contact')
      setError('Contact First Name, Last Name and Email are required.')
      return
    }

    setIsSaving(true)
    setError(null)
    try {
      await onSave(form)
      onClose()
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to save lead.')
    } finally {
      setIsSaving(false)
    }
  }

  const tabs: { key: TabKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: 'details', label: '1. Lead Details', icon: Building2 },
    { key: 'funnel', label: '2. Funnel Information', icon: DollarSign },
    { key: 'contact', label: '3. Contact Person', icon: UserCheck },
  ]

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title={initialLead ? 'Edit Lead' : 'Create New Lead'}
      description="Capture company details, INR funnel projections, and primary stakeholder information."
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-md bg-red-50 p-3 text-xs text-red-600 border border-red-200">
            {error}
          </div>
        )}

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 space-x-4">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.key
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 pb-2.5 text-xs font-medium border-b-2 transition-colors cursor-pointer ${
                  isActive
                    ? 'border-brand-600 text-brand-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="size-3.5" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Tab Panels */}
        <div className="min-h-[320px] max-h-[60vh] overflow-y-auto pr-1">
          {activeTab === 'details' && (
            <LeadDetailsForm
              form={form}
              onChange={handlePatch}
              memberOptions={memberOptions}
            />
          )}
          {activeTab === 'funnel' && (
            <LeadFunnelForm
              form={form}
              onChange={handlePatch}
              buOptions={buOptions}
            />
          )}
          {activeTab === 'contact' && (
            <LeadContactForm
              form={form}
              onChange={handlePatch}
            />
          )}
        </div>

        {/* Footer controls */}
        <div className="flex items-center justify-between border-t border-slate-200 pt-3">
          <div className="flex items-center gap-2">
            {activeTab !== 'details' && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setActiveTab(activeTab === 'contact' ? 'funnel' : 'details')}
              >
                Previous
              </Button>
            )}
            {activeTab !== 'contact' && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setActiveTab(activeTab === 'details' ? 'funnel' : 'contact')}
              >
                Next Section
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={isSaving}>
              {isSaving ? 'Saving...' : initialLead ? 'Update Lead' : 'Save Lead'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  )
}
