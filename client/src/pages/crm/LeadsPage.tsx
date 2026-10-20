import { useCallback, useEffect, useMemo, useState } from 'react'
import { Plus, Target } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { EmptyState } from '@/components/common/EmptyState'
import {
  Button,
  ConfirmDialog,
  Pagination,
  Spinner,
  toast,
  usePagination,
  type SelectOption,
} from '@/components/ui'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useWorkspaceSlug } from '@/hooks/useWorkspaceSlug'
import { crmService } from '@/services/crm.service'
import { memberService } from '@/services/member.service'
import type { BusinessUnitItem, CreateLeadPayload, Lead } from '@/types/crm'
import type { WorkspaceMember } from '@/types/member'
import { LeadConvertModal } from '@/components/crm/leads/LeadConvertModal'
import { LeadTable } from '@/components/crm/leads/LeadTable'
import { LeadStatsStrip } from '@/components/crm/leads/LeadStatsStrip'
import { LeadFilterBar, type LeadStatusCounts } from '@/components/crm/leads/LeadFilterBar'
import { LeadFormPage } from '@/components/crm/leads/LeadFormPage'

export default function LeadsPage() {
  useDocumentTitle('Leads')
  const slug = useWorkspaceSlug()

  const [viewMode, setViewMode] = useState<'list' | 'form'>('list')
  const [leads, setLeads] = useState<Lead[]>([])
  const [members, setMembers] = useState<WorkspaceMember[]>([])
  const [businessUnits, setBusinessUnits] = useState<BusinessUnitItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [mustWinOnly, setMustWinOnly] = useState(false)

  const [editingLead, setEditingLead] = useState<Lead | null>(null)
  const [convertingLead, setConvertingLead] = useState<Lead | null>(null)
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const loadData = useCallback(
    async (isBackground = false) => {
      if (!slug) return
      if (!isBackground && leads.length === 0) {
        setIsLoading(true)
      } else {
        setIsRefreshing(true)
      }

      try {
        const [leadsData, membersData, buData] = await Promise.allSettled([
          crmService.listLeads(slug, {
            search: search || undefined,
          }),
          memberService.listMembers(slug),
          crmService.listBusinessUnits(slug, true),
        ])

        if (leadsData.status === 'fulfilled' && Array.isArray(leadsData.value)) {
          setLeads(leadsData.value)
        }
        if (membersData.status === 'fulfilled') setMembers(membersData.value || [])
        if (buData.status === 'fulfilled') setBusinessUnits(buData.value || [])
      } catch {
        toast.error('Failed to load leads from server')
      } finally {
        setIsLoading(false)
        setIsRefreshing(false)
      }
    },
    [slug, search, leads.length],
  )

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

  const statusCounts: LeadStatusCounts = useMemo(() => {
    return {
      all: leads.length,
      new: leads.filter((l) => l.status === 'new').length,
      contacted: leads.filter((l) => l.status === 'contacted').length,
      in_discussion: leads.filter((l) => l.status === 'in_discussion').length,
      qualified: leads.filter((l) => l.status === 'qualified').length,
      proposal_sent: leads.filter((l) => l.status === 'proposal_sent').length,
      unqualified: leads.filter((l) => l.status === 'unqualified').length,
    }
  }, [leads])

  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      const matchStatus = statusFilter === 'all' || l.status === statusFilter
      const matchMustWin = !mustWinOnly || l.isMustWin
      return matchStatus && matchMustWin
    })
  }, [leads, statusFilter, mustWinOnly])

  const handleSaveLead = async (payload: CreateLeadPayload) => {
    if (!slug) return
    try {
      if (editingLead) {
        const targetId = editingLead.id || (editingLead as any)._id
        await crmService.updateLead(slug, targetId, payload)
        toast.success('Lead updated successfully')
      } else {
        await crmService.createLead(slug, payload)
        toast.success('Lead created successfully')
      }
      setViewMode('list')
      setEditingLead(null)
      await loadData(true)
    } catch {
      toast.error('Failed to save lead')
    }
  }

  const handleConfirmDelete = async () => {
    if (!leadToDelete || !slug) return
    const targetId = leadToDelete.id || (leadToDelete as any)._id
    if (!targetId) {
      toast.error('Invalid lead ID')
      return
    }

    setIsDeleting(true)
    try {
      await crmService.deleteLead(slug, targetId)
      setLeads((prev) =>
        prev.filter((l) => l.id !== targetId && (l as any)._id !== targetId),
      )
      toast.success('Lead removed successfully')
      setLeadToDelete(null)
      await loadData(true)
    } catch {
      toast.error('Failed to delete lead')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleConvertLead = async (leadId: string) => {
    if (!slug) return
    try {
      await crmService.convertLead(slug, leadId)
      toast.success('Lead converted to deal successfully!')
      await loadData(true)
    } catch {
      toast.error('Failed to convert lead')
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
  } = usePagination({ items: filteredLeads, initialPageSize: 10 })

  // Render on-page LeadFormPage (no popup modal)
  if (viewMode === 'form') {
    return (
      <LeadFormPage
        initialLead={editingLead}
        memberOptions={memberOptions}
        buOptions={buOptions}
        onSave={handleSaveLead}
        onCancel={() => {
          setViewMode('list')
          setEditingLead(null)
        }}
      />
    )
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Leads"
        description="Track enterprise client qualification, INR ₹ revenue targets, and multi-stakeholder contacts."
        actions={
          <Button
            variant="primary"
            onClick={() => {
              setEditingLead(null)
              setViewMode('form')
            }}
            className="cursor-pointer"
          >
            <Plus className="size-4 mr-1.5" />
            Create Lead
          </Button>
        }
      />

      <LeadStatsStrip leads={leads} />

      <LeadFilterBar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        mustWinOnly={mustWinOnly}
        onMustWinChange={setMustWinOnly}
        statusCounts={statusCounts}
        onRefresh={() => void loadData(true)}
        isRefreshing={isRefreshing}
      />

      {isLoading && leads.length === 0 ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-md border border-slate-200 bg-white">
          <Spinner size="lg" label="Loading enterprise leads..." />
        </div>
      ) : filteredLeads.length === 0 ? (
        <EmptyState
          icon={Target}
          title={search ? 'No matching leads found' : 'No enterprise leads created yet'}
          description={
            search
              ? 'Try modifying your search query or reset status filters.'
              : 'Add your first enterprise lead to track deal stages and stakeholder buyer committees.'
          }
          action={
            <Button
              variant="primary"
              onClick={() => {
                setEditingLead(null)
                setViewMode('form')
              }}
              className="cursor-pointer"
            >
              <Plus className="size-4 mr-1.5" />
              Create Lead
            </Button>
          }
        />
      ) : (
        <div className="rounded-md border border-slate-200 bg-white overflow-hidden">
          <LeadTable
            leads={paginatedLeads}
            ownerNameMap={ownerNameMap}
            onEdit={(lead) => {
              setEditingLead(lead)
              setViewMode('form')
            }}
            onConvert={(lead) => setConvertingLead(lead)}
            onDelete={(lead) => setLeadToDelete(lead)}
          />
          <div className="border-t border-slate-200 bg-slate-50/50 px-4 py-3">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
            />
          </div>
        </div>
      )}

      {/* Convert to Deal Modal */}
      <LeadConvertModal
        open={!!convertingLead}
        onClose={() => setConvertingLead(null)}
        lead={convertingLead}
        onConvert={handleConvertLead}
      />

      {/* Custom Amber Warning ConfirmDialog */}
      <ConfirmDialog
        isOpen={!!leadToDelete}
        onClose={() => {
          if (!isDeleting) setLeadToDelete(null)
        }}
        onConfirm={handleConfirmDelete}
        title="This is a warning"
        description={
          leadToDelete ? (
            <span>
              Are you sure you want to delete{' '}
              <strong className="font-semibold text-slate-900">
                {leadToDelete.companyName}
              </strong>
              ? This action cannot be undone.
            </span>
          ) : (
            'Are you sure you want to proceed?'
          )
        }
        confirmLabel="Confirm"
        cancelLabel="Cancel"
        variant="warning"
        confirmColor="green"
        cancelColor="red"
        isLoading={isDeleting}
      />
    </div>
  )
}
