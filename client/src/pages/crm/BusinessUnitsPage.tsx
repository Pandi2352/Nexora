import { useCallback, useEffect, useMemo, useState } from 'react'
import { Layers, Plus } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { EmptyState } from '@/components/common/EmptyState'
import {
  Button,
  ConfirmDialog,
  Pagination,
  Spinner,
  toast,
  usePagination,
} from '@/components/ui'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useWorkspaceSlug } from '@/hooks/useWorkspaceSlug'
import { crmService } from '@/services/crm.service'
import type { BusinessUnitItem, CreateBusinessUnitPayload } from '@/types/crm'
import { BusinessUnitModal } from '@/components/crm/business-units/BusinessUnitModal'
import { BusinessUnitTable } from '@/components/crm/business-units/BusinessUnitTable'
import { BusinessUnitFilterBar } from '@/components/crm/business-units/BusinessUnitFilterBar'
import { BusinessUnitStatsStrip } from '@/components/crm/business-units/BusinessUnitStatsStrip'

export default function BusinessUnitsPage() {
  useDocumentTitle('Business Units')
  const slug = useWorkspaceSlug()

  const [units, setUnits] = useState<BusinessUnitItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingUnit, setEditingUnit] = useState<BusinessUnitItem | null>(null)
  const [unitToDelete, setUnitToDelete] = useState<BusinessUnitItem | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const loadUnits = useCallback(
    async (isBackground = false) => {
      if (!slug) return
      if (!isBackground && units.length === 0) {
        setIsLoading(true)
      } else {
        setIsRefreshing(true)
      }

      try {
        const serverData = await crmService.listBusinessUnits(slug, true)
        let list = Array.isArray(serverData) ? serverData : []
        if (search && search.trim()) {
          const q = search.trim().toLowerCase()
          list = list.filter(
            (u) =>
              u.name.toLowerCase().includes(q) ||
              u.code.toLowerCase().includes(q) ||
              (u.description && u.description.toLowerCase().includes(q)),
          )
        }
        setUnits(list)
      } catch {
        toast.error('Failed to load business units from server')
      } finally {
        setIsLoading(false)
        setIsRefreshing(false)
      }
    },
    [slug, search, units.length],
  )

  useEffect(() => {
    void loadUnits()
  }, [loadUnits])

  const handleSaveUnit = async (payload: CreateBusinessUnitPayload) => {
    if (!slug) return
    try {
      if (editingUnit) {
        const targetId = editingUnit.id || (editingUnit as any)._id
        await crmService.updateBusinessUnit(slug, targetId, payload)
        toast.success('Business unit updated successfully')
      } else {
        await crmService.createBusinessUnit(slug, payload)
        toast.success('Business unit created successfully')
      }
      setModalOpen(false)
      setEditingUnit(null)
      await loadUnits(true)
    } catch {
      toast.error('Failed to save business unit')
    }
  }

  const handleConfirmDelete = async () => {
    if (!unitToDelete || !slug) return
    const targetId = unitToDelete.id || (unitToDelete as any)._id
    if (!targetId) {
      toast.error('Invalid business unit ID')
      return
    }

    setIsDeleting(true)
    try {
      await crmService.deleteBusinessUnit(slug, targetId)
      setUnits((prev) =>
        prev.filter((u) => u.id !== targetId && (u as any)._id !== targetId),
      )
      toast.success(`Deleted ${unitToDelete.name}`)
      setUnitToDelete(null)
      await loadUnits(true)
    } catch {
      toast.error('Failed to delete business unit')
    } finally {
      setIsDeleting(false)
    }
  }

  const statusCounts = useMemo(() => {
    return {
      all: units.length,
      active: units.filter((u) => u.isActive).length,
      inactive: units.filter((u) => !u.isActive).length,
      default: units.filter((u) => u.isDefault).length,
    }
  }, [units])

  const filteredUnits = useMemo(() => {
    return units.filter((u) => {
      if (statusFilter === 'active') return u.isActive
      if (statusFilter === 'inactive') return !u.isActive
      if (statusFilter === 'default') return u.isDefault
      return true
    })
  }, [units, statusFilter])

  const {
    paginatedItems: paginatedUnits,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    totalItems,
  } = usePagination({ items: filteredUnits, initialPageSize: 10 })

  return (
    <div className="space-y-5">
      <PageHeader
        title="Business Units"
        description="Organize operational divisions, service lines, and lead routing categories."
        actions={
          <Button
            variant="primary"
            onClick={() => {
              setEditingUnit(null)
              setModalOpen(true)
            }}
          >
            <Plus className="size-4 mr-1.5" />
            Add Business Unit
          </Button>
        }
      />

      <BusinessUnitStatsStrip units={units} />

      <BusinessUnitFilterBar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        statusCounts={statusCounts}
        onRefresh={() => void loadUnits(true)}
        isRefreshing={isRefreshing}
      />

      {isLoading && units.length === 0 ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-md border border-slate-200 bg-white">
          <Spinner size="lg" label="Loading business units..." />
        </div>
      ) : filteredUnits.length === 0 ? (
        <EmptyState
          icon={Layers}
          title={search ? 'No matching business units found' : 'No business units configured yet'}
          description={
            search
              ? 'Try adjusting your search criteria or clearing filters.'
              : 'Create operating business divisions to route incoming leads and team assignments.'
          }
          action={
            <Button
              variant="primary"
              onClick={() => {
                setEditingUnit(null)
                setModalOpen(true)
              }}
            >
              <Plus className="size-4 mr-1.5" />
              Add Business Unit
            </Button>
          }
        />
      ) : (
        <div className="rounded-md border border-slate-200 bg-white overflow-hidden">
          <BusinessUnitTable
            units={paginatedUnits}
            onEdit={(unit) => {
              setEditingUnit(unit)
              setModalOpen(true)
            }}
            onDelete={(unit) => setUnitToDelete(unit)}
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

      <BusinessUnitModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditingUnit(null)
        }}
        onSave={handleSaveUnit}
        initialUnit={editingUnit}
      />

      <ConfirmDialog
        isOpen={!!unitToDelete}
        onClose={() => {
          if (!isDeleting) setUnitToDelete(null)
        }}
        onConfirm={handleConfirmDelete}
        title="This is a warning"
        description={
          unitToDelete ? (
            <span>
              Are you sure you want to delete{' '}
              <strong className="font-semibold text-slate-900">{unitToDelete.name}</strong>?
              This action cannot be undone.
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
