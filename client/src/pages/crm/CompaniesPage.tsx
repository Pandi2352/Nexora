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
import { CompanyModal } from '@/components/crm/companies/CompanyModal'
import { CompanyTable } from '@/components/crm/companies/CompanyTable'
import { CompanyFilterBar } from '@/components/crm/companies/CompanyFilterBar'
import { CompanyStatsStrip } from '@/components/crm/companies/CompanyStatsStrip'

export default function CompaniesPage() {
  useDocumentTitle('Companies')
  const slug = useWorkspaceSlug()

  const [companies, setCompanies] = useState<Company[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [search, setSearch] = useState('')
  const [industryFilter, setIndustryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCompany, setEditingCompany] = useState<Company | null>(null)
  const [companyToDelete, setCompanyToDelete] = useState<Company | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const loadCompanies = useCallback(
    async (isBackground = false) => {
      if (!slug) return
      if (!isBackground && companies.length === 0) {
        setIsLoading(true)
      } else {
        setIsRefreshing(true)
      }

      try {
        const serverData = await crmService.listCompanies(slug, search)
        setCompanies(Array.isArray(serverData) ? serverData : [])
      } catch {
        toast.error('Failed to load companies from server')
      } finally {
        setIsLoading(false)
        setIsRefreshing(false)
      }
    },
    [slug, search, companies.length],
  )

  useEffect(() => {
    void loadCompanies()
  }, [loadCompanies])

  const handleSaveCompany = async (payload: CreateCompanyPayload) => {
    if (!slug) return
    try {
      if (editingCompany) {
        const targetId = editingCompany.id || (editingCompany as any)._id
        await crmService.updateCompany(slug, targetId, payload)
        toast.success('Company updated successfully')
      } else {
        await crmService.createCompany(slug, payload)
        toast.success('Company created successfully')
      }
      setModalOpen(false)
      setEditingCompany(null)
      await loadCompanies(true)
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
      await crmService.deleteCompany(slug, targetId)
      setCompanies((prev) =>
        prev.filter((c) => c.id !== targetId && (c as any)._id !== targetId),
      )
      toast.success(`Deleted ${companyToDelete.name}`)
      setCompanyToDelete(null)
      await loadCompanies(true)
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
        statusCounts={statusCounts}
        industryFilter={industryFilter}
        onIndustryChange={setIndustryFilter}
        onRefresh={() => void loadCompanies(true)}
        isRefreshing={isRefreshing}
      />

      {isLoading && companies.length === 0 ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-md border border-slate-200 bg-white">
          <Spinner size="lg" label="Loading companies..." />
        </div>
      ) : filteredCompanies.length === 0 ? (
        <EmptyState
          icon={Building2}
          title={search ? 'No matching companies found' : 'No companies added yet'}
          description={
            search
              ? 'Try modifying your search query or reset your filters.'
              : 'Add your first prospective or customer company to get started.'
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
            onEdit={(company) => {
              setEditingCompany(company)
              setModalOpen(true)
            }}
            onDelete={(company) => setCompanyToDelete(company)}
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
