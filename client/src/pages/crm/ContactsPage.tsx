import { useCallback, useEffect, useState } from 'react'
import { Plus, Users } from 'lucide-react'
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
import type { Company, Contact, CreateContactPayload } from '@/types/crm'
import { ContactModal } from '@/components/crm/contacts/ContactModal'
import { ContactTable } from '@/components/crm/contacts/ContactTable'

export default function ContactsPage() {
  useDocumentTitle('Contacts')
  const slug = useWorkspaceSlug()

  const [contacts, setContacts] = useState<Contact[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [companyFilter, setCompanyFilter] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)

  const loadData = useCallback(async () => {
    if (!slug) return
    setIsLoading(true)
    try {
      const [contactsData, companiesData] = await Promise.allSettled([
        crmService.listContacts(slug, search, companyFilter !== 'all' ? companyFilter : undefined),
        crmService.listCompanies(slug),
      ])
      if (contactsData.status === 'fulfilled') setContacts(contactsData.value || [])
      if (companiesData.status === 'fulfilled') setCompanies(companiesData.value || [])
    } finally {
      setIsLoading(false)
    }
  }, [slug, search, companyFilter])

  useEffect(() => {
    void loadData()
  }, [loadData])

  const handleSaveContact = async (payload: CreateContactPayload) => {
    if (!slug) return
    try {
      if (editingContact) {
        await crmService.updateContact(slug, editingContact.id, payload)
        toast.success('Contact updated successfully')
      } else {
        await crmService.createContact(slug, payload)
        toast.success('Contact created successfully')
      }
      await loadData()
    } catch {
      toast.error('Failed to save contact')
    }
  }

  const handleDeleteContact = async (contactId: string) => {
    if (!slug) return
    if (!window.confirm('Are you sure you want to delete this contact?')) return
    try {
      await crmService.deleteContact(slug, contactId)
      toast.success('Contact deleted successfully')
      await loadData()
    } catch {
      toast.error('Failed to delete contact')
    }
  }

  const companyFilterOptions: SelectOption[] = [
    { value: 'all', label: 'All Companies' },
    ...companies.map((c) => ({ value: c.id, label: c.name })),
  ]

  const {
    paginatedItems: paginatedContacts,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    totalItems,
  } = usePagination({ items: contacts, initialPageSize: 10 })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Contacts"
        description="Directory of stakeholders, decision makers, and leads across organizations."
        actions={
          <Button
            variant="primary"
            onClick={() => {
              setEditingContact(null)
              setModalOpen(true)
            }}
          >
            <Plus className="size-4 mr-1.5" />
            Add Contact
          </Button>
        }
      />

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-full sm:w-80">
            <SearchInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search contacts by name, email, or title..."
              size="md"
            />
          </div>
          <div className="w-full sm:w-56 shrink-0">
            <Select
              value={companyFilter}
              options={companyFilterOptions}
              onChange={(val) => setCompanyFilter(val)}
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-md border border-slate-200 bg-white">
          <Spinner size="lg" label="Loading contacts..." />
        </div>
      ) : contacts.length === 0 ? (
        <EmptyState
          icon={Users}
          title={search ? 'No matching contacts found' : 'No contacts added yet'}
          description={
            search
              ? 'Try modifying your search query or company filter.'
              : 'Add your first stakeholder or business contact to link with accounts and leads.'
          }
          action={
            <Button
              variant="primary"
              onClick={() => {
                setEditingContact(null)
                setModalOpen(true)
              }}
            >
              <Plus className="size-4 mr-1.5" />
              Add Contact
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          <ContactTable
            contacts={paginatedContacts}
            companies={companies}
            onEdit={(cnt) => {
              setEditingContact(cnt)
              setModalOpen(true)
            }}
            onDelete={handleDeleteContact}
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

      <ContactModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditingContact(null)
        }}
        onSave={handleSaveContact}
        contact={editingContact}
        companies={companies}
      />
    </div>
  )
}
