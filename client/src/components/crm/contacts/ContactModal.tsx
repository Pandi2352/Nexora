import { useEffect, useState, type FormEvent } from 'react'
import { Button, Input, Modal, Select, Textarea, type SelectOption } from '@/components/ui'
import type { Company, Contact, CreateContactPayload, Gender, Salutation } from '@/types/crm'

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (payload: CreateContactPayload) => Promise<void>
  contact?: Contact | null
  companies: Company[]
}

const SALUTATION_OPTIONS: SelectOption<Salutation>[] = [
  { value: 'Mr.', label: 'Mr.' },
  { value: 'Ms.', label: 'Ms.' },
  { value: 'Mrs.', label: 'Mrs.' },
  { value: 'Dr.', label: 'Dr.' },
  { value: 'Prof.', label: 'Prof.' },
]

const GENDER_OPTIONS: SelectOption<Gender>[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'non_binary', label: 'Non-Binary' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
]

export function ContactModal({ isOpen, onClose, onSave, contact, companies }: ContactModalProps) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [salutation, setSalutation] = useState<Salutation>('Mr.')
  const [gender, setGender] = useState<Gender>('male')
  const [designation, setDesignation] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [companyId, setCompanyId] = useState<string>('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [description, setDescription] = useState('')
  const [linkedInUrl, setLinkedInUrl] = useState('')
  const [twitterHandle, setTwitterHandle] = useState('')
  const [isPrimary, setIsPrimary] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (contact) {
      setFirstName(contact.firstName || '')
      setLastName(contact.lastName || '')
      setSalutation(contact.salutation || 'Mr.')
      setGender(contact.gender || 'male')
      setDesignation(contact.designation || '')
      setEmail(contact.email || '')
      setPhone(contact.phone || '')
      setCompanyId(contact.companyId || '')
      setDateOfBirth(contact.dateOfBirth ? contact.dateOfBirth.split('T')[0]! : '')
      setDescription(contact.description || '')
      setLinkedInUrl(contact.linkedInUrl || '')
      setTwitterHandle(contact.twitterHandle || '')
      setIsPrimary(Boolean(contact.isPrimary))
    } else {
      setFirstName('')
      setLastName('')
      setSalutation('Mr.')
      setGender('male')
      setDesignation('')
      setEmail('')
      setPhone('')
      setCompanyId('')
      setDateOfBirth('')
      setDescription('')
      setLinkedInUrl('')
      setTwitterHandle('')
      setIsPrimary(false)
    }
    setError(null)
  }, [contact, isOpen])

  const companyOptions: SelectOption[] = [
    { value: '', label: 'No Company Assigned' },
    ...companies.map((c) => ({ value: c.id, label: c.name })),
  ]

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!firstName.trim() || !lastName.trim()) {
      setError('First name and last name are required')
      return
    }
    if (!email.trim()) {
      setError('Email address is required')
      return
    }

    setIsSubmitting(true)
    setError(null)
    try {
      await onSave({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        salutation,
        gender,
        designation: designation.trim() || undefined,
        email: email.trim().toLowerCase(),
        phone: phone.trim() || undefined,
        companyId: companyId || undefined,
        dateOfBirth: dateOfBirth || undefined,
        description: description.trim() || undefined,
        linkedInUrl: linkedInUrl.trim() || undefined,
        twitterHandle: twitterHandle.trim() || undefined,
        isPrimary,
      })
      onClose()
    } catch {
      setError('Failed to save contact. Please check your inputs.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={contact ? 'Edit Contact' : 'Add New Contact'}
      description="Record key stakeholders, procurement heads, and decision makers."
      size="lg"
      footer={
        <div className="flex items-center justify-end gap-3">
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" form="contact-form" type="submit" loading={isSubmitting}>
            {contact ? 'Save Changes' : 'Create Contact'}
          </Button>
        </div>
      }
    >
      <form id="contact-form" onSubmit={handleSubmit} className="space-y-4 py-1">
        {error && (
          <div className="p-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-md">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Select
            label="Salutation"
            value={salutation}
            options={SALUTATION_OPTIONS}
            onChange={(val) => setSalutation(val as Salutation)}
          />
          <div className="sm:col-span-3">
            <Input
              label="First Name"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              autoFocus
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Last Name"
            placeholder="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <Select
            label="Gender"
            value={gender}
            options={GENDER_OPTIONS}
            onChange={(val) => setGender(val as Gender)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Job Title / Designation"
            placeholder="Chief Technology Officer"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
          />
          <Select
            label="Associated Company"
            value={companyId}
            options={companyOptions}
            onChange={(val) => setCompanyId(val)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Email"
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Phone Number"
            placeholder="+91 98765 43210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Input
            label="Date of Birth"
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="LinkedIn Profile URL"
            placeholder="https://linkedin.com/in/username"
            value={linkedInUrl}
            onChange={(e) => setLinkedInUrl(e.target.value)}
          />
          <Input
            label="Twitter / X Handle"
            placeholder="@handle"
            value={twitterHandle}
            onChange={(e) => setTwitterHandle(e.target.value)}
          />
        </div>

        <Textarea
          label="Notes / Bio"
          placeholder="Key stakeholder background, preferences, or meeting notes..."
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="flex items-center gap-3 pt-1">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={isPrimary}
              onChange={(e) => setIsPrimary(e.target.checked)}
              className="size-4 rounded-md border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
            />
            <span className="text-xs sm:text-sm text-slate-700 font-medium">
              Primary Point of Contact for this account
            </span>
          </label>
        </div>
      </form>
    </Modal>
  )
}
