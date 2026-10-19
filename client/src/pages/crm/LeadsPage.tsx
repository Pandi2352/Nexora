import { useCallback, useEffect, useMemo, useState } from 'react'
import { Plus, Star, Target } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { EmptyState } from '@/components/common/EmptyState'
import {
  Button,
  Pagination,
  SearchInput,
  Select,
  Spinner,
  toast,
  usePagination,
  type SelectOption,
} from '@/components/ui'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useWorkspaceSlug } from '@/hooks/useWorkspaceSlug'
import { crmService } from '@/services/crm.service'
import { memberService } from '@/services/member.service'
import type { BusinessUnitItem, CreateLeadPayload, Lead, LeadStatus } from '@/types/crm'
import type { WorkspaceMember } from '@/types/member'
import { LeadModal } from '@/components/crm/leads/LeadModal'
import { LeadConvertModal } from '@/components/crm/leads/LeadConvertModal'
import { LeadTable } from '@/components/crm/leads/LeadTable'
import { formatINR } from '@/components/crm/crm-formatters'

const STATUS_FILTER_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'in_discussion', label: 'In Discussion' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'proposal_sent', label: 'Proposal Sent' },
  { value: 'unqualified', label: 'Unqualified' },
]

export default function LeadsPage() {
  useDocumentTitle('Leads')
  const slug = useWorkspaceSlug()

  const [leads, setLeads] = useState<Lead[]>([])
  const [members, setMembers] = useState<WorkspaceMember[]>([])
  const [businessUnits, setBusinessUnits] = useState<BusinessUnitItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [mustWinOnly, setMustWinOnly] = useState(false)

  const [modalOpen, setModalOpen] = useState(false)
  const [editingLead, setEditingLead] = useState<Lead | null>(null)
  const [convertingLead, setConvertingLead] = useState<Lead | null>(null)

  const loadData = useCallback(async () => {
    if (!slug) return
    setIsLoading(true)
    try {
      const [leadsData, membersData, buData] = await Promise.allSettled([
        crmService.listLeads(slug, {
          search: search || undefined,
          status: statusFilter !== 'all' ? (statusFilter as LeadStatus) : undefined,
          isMustWin: mustWinOnly ? true : undefined,
        }),
        memberService.listMembers(slug),
        crmService.listBusinessUnits(slug),
      ])
      if (leadsData.status === 'fulfilled') setLeads(leadsData.value || [])
      if (membersData.status === 'fulfilled') setMembers(membersData.value || [])
      if (buData.status === 'fulfilled') setBusinessUnits(buData.value || [])
    } finally {
      setIsLoading(false)
    }
  }, [slug, search, statusFilter, mustWinOnly])

  useEffect(() => {
    void loadData()
  }, [loadData])

  const memberOptions: SelectOption[] = useMemo(
    () => members.map((m) => ({ value: m.userId, label: m.name || m.email })),
    [members],
  )

  const ownerNameMap = useMemo(
    () => new Map(members.map((m) => [m.userId, m.name || m.email])),
    [members],
  )

  const buOptions: SelectOption[] = useMemo(
    () =>
      businessUnits.map((u) => ({
        value: u.name.toLowerCase().replace(/ /g, '_'),
        label: `${u.name} (${u.code})`,
      })),
    [businessUnits],
  )

  const totalPipelineINR = useMemo(
    () => leads.reduce((sum, l) => sum + (l.annualRevenueTarget || 0), 0),
    [leads],
  )

  const handleSaveLead = async (payload: CreateLeadPayload) => {
    if (!slug) return
    try {
      if (editingLead) {
        await crmService.updateLead(slug, editingLead.id, payload)
        toast.success('Lead updated successfully')
      } else {
        await crmService.createLead(slug, payload)
        toast.success('Lead created successfully')
      }
      await loadData()
    } catch {
      toast.error('Failed to save lead')
    }
  }

  const handleConvertLead = async (leadId: string) => {
    if (!slug) return
    try {
      await crmService.convertLead(slug, leadId)
      toast.success('Lead converted to deal successfully!')
      await loadData()
    } catch {
      toast.error('Failed to convert lead')
    }
  }

  const handleDeleteLead = async (leadId: string) => {
    if (!slug) return
    if (!window.confirm('Are you sure you want to delete this lead?')) return
    try {
      await crmService.deleteLead(slug, leadId)
      toast.success('Lead deleted successfully')
      await loadData()
    } catch {
      toast.error('Failed to delete lead')
    }
  }

  const {
    paginatedItems: paginatedLeads,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    totalItems,
  } = usePagination({ items: leads, initialPageSize: 10 })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leads"
        description="Track qualification, INR ₹ funnel projections, and convert must-win deals."
        actions={
          <Button size="sm" onClick={() => { setEditingLead(null); setModalOpen(true) }}>
            <Plus className="size-4 mr-1.5" />
            Create Lead
          </Button>
        }
      />

      {/* Summary KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-md border border-slate-200 bg-white p-3">
          <p className="text-xs text-slate-500">Total Leads</p>
          <p className="text-xl font-bold text-slate-900 mt-1">{leads.length}</p>
        </div>
        <div className="rounded-md border border-amber-200 bg-amber-50/40 p-3">
          <p className="text-xs text-amber-700 flex items-center gap-1">
            <Star className="size-3 fill-amber-500 text-amber-500" /> Must-Win Deals
          </p>
          <p className="text-xl font-bold text-amber-900 mt-1">
            {leads.filter((l) => l.isMustWin).length}
          </p>
        </div>
        <div className="rounded-md border border-slate-200 bg-white p-3">
          <p className="text-xs text-slate-500">Qualified Leads</p>
          <p className="text-xl font-bold text-emerald-600 mt-1">
            {leads.filter((l) => l.status === 'qualified' || l.status === 'proposal_sent').length}
          </p>
        </div>
        <div className="rounded-md border border-slate-200 bg-white p-3">
          <p className="text-xs text-slate-500">Funnel Target (₹)</p>
          <p className="text-xl font-bold text-slate-900 mt-1">{formatINR(totalPipelineINR)}</p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex-1 max-w-sm">
          <SearchInput
            placeholder="Search leads, companies or contacts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={statusFilter}
            onChange={(val) => setStatusFilter(val)}
            options={STATUS_FILTER_OPTIONS}
            className="w-40"
          />
          <button
            type="button"
            onClick={() => setMustWinOnly((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
              mustWinOnly
                ? 'bg-amber-50 border-amber-300 text-amber-700'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Star className={`size-3.5 ${mustWinOnly ? 'fill-amber-500 text-amber-500' : 'text-slate-400'}`} />
            Must Win Only
          </button>
        </div>
      </div>

      {/* Table / Empty State */}
      {isLoading ? (
        <div className="flex h-48 items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : leads.length === 0 ? (
        <EmptyState
          icon={Target}
          title="No leads found"
          description="Create your first lead to begin tracking client qualification and Indian Rupee revenue targets."
          action={
            <Button size="sm" onClick={() => { setEditingLead(null); setModalOpen(true) }}>
              <Plus className="size-4 mr-1.5" />
              Create Lead
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          <LeadTable
            leads={paginatedLeads}
            ownerNameMap={ownerNameMap}
            onEdit={(lead) => { setEditingLead(lead); setModalOpen(true) }}
            onConvert={(lead) => setConvertingLead(lead)}
            onDelete={handleDeleteLead}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        </div>
      )}

      {/* Modals */}
      <LeadModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveLead}
        initialLead={editingLead}
        memberOptions={memberOptions}
        buOptions={buOptions}
      />

      <LeadConvertModal
        open={!!convertingLead}
        onClose={() => setConvertingLead(null)}
        lead={convertingLead}
        onConvert={handleConvertLead}
      />
    </div>
  )
}
