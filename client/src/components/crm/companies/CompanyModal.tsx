import { useEffect, useState, type FormEvent } from 'react'
import { Button, CountrySelect, Input, Modal, Select, type SelectOption } from '@/components/ui'
import type { Company, CompanyStatus, CreateCompanyPayload } from '@/types/crm'
import { IndustrySelect } from './IndustrySelect'

interface CompanyModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (payload: CreateCompanyPayload) => Promise<void>
  company?: Company | null
}

const STATUS_OPTIONS: SelectOption<CompanyStatus>[] = [
  { value: 'prospect', label: 'Prospect' },
  { value: 'customer', label: 'Customer' },
  { value: 'partner', label: 'Partner' },
  { value: 'inactive', label: 'Inactive' },
]

const EMPLOYEE_OPTIONS: SelectOption[] = [
  { value: '1-10', label: '1 - 10 employees' },
  { value: '11-50', label: '11 - 50 employees' },
  { value: '51-200', label: '51 - 200 employees' },
  { value: '201-500', label: '201 - 500 employees' },
  { value: '500+', label: '500+ employees' },
]

export function CompanyModal({ isOpen, onClose, onSave, company }: CompanyModalProps) {
  const [name, setName] = useState('')
  const [industry, setIndustry] = useState('')
  const [website, setWebsite] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [annualRevenue, setAnnualRevenue] = useState('')
  const [employeeCount, setEmployeeCount] = useState('11-50')
  const [status, setStatus] = useState<CompanyStatus>('prospect')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (company) {
      setName(company.name || '')
      setIndustry(company.industry || '')
      setWebsite(company.website || '')
      setPhone(company.phone || '')
      setEmail(company.email || '')
      setAnnualRevenue(company.annualRevenue ? String(company.annualRevenue) : '')
      setEmployeeCount(company.employeeCount || '11-50')
      setStatus(company.status || 'prospect')
      setCity(company.address?.city || '')
      setCountry(company.address?.country || '')
    } else {
      setName('')
      setIndustry('')
      setWebsite('')
      setPhone('')
      setEmail('')
      setAnnualRevenue('')
      setEmployeeCount('11-50')
      setStatus('prospect')
      setCity('')
      setCountry('')
    }
    setError(null)
  }, [company, isOpen])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Company name is required')
      return
    }

    setIsSubmitting(true)
    setError(null)
    try {
      await onSave({
        name: name.trim(),
        industry: industry.trim() || undefined,
        website: website.trim() || undefined,
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
        annualRevenue: annualRevenue ? Number(annualRevenue) : 0,
        employeeCount,
        status,
        address: city || country ? { city: city.trim(), country: country.trim() } : undefined,
      })
      onClose()
    } catch {
      setError('Failed to save company. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={company ? 'Edit Company' : 'Add New Company'}
      description="Create or update an enterprise account in your CRM directory."
      size="xl"
      footer={
        <div className="flex items-center justify-end gap-3">
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" form="company-form" type="submit" loading={isSubmitting}>
            {company ? 'Save Changes' : 'Create Company'}
          </Button>
        </div>
      }
    >
      <form id="company-form" onSubmit={handleSubmit} className="space-y-5 py-2">
        {error && (
          <div className="p-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-md">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="Company Name"
            placeholder="Acme Global Inc"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
          />
          <IndustrySelect
            value={industry}
            onChange={setIndustry}
            disabled={isSubmitting}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="Website"
            placeholder="https://example.com"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
          <Input
            label="Email"
            type="email"
            placeholder="contact@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <Input
            label="Phone Number"
            placeholder="+91 98765 43210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Input
            label="Annual Revenue (₹ INR)"
            type="number"
            placeholder="5000000"
            value={annualRevenue}
            onChange={(e) => setAnnualRevenue(e.target.value)}
          />
          <Select
            label="Company Status"
            value={status}
            options={STATUS_OPTIONS}
            onChange={(val) => setStatus(val as CompanyStatus)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <Select
            label="Employee Count"
            value={employeeCount}
            options={EMPLOYEE_OPTIONS}
            onChange={(val) => setEmployeeCount(val)}
          />
          <Input
            label="City"
            placeholder="Mumbai, Bengaluru..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <CountrySelect
            label="Country"
            value={country}
            onChange={(c) => setCountry(c)}
          />
        </div>
      </form>
    </Modal>
  )
}
