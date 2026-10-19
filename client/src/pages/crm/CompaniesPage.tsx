import { useCallback, useEffect, useState } from 'react'
import { Building2, Plus, Search } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { EmptyState } from '@/components/common/EmptyState'
import { Button, Input, Select, Spinner, type SelectOption } from '@/components/ui'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useWorkspaceSlug } from '@/hooks/useWorkspaceSlug'
import { crmService } from '@/services/crm.service'
import type { Company, CreateCompanyPayload } from '@/types/crm'
import { CompanyModal } from '@/components/crm/companies/CompanyModal'
import { CompanyTable } from '@/components/crm/companies/CompanyTable'

const INDUSTRY_FILTERS: SelectOption[] = [
  { value: 'all', label: 'All Industries' },
  { value: 'Technology', label: 'Technology' },
  { value: 'Finance', label: 'Finance' },
  { value: 'Healthcare', label: 'Healthcare' },
  { value: 'Manufacturing', label: 'Manufacturing' },
  { value: 'Consulting', label: 'Consulting' },
]

export default function CompaniesPage() {
  useDocumentTitle('Companies')
  const slug = useWorkspaceSlug()

  const [companies, setCompanies] = useState<Company[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [industryFilter, setIndustryFilter] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCompany, setEditingCompany] = useState<Company | null>(null)

  const loadCompanies = useCallback(async () => {
    if (!slug) return
    setIsLoading(true)
    try {
      const data = await crmService.listCompanies(slug, search)
      setCompanies(data || [])
    } catch {
      setCompanies([])
    } finally {
      setIsLoading(false)
    }
  }, [slug, search])

  useEffect(() => {
    void loadCompanies()
  }, [loadCompanies])

  const handleSaveCompany = async (payload: CreateCompanyPayload) => {
    if (!slug) return
    if (editingCompany) {
      await crmService.updateCompany(slug, editingCompany.id, payload)
    } else {
      await crmService.createCompany(slug, payload)
    }
    await loadCompanies()
  }

  const handleDeleteCompany = async (companyId: string) => {
    if (!slug) return
    if (!window.confirm('Are you sure you want to delete this company?')) return
    await crmService.deleteCompany(slug, companyId)
    await loadCompanies()
  }

  const filteredCompanies = companies.filter((c) => {
    const matchesIndustry = industryFilter === 'all' || c.industry === industryFilter
    return matchesIndustry
  })

  return (
    <div className="space-y-6">
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

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex-1">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search companies by name, industry, or email..."
            icon={Search}
            size="md"
          />
        </div>
        <div className="w-full sm:w-48 shrink-0">
          <Select
            value={industryFilter}
            options={INDUSTRY_FILTERS}
            onChange={(val) => setIndustryFilter(val)}
          />
        </div>
      </div>

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
              ? 'Try modifying your search or industry filter criteria.'
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
        <CompanyTable
          companies={filteredCompanies}
          onEdit={(comp) => {
            setEditingCompany(comp)
            setModalOpen(true)
          }}
          onDelete={handleDeleteCompany}
        />
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
    </div>
  )
}
