import type {
  CreateTicketPayload,
  Ticket,
  TicketCategory,
  TicketChannel,
  TicketPriority,
  UpdateTicketPayload,
} from '@/types/support'

export interface TicketFormValues {
  subject: string
  description: string
  priority: TicketPriority
  category: TicketCategory
  channel: TicketChannel
  requesterName: string
  requesterEmail: string
  requesterPhone: string
  requesterCompany: string
  contactId?: string
  companyId?: string
  assigneeId?: string
  tags: string[]
}

export type TicketFormErrors = Partial<Record<keyof TicketFormValues, string>>

export const emptyTicketForm = (): TicketFormValues => ({
  subject: '',
  description: '',
  priority: 'medium',
  category: 'general',
  channel: 'web',
  requesterName: '',
  requesterEmail: '',
  requesterPhone: '',
  requesterCompany: '',
  tags: [],
})

export const ticketToForm = (t: Ticket): TicketFormValues => ({
  subject: t.subject,
  description: t.description,
  priority: t.priority,
  category: t.category,
  channel: t.channel,
  requesterName: t.requester.name,
  requesterEmail: t.requester.email,
  requesterPhone: t.requester.phone ?? '',
  requesterCompany: t.requester.companyName ?? '',
  contactId: t.contactId,
  companyId: t.companyId,
  assigneeId: t.assigneeId,
  tags: t.tags,
})

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Client-side checks for fast feedback; the server re-validates everything. */
export function validateTicketForm(v: TicketFormValues): TicketFormErrors {
  const errors: TicketFormErrors = {}
  if (!v.subject.trim()) errors.subject = 'Add a short summary of the request'
  else if (v.subject.length > 200) errors.subject = 'Keep the subject under 200 characters'
  if (!v.description.trim()) errors.description = 'Describe the problem or request'
  if (!v.requesterName.trim()) errors.requesterName = 'Who raised this request?'
  if (!v.requesterEmail.trim())
    errors.requesterEmail = 'An email is needed to reply to the requester'
  else if (!EMAIL.test(v.requesterEmail.trim()))
    errors.requesterEmail = 'Enter a valid email address'
  return errors
}

const optional = (value: string) => value.trim() || undefined

function toCommon(v: TicketFormValues) {
  return {
    subject: v.subject.trim(),
    description: v.description.trim(),
    priority: v.priority,
    category: v.category,
    channel: v.channel,
    requester: {
      name: v.requesterName.trim(),
      email: v.requesterEmail.trim(),
      phone: optional(v.requesterPhone),
      companyName: optional(v.requesterCompany),
    },
    contactId: v.contactId,
    companyId: v.companyId,
    tags: v.tags,
  }
}

export const toCreatePayload = (v: TicketFormValues): CreateTicketPayload => ({
  ...toCommon(v),
  assigneeId: v.assigneeId,
})

export const toUpdatePayload = (v: TicketFormValues): UpdateTicketPayload => toCommon(v)
