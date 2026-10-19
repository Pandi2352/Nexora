import { Building2, ExternalLink, Mail, MoreVertical, Pencil, Phone, Star, Trash2 } from 'lucide-react'
import { Dropdown, DropdownItem } from '@/components/ui'
import type { Company, Contact } from '@/types/crm'

interface ContactTableProps {
  contacts: Contact[]
  companies: Company[]
  onEdit: (contact: Contact) => void
  onDelete: (contactId: string) => void
}

export function ContactTable({ contacts, companies, onEdit, onDelete }: ContactTableProps) {
  const companyMap = new Map(companies.map((c) => [c.id, c.name]))

  return (
    <div className="overflow-x-auto rounded-md border border-slate-200 bg-white">
      <table className="w-full text-left text-xs sm:text-sm">
        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
          <tr>
            <th className="py-3 px-4">Name</th>
            <th className="py-3 px-4">Title & Company</th>
            <th className="py-3 px-4">Contact Info</th>
            <th className="py-3 px-4">Social</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {contacts.map((contact) => {
            const companyName = contact.companyId ? companyMap.get(contact.companyId) : null

            return (
              <tr key={contact.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-600 border border-slate-200 font-semibold text-xs">
                      {contact.firstName[0]}
                      {contact.lastName[0]}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="font-semibold text-slate-900 truncate">
                          {contact.salutation ? `${contact.salutation} ` : ''}
                          {contact.firstName} {contact.lastName}
                        </p>
                        {contact.isPrimary && (
                          <span title="Primary Contact">
                            <Star className="size-3 text-amber-500 fill-amber-400" />
                          </span>
                        )}
                      </div>
                      {contact.gender && (
                        <p className="text-[11px] text-slate-400 capitalize">{contact.gender.replace('_', ' ')}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-slate-600">
                  <div className="min-w-0">
                    <p className="font-medium text-slate-800 truncate">{contact.designation || 'Stakeholder'}</p>
                    {companyName ? (
                      <p className="text-xs text-brand-600 truncate flex items-center gap-1 mt-0.5">
                        <Building2 className="size-3" />
                        {companyName}
                      </p>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No company</p>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4 text-slate-600">
                  <div className="space-y-0.5 text-xs">
                    <a
                      href={`mailto:${contact.email}`}
                      className="inline-flex items-center gap-1.5 text-slate-700 hover:text-brand-600 cursor-pointer"
                    >
                      <Mail className="size-3 text-slate-400" />
                      <span className="truncate max-w-[160px]">{contact.email}</span>
                    </a>
                    {contact.phone && (
                      <p className="flex items-center gap-1.5 text-slate-500">
                        <Phone className="size-3 text-slate-400" />
                        <span>{contact.phone}</span>
                      </p>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    {contact.linkedInUrl && (
                      <a
                        href={contact.linkedInUrl.startsWith('http') ? contact.linkedInUrl : `https://${contact.linkedInUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-brand-600 hover:underline flex items-center gap-0.5 cursor-pointer"
                      >
                        LinkedIn
                        <ExternalLink className="size-2.5" />
                      </a>
                    )}
                    {contact.twitterHandle && (
                      <span className="text-xs text-slate-500 font-mono">
                        {contact.twitterHandle.startsWith('@') ? contact.twitterHandle : `@${contact.twitterHandle}`}
                      </span>
                    )}
                    {!contact.linkedInUrl && !contact.twitterHandle && <span className="text-slate-400 text-xs">—</span>}
                  </div>
                </td>
                <td className="py-3 px-4 text-right">
                  <Dropdown
                    label="Contact actions"
                    align="end"
                    trigger={
                      <span className="flex size-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer">
                        <MoreVertical className="size-4" />
                      </span>
                    }
                  >
                    <DropdownItem
                      label="Edit Contact"
                      icon={Pencil}
                      onClick={() => onEdit(contact)}
                    />
                    <DropdownItem
                      label="Delete Contact"
                      icon={Trash2}
                      onClick={() => onDelete(contact.id)}
                    />
                  </Dropdown>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
