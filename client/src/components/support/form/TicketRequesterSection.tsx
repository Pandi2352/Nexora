import { Link2, Link2Off, UserRound } from 'lucide-react'
import { FormSection } from '@/components/common/FormSection'
import { Button, Input, Select, type SelectOption } from '@/components/ui'
import type { Contact } from '@/types/crm'
import type { TicketFormErrors, TicketFormValues } from './ticket-form'

interface TicketRequesterSectionProps {
  values: TicketFormValues
  errors: TicketFormErrors
  onChange: (patch: Partial<TicketFormValues>) => void
  contacts: Contact[]
  companyNameById: Map<string, string>
}

/** Requester details, optionally linked to a CRM contact (which fills the fields). */
export function TicketRequesterSection({
  values,
  errors,
  onChange,
  contacts,
  companyNameById,
}: TicketRequesterSectionProps) {
  const contactOptions: SelectOption[] = contacts.map((c) => ({
    value: c.id,
    label: `${c.firstName} ${c.lastName}`.trim(),
    description: [c.email, c.companyId && companyNameById.get(c.companyId)]
      .filter(Boolean)
      .join(' · '),
  }))

  const linkContact = (contactId: string) => {
    const contact = contacts.find((c) => c.id === contactId)
    if (!contact) return
    onChange({
      contactId: contact.id,
      companyId: contact.companyId,
      requesterName: `${contact.firstName} ${contact.lastName}`.trim(),
      requesterEmail: contact.email,
      requesterPhone: contact.phone ?? '',
      requesterCompany:
        (contact.companyId && companyNameById.get(contact.companyId)) || values.requesterCompany,
    })
  }

  return (
    <FormSection
      icon={UserRound}
      iconClassName="text-indigo-600"
      title="Requester"
      description="Who needs help and how to reach them."
    >
      <div>
        <Select
          label="CRM contact"
          placeholder={
            contacts.length ? 'Search contacts to fill in the requester' : 'No CRM contacts yet'
          }
          icon={Link2}
          options={contactOptions}
          value={values.contactId}
          searchable
          disabled={contacts.length === 0}
          onChange={linkContact}
        />
        {values.contactId && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-1.5"
            onClick={() => onChange({ contactId: undefined, companyId: undefined })}
          >
            <Link2Off className="size-4" aria-hidden />
            Unlink contact (keep details)
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Input
          label="Name"
          required
          value={values.requesterName}
          error={errors.requesterName}
          onChange={(e) => onChange({ requesterName: e.target.value })}
        />
        <Input
          label="Email"
          type="email"
          required
          value={values.requesterEmail}
          error={errors.requesterEmail}
          onChange={(e) => onChange({ requesterEmail: e.target.value })}
        />
        <Input
          label="Phone"
          type="tel"
          value={values.requesterPhone}
          onChange={(e) => onChange({ requesterPhone: e.target.value })}
        />
        <Input
          label="Company"
          value={values.requesterCompany}
          onChange={(e) => onChange({ requesterCompany: e.target.value })}
        />
      </div>
    </FormSection>
  )
}
