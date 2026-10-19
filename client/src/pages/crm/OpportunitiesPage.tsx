import { useCallback, useEffect, useMemo, useState } from 'react'
import { Plus, Search, Star, TrendingUp } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { EmptyState } from '@/components/common/EmptyState'
import { Button, Input, Spinner, type SelectOption } from '@/components/ui'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useWorkspaceSlug } from '@/hooks/useWorkspaceSlug'
import { crmService } from '@/services/crm.service'
import type { Company, CreateOpportunityPayload, Opportunity, OpportunityStage } from '@/types/crm'
import { PipelineKanban } from '@/components/crm/opportunities/PipelineKanban'
import { OpportunityModal } from '@/components/crm/opportunities/OpportunityModal'
import { formatINR } from '@/components/crm/crm-formatters'

export default function OpportunitiesPage() {
  useDocumentTitle('Opportunities')
  const slug = useWorkspaceSlug()

  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [mustWinOnly, setMustWinOnly] = useState(false)

  const [modalOpen, setModalOpen] = useState(false)
  const [editingOpp, setEditingOpp] = useState<Opportunity | null>(null)

  const loadData = useCallback(async () => {
    if (!slug) return
    setIsLoading(true)
    try {
      const [oppsData, compsData] = await Promise.allSettled([
        crmService.listOpportunities(slug, {
          isMustWin: mustWinOnly ? true : undefined,
        }),
        crmService.listCompanies(slug),
      ])
      if (oppsData.status === 'fulfilled') setOpportunities(oppsData.value || [])
      if (compsData.status === 'fulfilled') setCompanies(compsData.value || [])
    } finally {
      setIsLoading(false)
    }
  }, [slug, mustWinOnly])

  useEffect(() => {
    void loadData()
  }, [loadData])

  const companyOptions: SelectOption[] = useMemo(
    () => companies.map((c) => ({ value: c.id, label: c.name })),
    [companies],
  )

  const filteredOpportunities = useMemo(() => {
    if (!search.trim()) return opportunities
    const q = search.toLowerCase()
    return opportunities.filter(
      (o) =>
        o.title.toLowerCase().includes(q) ||
        (o.companyName && o.companyName.toLowerCase().includes(q)) ||
        (o.quotationNumber && o.quotationNumber.toLowerCase().includes(q)),
    )
  }, [opportunities, search])

  const totalPipelineINR = useMemo(
    () =>
      filteredOpportunities
        .filter((o) => o.stage !== 'closed_lost')
        .reduce((sum, o) => sum + (o.value || 0), 0),
    [filteredOpportunities],
  )

  const closedWonINR = useMemo(
    () =>
      filteredOpportunities
        .filter((o) => o.stage === 'closed_won')
        .reduce((sum, o) => sum + (o.value || 0), 0),
    [filteredOpportunities],
  )

  const handleSaveOpp = async (payload: CreateOpportunityPayload) => {
    if (!slug) return
    if (editingOpp) {
      await crmService.updateOpportunity(slug, editingOpp.id, payload)
    } else {
      await crmService.createOpportunity(slug, payload)
    }
    await loadData()
  }

  const handleMoveStage = async (oppId: string, nextStage: OpportunityStage) => {
    if (!slug) return
    // Optimistic update
    setOpportunities((prev) =>
      prev.map((o) => (o.id === oppId ? { ...o, stage: nextStage } : o)),
    )
    await crmService.updateOpportunity(slug, oppId, { stage: nextStage })
    await loadData()
  }

  const handleDeleteOpp = async (oppId: string) => {
    if (!slug) return
    if (!window.confirm('Are you sure you want to delete this opportunity?')) return
    await crmService.deleteOpportunity(slug, oppId)
    await loadData()
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Opportunities"
        description="Manage deals, quotation lifecycles, and sales stages through the pipeline."
        actions={
          <Button size="sm" onClick={() => { setEditingOpp(null); setModalOpen(true) }}>
            <Plus className="size-4 mr-1.5" />
            New Deal
          </Button>
        }
      />

      {/* KPI stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-md border border-slate-200 bg-white p-3">
          <p className="text-xs text-slate-500">Pipeline Value (₹)</p>
          <p className="text-xl font-bold text-slate-900 mt-1">{formatINR(totalPipelineINR)}</p>
        </div>
        <div className="rounded-md border border-emerald-200 bg-emerald-50/40 p-3">
          <p className="text-xs text-emerald-700">Closed Won (₹)</p>
          <p className="text-xl font-bold text-emerald-900 mt-1">{formatINR(closedWonINR)}</p>
        </div>
        <div className="rounded-md border border-slate-200 bg-white p-3">
          <p className="text-xs text-slate-500">Active Deals</p>
          <p className="text-xl font-bold text-slate-900 mt-1">
            {filteredOpportunities.filter((o) => o.stage !== 'closed_won' && o.stage !== 'closed_lost').length}
          </p>
        </div>
        <div className="rounded-md border border-amber-200 bg-amber-50/40 p-3">
          <p className="text-xs text-amber-700 flex items-center gap-1">
            <Star className="size-3 fill-amber-500 text-amber-500" /> Must-Win Deals
          </p>
          <p className="text-xl font-bold text-amber-900 mt-1">
            {filteredOpportunities.filter((o) => o.isMustWin).length}
          </p>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
          <Input
            placeholder="Search deals, quotes, or companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
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

      {/* Kanban Board / Empty State */}
      {isLoading ? (
        <div className="flex h-48 items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : filteredOpportunities.length === 0 ? (
        <EmptyState
          icon={TrendingUp}
          title="No deals in pipeline"
          description="Create your first deal or convert a qualified lead to begin tracking stages and quotations."
          action={
            <Button size="sm" onClick={() => { setEditingOpp(null); setModalOpen(true) }}>
              <Plus className="size-4 mr-1.5" />
              New Deal
            </Button>
          }
        />
      ) : (
        <PipelineKanban
          opportunities={filteredOpportunities}
          onEdit={(opp) => { setEditingOpp(opp); setModalOpen(true) }}
          onMoveStage={handleMoveStage}
          onDelete={handleDeleteOpp}
        />
      )}

      <OpportunityModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveOpp}
        initialOpportunity={editingOpp}
        companyOptions={companyOptions}
      />
    </div>
  )
}
