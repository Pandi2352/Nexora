import { apiClient } from '@/lib/api-client'
import type {
  ActivityType,
  BusinessUnitItem,
  Company,
  CompanyDetail,
  Contact,
  ConvertedLeadResult,
  CreateActivityPayload,
  CreateBusinessUnitPayload,
  CreateCompanyPayload,
  CreateContactPayload,
  CreateLeadPayload,
  CreateOpportunityPayload,
  Lead,
  Opportunity,
  OpportunityStage,
  PipelineSummary,
  SalesActivity,
  UpdateCompanyPayload,
  UpdateContactPayload,
  UpdateLeadPayload,
  UpdateOpportunityPayload,
  UpdateBusinessUnitPayload,
} from '@/types/crm'

interface ApiResponseWrapper<T> {
  data: T
  message?: string
}

export interface LeadFilterParams {
  search?: string
  status?: string
  leadOwnerId?: string
  businessUnit?: string
  isMustWin?: boolean
}

export interface OpportunityFilterParams {
  stage?: string
  companyId?: string
  ownerId?: string
  isMustWin?: boolean
}

export interface ActivityFilterParams {
  type?: ActivityType
  companyId?: string
  leadId?: string
  performedById?: string
}

export const crmService = {
  // --- Companies ---
  async listCompanies(orgSlug: string, search?: string): Promise<Company[]> {
    const params = search ? { search } : undefined
    const res = await apiClient.get<ApiResponseWrapper<Company[]>>(
      `/organizations/${orgSlug}/crm/companies`,
      { params },
    )
    return res.data
  },

  async getCompany(orgSlug: string, id: string): Promise<CompanyDetail> {
    const res = await apiClient.get<ApiResponseWrapper<CompanyDetail>>(
      `/organizations/${orgSlug}/crm/companies/${id}`,
    )
    return res.data
  },

  async createCompany(orgSlug: string, payload: CreateCompanyPayload): Promise<Company> {
    const res = await apiClient.post<ApiResponseWrapper<Company>>(
      `/organizations/${orgSlug}/crm/companies`,
      payload,
    )
    return res.data
  },

  async updateCompany(orgSlug: string, id: string, payload: UpdateCompanyPayload): Promise<Company> {
    const res = await apiClient.patch<ApiResponseWrapper<Company>>(
      `/organizations/${orgSlug}/crm/companies/${id}`,
      payload,
    )
    return res.data
  },

  async deleteCompany(orgSlug: string, id: string): Promise<void> {
    await apiClient.delete(`/organizations/${orgSlug}/crm/companies/${id}`)
  },

  // --- Contacts ---
  async listContacts(orgSlug: string, search?: string, companyId?: string): Promise<Contact[]> {
    const params: Record<string, string> = {}
    if (search) params.search = search
    if (companyId) params.companyId = companyId
    const res = await apiClient.get<ApiResponseWrapper<Contact[]>>(
      `/organizations/${orgSlug}/crm/contacts`,
      { params },
    )
    return res.data
  },

  async getContact(orgSlug: string, id: string): Promise<Contact> {
    const res = await apiClient.get<ApiResponseWrapper<Contact>>(
      `/organizations/${orgSlug}/crm/contacts/${id}`,
    )
    return res.data
  },

  async createContact(orgSlug: string, payload: CreateContactPayload): Promise<Contact> {
    const res = await apiClient.post<ApiResponseWrapper<Contact>>(
      `/organizations/${orgSlug}/crm/contacts`,
      payload,
    )
    return res.data
  },

  async updateContact(orgSlug: string, id: string, payload: UpdateContactPayload): Promise<Contact> {
    const res = await apiClient.patch<ApiResponseWrapper<Contact>>(
      `/organizations/${orgSlug}/crm/contacts/${id}`,
      payload,
    )
    return res.data
  },

  async deleteContact(orgSlug: string, id: string): Promise<void> {
    await apiClient.delete(`/organizations/${orgSlug}/crm/contacts/${id}`)
  },

  // --- Leads ---
  async listLeads(orgSlug: string, options: LeadFilterParams = {}): Promise<Lead[]> {
    const res = await apiClient.get<ApiResponseWrapper<Lead[]>>(
      `/organizations/${orgSlug}/crm/leads`,
      { params: options },
    )
    return res.data
  },

  async getLead(orgSlug: string, id: string): Promise<Lead> {
    const res = await apiClient.get<ApiResponseWrapper<Lead>>(
      `/organizations/${orgSlug}/crm/leads/${id}`,
    )
    return res.data
  },

  async createLead(orgSlug: string, payload: CreateLeadPayload): Promise<Lead> {
    const res = await apiClient.post<ApiResponseWrapper<Lead>>(
      `/organizations/${orgSlug}/crm/leads`,
      payload,
    )
    return res.data
  },

  async updateLead(orgSlug: string, id: string, payload: UpdateLeadPayload): Promise<Lead> {
    const res = await apiClient.patch<ApiResponseWrapper<Lead>>(
      `/organizations/${orgSlug}/crm/leads/${id}`,
      payload,
    )
    return res.data
  },

  async convertLead(orgSlug: string, id: string): Promise<ConvertedLeadResult> {
    const res = await apiClient.post<ApiResponseWrapper<ConvertedLeadResult>>(
      `/organizations/${orgSlug}/crm/leads/${id}/convert`,
    )
    return res.data
  },

  async deleteLead(orgSlug: string, id: string): Promise<void> {
    await apiClient.delete(`/organizations/${orgSlug}/crm/leads/${id}`)
  },

  // --- Sales Activities ---
  async listActivities(orgSlug: string, options: ActivityFilterParams = {}): Promise<SalesActivity[]> {
    const res = await apiClient.get<ApiResponseWrapper<SalesActivity[]>>(
      `/organizations/${orgSlug}/crm/activities`,
      { params: options },
    )
    return res.data
  },

  async logActivity(orgSlug: string, payload: CreateActivityPayload): Promise<SalesActivity> {
    const res = await apiClient.post<ApiResponseWrapper<SalesActivity>>(
      `/organizations/${orgSlug}/crm/activities`,
      payload,
    )
    return res.data
  },

  async updateActivity(
    orgSlug: string,
    id: string,
    payload: Partial<CreateActivityPayload>,
  ): Promise<SalesActivity> {
    const res = await apiClient.patch<ApiResponseWrapper<SalesActivity>>(
      `/organizations/${orgSlug}/crm/activities/${id}`,
      payload,
    )
    return res.data
  },

  async deleteActivity(orgSlug: string, id: string): Promise<void> {
    await apiClient.delete(`/organizations/${orgSlug}/crm/activities/${id}`)
  },

  // --- Opportunities & Quotations ---
  async listOpportunities(orgSlug: string, options: OpportunityFilterParams = {}): Promise<Opportunity[]> {
    const res = await apiClient.get<ApiResponseWrapper<Opportunity[]>>(
      `/organizations/${orgSlug}/crm/opportunities`,
      { params: options },
    )
    return res.data
  },

  async getPipelineSummary(orgSlug: string): Promise<PipelineSummary[]> {
    const res = await apiClient.get<ApiResponseWrapper<PipelineSummary[]>>(
      `/organizations/${orgSlug}/crm/opportunities/summary`,
    )
    return res.data
  },

  async getOpportunity(orgSlug: string, id: string): Promise<Opportunity> {
    const res = await apiClient.get<ApiResponseWrapper<Opportunity>>(
      `/organizations/${orgSlug}/crm/opportunities/${id}`,
    )
    return res.data
  },

  async createOpportunity(orgSlug: string, payload: CreateOpportunityPayload): Promise<Opportunity> {
    const res = await apiClient.post<ApiResponseWrapper<Opportunity>>(
      `/organizations/${orgSlug}/crm/opportunities`,
      payload,
    )
    return res.data
  },

  async updateOpportunity(
    orgSlug: string,
    id: string,
    payload: UpdateOpportunityPayload,
  ): Promise<Opportunity> {
    const res = await apiClient.patch<ApiResponseWrapper<Opportunity>>(
      `/organizations/${orgSlug}/crm/opportunities/${id}`,
      payload,
    )
    return res.data
  },

  async updateOpportunityStage(
    orgSlug: string,
    id: string,
    stage: OpportunityStage,
  ): Promise<Opportunity> {
    const res = await apiClient.patch<ApiResponseWrapper<Opportunity>>(
      `/organizations/${orgSlug}/crm/opportunities/${id}/stage`,
      { stage },
    )
    return res.data
  },

  async deleteOpportunity(orgSlug: string, id: string): Promise<void> {
    await apiClient.delete(`/organizations/${orgSlug}/crm/opportunities/${id}`)
  },

  // --- Business Units ---
  async listBusinessUnits(orgSlug: string, includeInactive = false): Promise<BusinessUnitItem[]> {
    const res = await apiClient.get<ApiResponseWrapper<BusinessUnitItem[]>>(
      `/organizations/${orgSlug}/crm/business-units`,
      { params: includeInactive ? { includeInactive: true } : undefined },
    )
    return res.data
  },

  async createBusinessUnit(
    orgSlug: string,
    payload: CreateBusinessUnitPayload,
  ): Promise<BusinessUnitItem> {
    const res = await apiClient.post<ApiResponseWrapper<BusinessUnitItem>>(
      `/organizations/${orgSlug}/crm/business-units`,
      payload,
    )
    return res.data
  },

  async updateBusinessUnit(
    orgSlug: string,
    id: string,
    payload: UpdateBusinessUnitPayload,
  ): Promise<BusinessUnitItem> {
    const res = await apiClient.patch<ApiResponseWrapper<BusinessUnitItem>>(
      `/organizations/${orgSlug}/crm/business-units/${id}`,
      payload,
    )
    return res.data
  },

  async deleteBusinessUnit(orgSlug: string, id: string): Promise<void> {
    await apiClient.delete(`/organizations/${orgSlug}/crm/business-units/${id}`)
  },
}
