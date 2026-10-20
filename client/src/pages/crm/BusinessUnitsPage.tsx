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
import { MOCK_BUSINESS_UNITS } from '@/data/mock-business-units'
import { BusinessUnitModal } from '@/components/crm/business-units/BusinessUnitModal'
import { BusinessUnitTable } from '@/components/crm/business-units/BusinessUnitTable'
import { BusinessUnitFilterBar } from '@/components/crm/business-units/BusinessUnitFilterBar'
import { BusinessUnitStatsStrip } from '@/components/crm/business-units/BusinessUnitStatsStrip'

const getDeletedBusinessUnitIds = (slug: string): Set<string> => {
  try {
    const raw = localStorage.getItem(`nexora_crm_deleted_bus_${slug}`)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return new Set(parsed)
    }
  } catch {
    // Ignore storage parse error
  }
  return new Set()
}

const addDeletedBusinessUnitId = (slug: string, id: string) => {
  try {
    const set = getDeletedBusinessUnitIds(slug)
    set.add(id)
    localStorage.setItem(
      `nexora_crm_deleted_bus_${slug}`,
      JSON.stringify(Array.from(set)),
    )
  } catch {
    // Ignore storage write error
  }
}

const getStoredBusinessUnits = (slug: string): BusinessUnitItem[] => {
  const deleted = getDeletedBusinessUnitIds(slug)
  try {
    const raw = localStorage.getItem(`nexora_crm_bus_${slug}`)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        return parsed.filter(
          (u) => !deleted.has(u.id) && !deleted.has((u as any)._id),
        )
      }
    }
  } catch {
    // Ignore storage parse error
  }
  return MOCK_BUSINESS_UNITS.filter(
    (u) => !deleted.has(u.id) && !deleted.has((u as any)._id),
  )
}

const saveStoredBusinessUnits = (slug: string, list: BusinessUnitItem[]) => {
  try {
    localStorage.setItem(`nexora_crm_bus_${slug}`, JSON.stringify(list))
  } catch {
    // Ignore storage write error
  }
}

export default function BusinessUnitsPage() {
  useDocumentTitle('Business Units')
  const slug = useWorkspaceSlug()

  const [units, setUnits] = useState<BusinessUnitItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingUnit, setEditingUnit] = useState<BusinessUnitItem | null>(null)
  const [unitToDelete, setUnitToDelete] = useState<BusinessUnitItem | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const loadUnits = useCallback(async () => {
    if (!slug) return
    setIsLoading(true)
    const deletedIds = getDeletedBusinessUnitIds(slug)
    let current = getStoredBusinessUnits(slug)

    try {
      const serverData = await crmService.listBusinessUnits(slug, true)
      if (serverData && Array.isArray(serverData)) {
        const filteredServer = serverData.filter(
          (u) => !deletedIds.has(u.id) && !deletedIds.has((u as any)._id),
        )
        const serverIds = new Set(
          filteredServer.map((u) => u.id || (u as any)._id),
        )
        const remaining = current.filter(
          (u) =>
            !serverIds.has(u.id) &&
            !serverIds.has((u as any)._id) &&
            !deletedIds.has(u.id) &&
            !deletedIds.has((u as any)._id),
        )
        current = [...filteredServer, ...remaining]
        saveStoredBusinessUnits(slug, current)
      }
    } catch {
      // Retain local store
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase()
      setUnits(
        current.filter(
          (u) =>
            u.name.toLowerCase().includes(q) ||
            u.code.toLowerCase().includes(q) ||
            (u.description && u.description.toLowerCase().includes(q)),
        ),
      )
    } else {
      setUnits(current)
    }
    setIsLoading(false)
  }, [slug, search])

  useEffect(() => {
    void loadUnits()
  }, [loadUnits])

  const handleSaveUnit = async (payload: CreateBusinessUnitPayload) => {
    if (!slug) return
    try {
      if (editingUnit) {
        const targetId = editingUnit.id || (editingUnit as any)._id
        const updated = await crmService.updateBusinessUnit(slug, targetId, payload)
        const stored = getStoredBusinessUnits(slug).map((u) =>
          u.id === targetId || (u as any)._id === targetId ? { ...u, ...updated } : u,
        )
        saveStoredBusinessUnits(slug, stored)
        setUnits((prev) =>
          prev.map((u) =>
            u.id === targetId || (u as any)._id === targetId ? { ...u, ...updated } : u,
          ),
        )
        toast.success('Business unit updated successfully')
      } else {
        const created = await crmService.createBusinessUnit(slug, payload)
        const stored = [created, ...getStoredBusinessUnits(slug)]
        saveStoredBusinessUnits(slug, stored)
        setUnits((prev) => [created, ...prev])
        toast.success('Business unit created successfully')
      }
      await loadUnits()
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
      try {
        await crmService.deleteBusinessUnit(slug, targetId)
      } catch (err) {
        console.warn('Backend delete notification (local mock or removed):', err)
      }

      addDeletedBusinessUnitId(slug, targetId)
      const stored = getStoredBusinessUnits(slug).filter(
        (u) => u.id !== targetId && (u as any)._id !== targetId,
      )
      saveStoredBusinessUnits(slug, stored)
      setUnits((prev) =>
        prev.filter((u) => u.id !== targetId && (u as any)._id !== targetId),
      )

      toast.success(`Deleted ${unitToDelete.name}`)
      setUnitToDelete(null)
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
        description="Master directory of operating divisions used for lead funnel assignment and sales routing."
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
        onRefresh={() => void loadUnits()}
        isRefreshing={isLoading}
      />

      {isLoading ? (
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
