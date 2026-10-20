import { useCallback, useEffect, useMemo, useState } from 'react'
import { Building2, Plus } from 'lucide-react'
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
import type { Company, CreateCompanyPayload } from '@/types/crm'
import { MOCK_COMPANIES } from '@/data/mock-companies'
import { CompanyModal } from '@/components/crm/companies/CompanyModal'
import { CompanyTable } from '@/components/crm/companies/CompanyTable'
import { CompanyFilterBar } from '@/components/crm/companies/CompanyFilterBar'
import { CompanyStatsStrip } from '@/components/crm/companies/CompanyStatsStrip'

const getDeletedCompanyIds = (slug: string): Set<string> => {
  try {
    const raw = localStorage.getItem(`nexora_crm_deleted_companies_${slug}`)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return new Set(parsed)
    }
  } catch {
    // Ignore storage parse error
  }
  return new Set()
}

const addDeletedCompanyId = (slug: string, id: string) => {
  try {
    const set = getDeletedCompanyIds(slug)
    set.add(id)
    localStorage.setItem(
      `nexora_crm_deleted_companies_${slug}`,
      JSON.stringify(Array.from(set)),
    )
  } catch {
    // Ignore storage write error
  }
}

const getStoredCompanies = (slug: string): Company[] => {
  const deleted = getDeletedCompanyIds(slug)
  try {
    const raw = localStorage.getItem(`nexora_crm_companies_${slug}`)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        return parsed.filter(
          (c) => !deleted.has(c.id) && !deleted.has((c as any)._id),
        )
      }
    }
  } catch {
    // Ignore storage parse error
  }
  return MOCK_COMPANIES.filter(
    (c) => !deleted.has(c.id) && !deleted.has((c as any)._id),
  )
}

const saveStoredCompanies = (slug: string, list: Company[]) => {
  try {
    localStorage.setItem(`nexora_crm_companies_${slug}`, JSON.stringify(list))
  } catch {
    // Ignore storage write error
  }
}

export default function CompaniesPage() {
  useDocumentTitle('Companies')
  const slug = useWorkspaceSlug()

  const [companies, setCompanies] = useState<Company[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [industryFilter, setIndustryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCompany, setEditingCompany] = useState<Company | null>(null)
  const [companyToDelete, setCompanyToDelete] = useState<Company | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const loadCompanies = useCallback(async () => {
    if (!slug) return
    setIsLoading(true)
    const deletedIds = getDeletedCompanyIds(slug)
    let current = getStoredCompanies(slug)

    try {
      const serverData = await crmService.listCompanies(slug, search)
      if (serverData && Array.isArray(serverData)) {
        const filteredServer = serverData.filter(
          (c) => !deletedIds.has(c.id) && !deletedIds.has((c as any)._id),
        )
        const serverIds = new Set(
          filteredServer.map((c) => c.id || (c as any)._id),
        )
        const remaining = current.filter(
          (c) =>
            !serverIds.has(c.id) &&
            !serverIds.has((c as any)._id) &&
            !deletedIds.has(c.id) &&
            !deletedIds.has((c as any)._id),
        )
        current = [...filteredServer, ...remaining]
        saveStoredCompanies(slug, current)
      }
    } catch {
      // Retain local store
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase()
      setCompanies(
        current.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            (c.email && c.email.toLowerCase().includes(q)) ||
            (c.industry && c.industry.toLowerCase().includes(q)),
        ),
      )
    } else {
      setCompanies(current)
    }
    setIsLoading(false)
  }, [slug, search])

  useEffect(() => {
    void loadCompanies()
  }, [loadCompanies])

  const handleSaveCompany = async (payload: CreateCompanyPayload) => {
    if (!slug) return
    try {
      if (editingCompany) {
        const targetId = editingCompany.id || (editingCompany as any)._id
        const updated = await crmService.updateCompany(slug, targetId, payload)
        const stored = getStoredCompanies(slug).map((c) =>
          c.id === targetId || (c as any)._id === targetId ? { ...c, ...updated } : c,
        )
        saveStoredCompanies(slug, stored)
        setCompanies((prev) =>
          prev.map((c) =>
            c.id === targetId || (c as any)._id === targetId ? { ...c, ...updated } : c,
          ),
        )
        toast.success('Company updated successfully')
      } else {
        const created = await crmService.createCompany(slug, payload)
        const stored = [created, ...getStoredCompanies(slug)]
        saveStoredCompanies(slug, stored)
        setCompanies((prev) => [created, ...prev])
        toast.success('Company created successfully')
      }
      await loadCompanies()
    } catch {
      toast.error('Failed to save company')
    }
  }

  const handleConfirmDelete = async () => {
    if (!companyToDelete || !slug) return
    const targetId = companyToDelete.id || (companyToDelete as any)._id
    if (!targetId) {
      toast.error('Invalid company ID')
      return
    }

    setIsDeleting(true)
    try {
      try {
        await crmService.deleteCompany(slug, targetId)
      } catch (err) {
        console.warn('Backend delete notification (local mock or removed):', err)
      }

      addDeletedCompanyId(slug, targetId)
      const stored = getStoredCompanies(slug).filter(
        (c) => c.id !== targetId && (c as any)._id !== targetId,
      )
      saveStoredCompanies(slug, stored)
      setCompanies((prev) =>
        prev.filter((c) => c.id !== targetId && (c as any)._id !== targetId),
      )

      toast.success(`Deleted ${companyToDelete.name}`)
      setCompanyToDelete(null)
    } catch {
      toast.error('Failed to delete company')
    } finally {
      setIsDeleting(false)
    }
  }

  const statusCounts = useMemo(() => {
    return {
      all: companies.length,
      customer: companies.filter((c) => c.status === 'customer').length,
      prospect: companies.filter((c) => c.status === 'prospect').length,
      partner: companies.filter((c) => c.status === 'partner').length,
      inactive: companies.filter((c) => c.status === 'inactive').length,
    }
  }, [companies])

  const filteredCompanies = useMemo(() => {
    return companies.filter((c) => {
      const matchesIndustry = industryFilter === 'all' || c.industry === industryFilter
      const matchesStatus = statusFilter === 'all' || c.status === statusFilter
      return matchesIndustry && matchesStatus
    })
  }, [companies, industryFilter, statusFilter])

  const {
    paginatedItems: paginatedCompanies,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    totalItems,
  } = usePagination({ items: filteredCompanies, initialPageSize: 10 })

  return (
    <div className="space-y-5">
      <PageHeader
        title="Companies"
        description="Manage client organizations, partner accounts, and prospective enterprise customers."
        actions={
          <Button
            variant="primary"
            onClick={() => {
              setEditingCompany(null)
              setModalOpen(true)
            }}
          >
            <Plus className="size-4 mr-1.5" />
            Add Company
          </Button>
        }
      />

      <CompanyStatsStrip companies={companies} />

      <CompanyFilterBar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        industryFilter={industryFilter}
        onIndustryChange={setIndustryFilter}
        statusCounts={statusCounts}
        onRefresh={() => void loadCompanies()}
        isRefreshing={isLoading}
      />

      {isLoading ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-md border border-slate-200 bg-white">
          <Spinner size="lg" label="Loading companies..." />
        </div>
      ) : filteredCompanies.length === 0 ? (
        <EmptyState
          icon={Building2}
          title={search ? 'No matching companies found' : 'No companies added yet'}
          description={
            search
              ? 'Try modifying your search or filter criteria.'
              : 'Add your first enterprise account or business customer to track revenue and deals.'
          }
          action={
            <Button
              variant="primary"
              onClick={() => {
                setEditingCompany(null)
                setModalOpen(true)
              }}
            >
              <Plus className="size-4 mr-1.5" />
              Add Company
            </Button>
          }
        />
      ) : (
        <div className="rounded-md border border-slate-200 bg-white overflow-hidden">
          <CompanyTable
            companies={paginatedCompanies}
            onEdit={(comp) => {
              setEditingCompany(comp)
              setModalOpen(true)
            }}
            onDelete={(comp) => setCompanyToDelete(comp)}
          />
          <div className="border-t border-b border-slate-200 bg-slate-50/50 px-4 py-3">
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

      <CompanyModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditingCompany(null)
        }}
        onSave={handleSaveCompany}
        company={editingCompany}
      />

      <ConfirmDialog
        isOpen={!!companyToDelete}
        onClose={() => {
          if (!isDeleting) setCompanyToDelete(null)
        }}
        onConfirm={handleConfirmDelete}
        title="This is a warning"
        description={
          companyToDelete ? (
            <span>
              Are you sure you want to delete{' '}
              <strong className="font-semibold text-slate-900">{companyToDelete.name}</strong>?
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
