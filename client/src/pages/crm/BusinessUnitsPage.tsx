import { useCallback, useEffect, useMemo, useState } from 'react'
import { Layers, Plus } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { EmptyState } from '@/components/common/EmptyState'
import { Button, SearchInput, Spinner, toast } from '@/components/ui'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useWorkspaceSlug } from '@/hooks/useWorkspaceSlug'
import { crmService } from '@/services/crm.service'
import type { BusinessUnitItem, CreateBusinessUnitPayload } from '@/types/crm'
import { BusinessUnitModal } from '@/components/crm/business-units/BusinessUnitModal'
import { BusinessUnitTable } from '@/components/crm/business-units/BusinessUnitTable'

export default function BusinessUnitsPage() {
  useDocumentTitle('Business Units')
  const slug = useWorkspaceSlug()

  const [units, setUnits] = useState<BusinessUnitItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingUnit, setEditingUnit] = useState<BusinessUnitItem | null>(null)

  const loadUnits = useCallback(async () => {
    if (!slug) return
    setIsLoading(true)
    try {
      const data = await crmService.listBusinessUnits(slug, true)
      setUnits(data || [])
    } catch {
      setUnits([])
    } finally {
      setIsLoading(false)
    }
  }, [slug])

  useEffect(() => {
    void loadUnits()
  }, [loadUnits])

  const filteredUnits = useMemo(() => {
    if (!search.trim()) return units
    const q = search.toLowerCase()
    return units.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.code.toLowerCase().includes(q) ||
        (u.description && u.description.toLowerCase().includes(q)),
    )
  }, [units, search])

  const handleSaveUnit = async (payload: CreateBusinessUnitPayload) => {
    if (!slug) return
    try {
      if (editingUnit) {
        await crmService.updateBusinessUnit(slug, editingUnit.id, payload)
        toast.success('Business unit updated successfully')
      } else {
        await crmService.createBusinessUnit(slug, payload)
        toast.success('Business unit created successfully')
      }
      await loadUnits()
    } catch {
      toast.error('Failed to save business unit')
    }
  }

  const handleDeleteUnit = async (unitId: string) => {
    if (!slug) return
    if (!window.confirm('Are you sure you want to delete this business unit?')) return
    try {
      await crmService.deleteBusinessUnit(slug, unitId)
      toast.success('Business unit deleted successfully')
      await loadUnits()
    } catch {
      toast.error('Failed to delete business unit')
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Business Units"
        description="Master directory of operating divisions used for lead funnel assignment."
        actions={
          <Button size="sm" onClick={() => { setEditingUnit(null); setModalOpen(true) }}>
            <Plus className="size-4 mr-1.5" />
            Add Business Unit
          </Button>
        }
      />

      {/* KPI counters */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-md border border-slate-200 bg-white p-3">
          <p className="text-xs text-slate-500">Total Units</p>
          <p className="text-xl font-bold text-slate-900 mt-1">{units.length}</p>
        </div>
        <div className="rounded-md border border-emerald-200 bg-emerald-50/40 p-3">
          <p className="text-xs text-emerald-700">Active Units</p>
          <p className="text-xl font-bold text-emerald-900 mt-1">
            {units.filter((u) => u.isActive).length}
          </p>
        </div>
        <div className="rounded-md border border-slate-200 bg-white p-3">
          <p className="text-xs text-slate-500">Inactive Units</p>
          <p className="text-xl font-bold text-slate-600 mt-1">
            {units.filter((u) => !u.isActive).length}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-sm">
          <SearchInput
            placeholder="Search business units or codes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex h-48 items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : filteredUnits.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No business units found"
          description="Create your business units to configure divisions for lead tracking."
          action={
            <Button size="sm" onClick={() => { setEditingUnit(null); setModalOpen(true) }}>
              <Plus className="size-4 mr-1.5" />
              Add Business Unit
            </Button>
          }
        />
      ) : (
        <BusinessUnitTable
          units={filteredUnits}
          onEdit={(unit) => { setEditingUnit(unit); setModalOpen(true) }}
          onDelete={handleDeleteUnit}
        />
      )}

      <BusinessUnitModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveUnit}
        initialUnit={editingUnit}
      />
    </div>
  )
}
