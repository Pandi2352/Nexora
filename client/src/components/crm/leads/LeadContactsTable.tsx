import { useState } from 'react'
import {
  Check,
  Mail,
  Phone,
  Plus,
  Star,
  Trash2,
  User,
  Users,
} from 'lucide-react'
import { Button, Input, Tooltip } from '@/components/ui'
import type { LeadContactItem } from '@/types/crm'

interface LeadContactsTableProps {
  contacts: LeadContactItem[]
  onChange: (contacts: LeadContactItem[]) => void
}

export function LeadContactsTable({ contacts, onChange }: LeadContactsTableProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [designation, setDesignation] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [isPrimary, setIsPrimary] = useState(contacts.length === 0)
  const [formError, setFormError] = useState('')

  const handleAddContact = () => {
    if (!firstName.trim()) {
      setFormError('First name is required.')
      return
    }
    if (!email.trim() || !email.includes('@')) {
      setFormError('A valid email address is required.')
      return
    }

    const newContact: LeadContactItem = {
      id: `cnt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      designation: designation.trim() || undefined,
      email: email.trim().toLowerCase(),
      phone: phone.trim() || undefined,
      isPrimary: isPrimary || contacts.length === 0,
    }

    let updated = [...contacts]
    if (newContact.isPrimary) {
      updated = updated.map((c) => ({ ...c, isPrimary: false }))
    }
    updated.push(newContact)

    onChange(updated)
    setFirstName('')
    setLastName('')
    setDesignation('')
    setEmail('')
    setPhone('')
    setIsPrimary(false)
    setFormError('')
    setShowAddForm(false)
  }

  const handleRemove = (id: string) => {
    const remaining = contacts.filter((c) => c.id !== id)
    if (remaining.length > 0 && !remaining.some((c) => c.isPrimary) && remaining[0]) {
      remaining[0].isPrimary = true
    }
    onChange(remaining)
  }

  const handleSetPrimary = (id: string) => {
    onChange(
      contacts.map((c) => ({
        ...c,
        isPrimary: c.id === id,
      })),
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Users className="size-4 text-brand-600" />
            Lead Stakeholders & Multi-Contacts ({contacts.length})
          </h4>
          <p className="text-xs text-slate-500">
            Maintain key buyer committee contacts and define the primary decision maker.
          </p>
        </div>
        {!showAddForm && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setShowAddForm(true)}
            className="cursor-pointer"
          >
            <Plus className="size-3.5 mr-1" />
            Add Contact
          </Button>
        )}
      </div>

      {/* Inline Contact Creator */}
      {showAddForm && (
        <div className="rounded-md border border-brand-200 bg-brand-50/20 p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-brand-100 pb-2">
            <span className="text-xs font-semibold text-brand-900 flex items-center gap-1.5">
              <User className="size-3.5 text-brand-600" />
              New Contact Details
            </span>
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false)
                setFormError('')
              }}
              className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              Cancel
            </button>
          </div>

          {formError && (
            <p className="text-xs font-medium text-rose-600 bg-rose-50 border border-rose-200 rounded-md px-2.5 py-1">
              {formError}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                First Name <span className="text-rose-500">*</span>
              </label>
              <Input
                placeholder="e.g. Rahul"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                Last Name
              </label>
              <Input
                placeholder="e.g. Sharma"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                Work Email <span className="text-rose-500">*</span>
              </label>
              <Input
                type="email"
                placeholder="rahul.sharma@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                Phone Number
              </label>
              <Input
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-700 block mb-1">
              Job Title / Designation
            </label>
            <Input
              placeholder="e.g. Chief Technology Officer / Procurement Lead"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 select-none">
              <input
                type="checkbox"
                checked={isPrimary}
                onChange={(e) => setIsPrimary(e.target.checked)}
                className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
              />
              Mark as Primary Decision Maker
            </label>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleAddContact}
                className="cursor-pointer"
              >
                <Check className="size-3.5 mr-1" />
                Add to Lead Contacts
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Multi-Contacts Table */}
      <div className="overflow-x-auto rounded-md border border-slate-200 bg-white">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] tracking-wider">
            <tr>
              <th className="py-2.5 px-3">Contact</th>
              <th className="py-2.5 px-3">Designation</th>
              <th className="py-2.5 px-3">Email & Phone</th>
              <th className="py-2.5 px-3">Decision Maker</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {contacts.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-6 text-center text-xs text-slate-400 italic">
                  No contacts added yet. Click &quot;Add Contact&quot; to link stakeholders.
                </td>
              </tr>
            ) : (
              contacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-md border border-brand-200 bg-brand-50 text-[11px] font-bold text-brand-700">
                        {contact.firstName[0]}
                        {contact.lastName?.[0] || ''}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">
                          {contact.firstName} {contact.lastName}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="py-2.5 px-3 text-slate-600">
                    {contact.designation || <span className="text-slate-400 italic">Not specified</span>}
                  </td>

                  <td className="py-2.5 px-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Mail className="size-3 text-slate-400" />
                        <span>{contact.email}</span>
                      </div>
                      {contact.phone && (
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                          <Phone className="size-3 text-slate-400" />
                          <span>{contact.phone}</span>
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="py-2.5 px-3">
                    {contact.isPrimary ? (
                      <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 border border-amber-200 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
                        <Star className="size-3 fill-amber-500 text-amber-500" />
                        Primary Contact
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSetPrimary(contact.id)}
                        className="text-[11px] text-slate-500 hover:text-brand-600 hover:underline cursor-pointer"
                      >
                        Set as primary
                      </button>
                    )}
                  </td>

                  <td className="py-2.5 px-3 text-right">
                    <Tooltip content="Remove contact from lead">
                      <button
                        type="button"
                        onClick={() => handleRemove(contact.id)}
                        className="size-7 inline-flex items-center justify-center rounded-md border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                        aria-label="Remove contact"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </Tooltip>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Colorful Info Note Below Contact Table */}
      <div className="rounded-md border border-teal-200 bg-teal-50/60 p-2.5 text-xs text-teal-800 flex items-start gap-2">
        <Users className="size-4 shrink-0 text-teal-600 mt-0.5" />
        <div>
          <span className="font-semibold text-teal-900">Multi-Stakeholder Management:</span>{' '}
          Add all procurement officers, project sponsors, and architects involved in this deal. The
          primary decision maker will receive automated proposals, notifications, and meeting invites.
        </div>
      </div>
    </div>
  )
}
