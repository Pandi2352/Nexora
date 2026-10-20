import { useState } from 'react'
import {
  ArrowLeft,
  Building,
  Calendar,
  Check,
  DollarSign,
  Layers,
  Save,
  Sparkles,
  Star,
  User,
} from 'lucide-react'
import {
  Button,
  Input,
  Select,
  Textarea,
  type SelectOption,
} from '@/components/ui'
import type {
  BusinessUnit,
  CreateLeadPayload,
  Lead,
  LeadContactItem,
  LeadSource,
  LeadStatus,
  LeadType,
  RevenueCategory,
  RevenueFrequency,
  RevenueType,
} from '@/types/crm'
import { LeadContactsTable } from './LeadContactsTable'

interface LeadFormPageProps {
  initialLead: Lead | null
  memberOptions: SelectOption[]
  buOptions: SelectOption[]
  onSave: (payload: CreateLeadPayload) => Promise<void>
  onCancel: () => void
}

const STATUS_OPTIONS: SelectOption[] = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'in_discussion', label: 'In Discussion' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'proposal_sent', label: 'Proposal Sent' },
  { value: 'unqualified', label: 'Unqualified' },
]

const SOURCE_OPTIONS: SelectOption[] = [
  { value: 'website', label: 'Website Inbound' },
  { value: 'referral', label: 'Client Referral' },
  { value: 'cold_call', label: 'Cold Outreach' },
  { value: 'linkedin', label: 'LinkedIn Sales' },
  { value: 'event', label: 'Conference / Event' },
  { value: 'partner', label: 'Strategic Partner' },
  { value: 'other', label: 'Other Channel' },
]

const TYPE_OPTIONS: SelectOption[] = [
  { value: 'inbound', label: 'Inbound Opportunity' },
  { value: 'outbound', label: 'Outbound Prospect' },
  { value: 'partner', label: 'Partner Channel' },
  { value: 'expansion', label: 'Account Expansion' },
]

const REVENUE_TYPE_OPTIONS: SelectOption[] = [
  { value: 'recurring', label: 'Recurring Subscription' },
  { value: 'one_time', label: 'One-Time Project' },
  { value: 'fixed_bid', label: 'Fixed Bid Deliverable' },
  { value: 'time_and_materials', label: 'Time & Materials' },
]

const FREQUENCY_OPTIONS: SelectOption[] = [
  { value: 'annually', label: 'Annually' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'milestone', label: 'Milestone Based' },
]

export function LeadFormPage({
  initialLead,
  memberOptions,
  buOptions,
  onSave,
  onCancel,
}: LeadFormPageProps) {
  const isEditing = !!initialLead

  const [companyName, setCompanyName] = useState(initialLead?.companyName || '')
  const [status, setStatus] = useState<LeadStatus>(initialLead?.status || 'new')
  const [leadOwnerId, setLeadOwnerId] = useState(
    initialLead?.leadOwnerId || memberOptions[0]?.value || '',
  )
  const [businessUnit, setBusinessUnit] = useState<BusinessUnit>(
    initialLead?.businessUnit || 'enterprise',
  )
  const [source, setSource] = useState<LeadSource>(initialLead?.source || 'website')
  const [type, setType] = useState<LeadType>(initialLead?.type || 'inbound')
  const [revenueType, setRevenueType] = useState<RevenueType>(
    initialLead?.revenueType || 'recurring',
  )
  const [revenueCategory] = useState<RevenueCategory>(
    initialLead?.revenueCategory || 'software_license',
  )
  const [revenueFrequency, setRevenueFrequency] = useState<RevenueFrequency>(
    initialLead?.revenueFrequency || 'annually',
  )
  const [annualRevenueTarget, setAnnualRevenueTarget] = useState(
    initialLead?.annualRevenueTarget?.toString() || '2500000',
  )
  const [contractPeriod, setContractPeriod] = useState(
    initialLead?.contractPeriod?.toString() || '1',
  )
  const [isMustWin, setIsMustWin] = useState(initialLead?.isMustWin || false)
  const [nextContactDate, setNextContactDate] = useState(
    initialLead?.nextContactDate ? initialLead.nextContactDate.split('T')[0] : '',
  )
  const [expectedConversionDate, setExpectedConversionDate] = useState(
    initialLead?.expectedConversionDate
      ? initialLead.expectedConversionDate.split('T')[0]
      : '',
  )
  const [scope, setScope] = useState(initialLead?.scope || '')

  // Multiple contacts list initialized from initialLead.contacts or fallback to legacy primary contact
  const [contacts, setContacts] = useState<LeadContactItem[]>(() => {
    if (initialLead?.contacts && initialLead.contacts.length > 0) {
      return initialLead.contacts
    }
    if (initialLead?.contactFirstName && initialLead?.contactEmail) {
      return [
        {
          id: 'initial-cnt-1',
          firstName: initialLead.contactFirstName,
          lastName: initialLead.contactLastName || '',
          salutation: initialLead.salutation,
          designation: initialLead.designation,
          email: initialLead.contactEmail,
          phone: initialLead.contactPhone,
          isPrimary: true,
        },
      ]
    }
    return [
      {
        id: 'initial-new-1',
        firstName: '',
        lastName: '',
        email: '',
        isPrimary: true,
      },
    ]
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!companyName.trim()) {
      setError('Company name is required.')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    const validContacts = contacts.filter((c) => c.firstName.trim() && c.email.trim())
    if (validContacts.length === 0) {
      setError('Please add at least one stakeholder contact with a name and email.')
      return
    }

    const primaryContact = validContacts.find((c) => c.isPrimary) || validContacts[0]!
    primaryContact.isPrimary = true

    setError('')
    setIsSubmitting(true)
    try {
      await onSave({
        companyName: companyName.trim(),
        status,
        leadOwnerId: leadOwnerId || memberOptions[0]?.value || 'usr-default-001',
        businessUnit,
        source,
        type,
        revenueType,
        revenueCategory,
        revenueFrequency,
        annualRevenueTarget: Number(annualRevenueTarget) || 0,
        contractPeriod: Number(contractPeriod) || 1,
        isMustWin,
        nextContactDate: nextContactDate || undefined,
        expectedConversionDate: expectedConversionDate || undefined,
        scope: scope.trim() || undefined,
        contactFirstName: primaryContact.firstName,
        contactLastName: primaryContact.lastName,
        contactEmail: primaryContact.email,
        contactPhone: primaryContact.phone,
        designation: primaryContact.designation,
        contacts: validContacts,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-20">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex size-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer shrink-0"
            aria-label="Back to leads list"
          >
            <ArrowLeft className="size-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight text-slate-900">
                {isEditing ? `Edit Lead: ${initialLead.companyName}` : 'Create New Enterprise Lead'}
              </h2>
              {isMustWin && (
                <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 border border-amber-200 px-2 py-0.5 text-xs font-semibold text-amber-700">
                  <Star className="size-3 fill-amber-500 text-amber-500" />
                  Must Win
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Fill in enterprise lead parameters, sales stage, ₹ deal quota, and multi-contact stakeholders.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            className="cursor-pointer"
          >
            <Save className="size-4 mr-1.5" />
            {isSubmitting ? 'Saving...' : isEditing ? 'Update Lead' : 'Save Lead'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-rose-300 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-800">
          {error}
        </div>
      )}

      {/* Grid of Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 1: Organization & Ownership */}
        <div className="rounded-md border border-slate-200 bg-white p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Building className="size-4 text-brand-600" />
            <h3 className="text-sm font-semibold text-slate-900">
              1. Organization & Assignment
            </h3>
          </div>

          {/* Company Name with Blue Info Note */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Company Name <span className="text-rose-500">*</span>
            </label>
            <Input
              placeholder="e.g. Tata Digital Enterprise Ltd."
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
            <div className="mt-1.5 flex items-start gap-1.5 rounded-md border border-sky-200 bg-sky-50/70 px-2.5 py-1.5 text-[11px] text-sky-800">
              <Building className="size-3.5 shrink-0 text-sky-600 mt-0.5" />
              <span>Enter the legal trade name of the client organization or enterprise buyer.</span>
            </div>
          </div>

          {/* Business Unit with Violet Info Note */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Assigned Business Unit
            </label>
            <Select
              value={businessUnit}
              onChange={(val) => setBusinessUnit(val as BusinessUnit)}
              options={
                buOptions.length > 0
                  ? buOptions
                  : [
                      { value: 'enterprise', label: 'Enterprise Systems' },
                      { value: 'mid_market', label: 'Mid-Market Solutions' },
                      { value: 'digital', label: 'Digital Innovations' },
                      { value: 'government', label: 'Public Sector & Government' },
                      { value: 'smb', label: 'Small & Medium Business' },
                    ]
              }
            />
            <div className="mt-1.5 flex items-start gap-1.5 rounded-md border border-purple-200 bg-purple-50/70 px-2.5 py-1.5 text-[11px] text-purple-800">
              <Layers className="size-3.5 shrink-0 text-purple-600 mt-0.5" />
              <span>Routes client solution delivery, post-sales governance, and executive SLAs.</span>
            </div>
          </div>

          {/* Lead Owner with Indigo Info Note */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Lead Owner
              </label>
              <Select
                value={leadOwnerId}
                onChange={(val) => setLeadOwnerId(val)}
                options={
                  memberOptions.length > 0
                    ? memberOptions
                    : [{ value: 'usr-default-001', label: 'Admin (Workspace Lead)' }]
                }
              />
              <div className="mt-1.5 flex items-start gap-1 rounded-md border border-indigo-200 bg-indigo-50/70 px-2 py-1 text-[11px] text-indigo-800">
                <User className="size-3 shrink-0 text-indigo-600 mt-0.5" />
                <span>Account executive responsible for qualification.</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Pipeline Stage
              </label>
              <Select
                value={status}
                onChange={(val) => setStatus(val as LeadStatus)}
                options={STATUS_OPTIONS}
              />
              <div className="mt-1.5 flex items-start gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] text-slate-700">
                <Sparkles className="size-3 shrink-0 text-slate-500 mt-0.5" />
                <span>Determines forecasting weighting and funnel stage.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Pipeline Revenue & Deal Terms */}
        <div className="rounded-md border border-slate-200 bg-white p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <DollarSign className="size-4 text-emerald-600" />
            <h3 className="text-sm font-semibold text-slate-900">
              2. Indian Rupee (₹) Quotas & Deal Terms
            </h3>
          </div>

          {/* Annual Target INR with Emerald Info Note */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Annual Revenue Target (₹ INR) <span className="text-rose-500">*</span>
            </label>
            <Input
              type="number"
              min="0"
              placeholder="e.g. 5000000"
              value={annualRevenueTarget}
              onChange={(e) => setAnnualRevenueTarget(e.target.value)}
              required
            />
            <div className="mt-1.5 flex items-start gap-1.5 rounded-md border border-emerald-200 bg-emerald-50/70 px-2.5 py-1.5 text-[11px] text-emerald-800">
              <span className="font-bold text-emerald-700">₹</span>
              <span>Projected gross annualized deal value in Indian Rupees for financial quota tracking.</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Revenue Model
              </label>
              <Select
                value={revenueType}
                onChange={(val) => setRevenueType(val as RevenueType)}
                options={REVENUE_TYPE_OPTIONS}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Billing Cycle
              </label>
              <Select
                value={revenueFrequency}
                onChange={(val) => setRevenueFrequency(val as RevenueFrequency)}
                options={FREQUENCY_OPTIONS}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Contract Period (Years)
              </label>
              <Input
                type="number"
                min="0"
                max="10"
                value={contractPeriod}
                onChange={(e) => setContractPeriod(e.target.value)}
              />
            </div>

            {/* Must-Win Deal Switch with Amber Info Note */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Priority Tier
              </label>
              <button
                type="button"
                onClick={() => setIsMustWin(!isMustWin)}
                className={`w-full flex items-center justify-center gap-2 h-10 px-3 rounded-md border text-xs font-semibold transition-colors cursor-pointer ${
                  isMustWin
                    ? 'border-amber-300 bg-amber-50 text-amber-900'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Star
                  className={`size-4 ${
                    isMustWin ? 'fill-amber-500 text-amber-500' : 'text-slate-400'
                  }`}
                />
                <span>{isMustWin ? 'Must-Win Strategic Deal' : 'Standard Pipeline Opportunity'}</span>
              </button>
            </div>
          </div>

          <div className="flex items-start gap-1.5 rounded-md border border-amber-200 bg-amber-50/60 px-2.5 py-1.5 text-[11px] text-amber-800">
            <Star className="size-3.5 shrink-0 text-amber-600 mt-0.5" />
            <span>Marking as Must-Win pins this deal to top executive charts and high-alert alerts.</span>
          </div>
        </div>
      </div>

      {/* Section 3: Stakeholders & Multi-Contacts Table */}
      <div className="rounded-md border border-slate-200 bg-white p-5">
        <LeadContactsTable contacts={contacts} onChange={setContacts} />
      </div>

      {/* Section 4: Lead Attribution, Dates & Scope */}
      <div className="rounded-md border border-slate-200 bg-white p-5 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Calendar className="size-4 text-brand-600" />
          <h3 className="text-sm font-semibold text-slate-900">
            4. Timeline, Acquisition Source & Project Scope
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Lead Source
            </label>
            <Select
              value={source}
              onChange={(val) => setSource(val as LeadSource)}
              options={SOURCE_OPTIONS}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Lead Type
            </label>
            <Select
              value={type}
              onChange={(val) => setType(val as LeadType)}
              options={TYPE_OPTIONS}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Next Outreach Date
            </label>
            <Input
              type="date"
              value={nextContactDate}
              onChange={(e) => setNextContactDate(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Target Close Date
            </label>
            <Input
              type="date"
              value={expectedConversionDate}
              onChange={(e) => setExpectedConversionDate(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            Scope of Engagement & Technical Discovery Notes
          </label>
          <Textarea
            rows={3}
            placeholder="Document key client pain points, architecture stack, expected rollout timeline, or competitor evaluation..."
            value={scope}
            onChange={(e) => setScope(e.target.value)}
          />
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-20 flex items-center justify-between border-t border-slate-200 bg-white/95 px-6 py-3.5 backdrop-blur-md">
        <div className="text-xs text-slate-500">
          Ready to commit lead configuration and contact stakeholders.
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            className="cursor-pointer"
          >
            <Check className="size-4 mr-1.5" />
            {isSubmitting ? 'Saving...' : isEditing ? 'Update Lead' : 'Create Lead'}
          </Button>
        </div>
      </div>
    </form>
  )
}
