export type CompanyStatus = 'prospect' | 'customer' | 'partner' | 'inactive'

export interface CompanyAddress {
  street?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
}

export interface Company {
  id: string
  organizationId: string
  name: string
  industry?: string
  website?: string
  phone?: string
  email?: string
  address?: CompanyAddress
  annualRevenue?: number
  employeeCount?: string
  status: CompanyStatus
  ownerId?: string
  createdAt: string
  updatedAt: string
}

export interface CompanyDetail extends Company {
  contacts?: Contact[]
  opportunities?: Opportunity[]
}

export interface CreateCompanyPayload {
  name: string
  industry?: string
  website?: string
  phone?: string
  email?: string
  address?: CompanyAddress
  annualRevenue?: number
  employeeCount?: string
  status?: CompanyStatus
  ownerId?: string
}

export type UpdateCompanyPayload = Partial<CreateCompanyPayload>

export type Salutation = 'Mr.' | 'Ms.' | 'Mrs.' | 'Dr.' | 'Prof.' | 'Other'
export type Gender = 'male' | 'female' | 'non_binary' | 'prefer_not_to_say'

export interface Contact {
  id: string
  organizationId: string
  companyId?: string
  firstName: string
  lastName: string
  salutation?: Salutation
  gender?: Gender
  designation?: string
  email: string
  phone?: string
  dateOfBirth?: string
  description?: string
  linkedInUrl?: string
  twitterHandle?: string
  isPrimary: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateContactPayload {
  companyId?: string
  firstName: string
  lastName: string
  salutation?: Salutation
  gender?: Gender
  designation?: string
  email: string
  phone?: string
  dateOfBirth?: string
  description?: string
  linkedInUrl?: string
  twitterHandle?: string
  isPrimary?: boolean
}

export type UpdateContactPayload = Partial<CreateContactPayload>

export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'in_discussion'
  | 'qualified'
  | 'proposal_sent'
  | 'unqualified'

export type LeadSource =
  | 'website'
  | 'referral'
  | 'cold_call'
  | 'linkedin'
  | 'event'
  | 'partner'
  | 'other'

export type LeadType = 'inbound' | 'outbound' | 'partner' | 'expansion'

export type BusinessUnit =
  | 'enterprise'
  | 'mid_market'
  | 'smb'
  | 'government'
  | 'digital'

export type RevenueType =
  | 'recurring'
  | 'one_time'
  | 'fixed_bid'
  | 'time_and_materials'

export type RevenueCategory =
  | 'software_license'
  | 'implementation'
  | 'managed_services'
  | 'consulting'

export type RevenueFrequency = 'monthly' | 'quarterly' | 'annually' | 'milestone'

export interface LeadContactItem {
  id: string
  firstName: string
  lastName: string
  salutation?: Salutation
  gender?: Gender
  designation?: string
  email: string
  phone?: string
  dateOfBirth?: string
  contactDescription?: string
  linkedInUrl?: string
  twitterHandle?: string
  isPrimary?: boolean
}

export interface Lead {
  id: string
  organizationId: string
  companyName: string
  companyId?: string
  status: LeadStatus
  leadOwnerId: string
  source: LeadSource
  type: LeadType
  meetingDate?: string
  nextContactDate?: string
  expectedConversionDate?: string
  businessUnit: BusinessUnit
  revenueType: RevenueType
  revenueCategory: RevenueCategory
  revenueFrequency: RevenueFrequency
  billingStartMonth?: string
  annualRevenueTarget: number
  contractPeriod: number
  isMustWin: boolean
  scope?: string
  contactFirstName: string
  contactLastName: string
  salutation?: Salutation
  gender?: Gender
  designation?: string
  contactEmail: string
  contactPhone?: string
  dateOfBirth?: string
  contactDescription?: string
  linkedInUrl?: string
  twitterHandle?: string
  contacts?: LeadContactItem[]
  createdAt: string
  updatedAt: string
}

export interface CreateLeadPayload {
  companyName: string
  companyId?: string
  status?: LeadStatus
  leadOwnerId: string
  source?: LeadSource
  type?: LeadType
  meetingDate?: string
  nextContactDate?: string
  expectedConversionDate?: string
  businessUnit?: BusinessUnit
  revenueType?: RevenueType
  revenueCategory?: RevenueCategory
  revenueFrequency?: RevenueFrequency
  billingStartMonth?: string
  annualRevenueTarget?: number
  contractPeriod?: number
  isMustWin?: boolean
  scope?: string
  contactFirstName?: string
  contactLastName?: string
  salutation?: Salutation
  gender?: Gender
  designation?: string
  contactEmail?: string
  contactPhone?: string
  dateOfBirth?: string
  contactDescription?: string
  linkedInUrl?: string
  twitterHandle?: string
  contacts?: LeadContactItem[]
}

export type UpdateLeadPayload = Partial<CreateLeadPayload>

export interface ConvertedLeadResult {
  company: Company
  contact: Contact
  opportunity: Opportunity
}

export type ActivityType =
  | 'cold_call'
  | 'meeting'
  | 'proposal_submitted'
  | 'follow_up'
  | 'email'
  | 'note'

export type ActivityOutcome = 'positive' | 'neutral' | 'negative' | 'followup_needed'

export interface SalesActivity {
  id: string
  organizationId: string
  type: ActivityType
  title: string
  description?: string
  companyId?: string
  leadId?: string
  contactId?: string
  performedById: string
  scheduledAt?: string
  completedAt?: string
  status: 'scheduled' | 'completed' | 'cancelled'
  outcome?: ActivityOutcome
  proposalValue?: number
  createdAt: string
  updatedAt: string
}

export interface CreateActivityPayload {
  type: ActivityType
  title: string
  description?: string
  companyId?: string
  leadId?: string
  contactId?: string
  scheduledAt?: string
  completedAt?: string
  status?: 'scheduled' | 'completed' | 'cancelled'
  outcome?: ActivityOutcome
  proposalValue?: number
}

export type OpportunityStage =
  | 'qualification'
  | 'needs_analysis'
  | 'proposal_quote'
  | 'negotiation'
  | 'closed_won'
  | 'closed_lost'

export type QuotationStatus = 'draft' | 'sent' | 'accepted' | 'declined'

export interface Opportunity {
  id: string
  organizationId: string
  title: string
  companyId?: string
  companyName?: string
  leadId?: string
  stage: OpportunityStage
  value: number
  probability: number
  expectedCloseDate?: string
  ownerId: string
  isMustWin: boolean
  quotationNumber?: string
  quotationStatus?: QuotationStatus
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface CreateOpportunityPayload {
  title: string
  companyId?: string
  companyName?: string
  leadId?: string
  stage?: OpportunityStage
  value: number
  probability?: number
  expectedCloseDate?: string
  ownerId?: string
  isMustWin?: boolean
  quotationNumber?: string
  quotationStatus?: QuotationStatus
  notes?: string
}

export type UpdateOpportunityPayload = Partial<CreateOpportunityPayload>

export interface PipelineSummary {
  stage: string
  count: number
  totalValue: number
}

export interface BusinessUnitItem {
  id: string
  organizationId: string
  name: string
  code: string
  description?: string
  isActive: boolean
  isDefault: boolean
  createdById: string
  createdAt: string
  updatedAt: string
}

export interface CreateBusinessUnitPayload {
  name: string
  code: string
  description?: string
  isActive?: boolean
  isDefault?: boolean
}

export type UpdateBusinessUnitPayload = Partial<CreateBusinessUnitPayload>

