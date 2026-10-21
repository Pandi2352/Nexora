import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  emptyTicketForm,
  ticketToForm,
  toCreatePayload,
  toUpdatePayload,
  validateTicketForm,
  type TicketFormErrors,
  type TicketFormValues,
} from '@/components/support/form/ticket-form'
import { crmService } from '@/services/crm.service'
import { supportService } from '@/services/support.service'
import type { Company, Contact } from '@/types/crm'
import type { Ticket } from '@/types/support'
import { useWorkspaceSlug } from './useWorkspaceSlug'

/** State, lookups and save logic for the create / edit ticket page. */
export function useTicketForm(ticketId?: string) {
  const slug = useWorkspaceSlug()
  const [values, setValues] = useState<TicketFormValues>(emptyTicketForm)
  const [errors, setErrors] = useState<TicketFormErrors>({})
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [loadError, setLoadError] = useState<unknown>(null)
  const [isLoading, setIsLoading] = useState(!!ticketId)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!slug) return
    let active = true
    // CRM lookups are optional: the form still works without them.
    crmService
      .listContacts(slug)
      .then((list) => active && setContacts(list ?? []))
      .catch(() => undefined)
    crmService
      .listCompanies(slug)
      .then((list) => active && setCompanies(list ?? []))
      .catch(() => undefined)
    if (ticketId) {
      supportService
        .getTicket(slug, ticketId)
        .then((loaded) => {
          if (!active) return
          setTicket(loaded)
          setValues(ticketToForm(loaded))
        })
        .catch((err: unknown) => active && setLoadError(err))
        .finally(() => active && setIsLoading(false))
    }
    return () => {
      active = false
    }
  }, [slug, ticketId])

  const companyNameById = useMemo(() => new Map(companies.map((c) => [c.id, c.name])), [companies])

  const change = useCallback((patch: Partial<TicketFormValues>) => {
    setValues((prev) => ({ ...prev, ...patch }))
    // Clear errors for fields the user just touched.
    setErrors((prev) => {
      const next = { ...prev }
      for (const key of Object.keys(patch)) delete next[key as keyof TicketFormValues]
      return next
    })
  }, [])

  /** Validates, then creates or updates. Returns the saved ticket, or null if invalid. */
  const save = useCallback(async (): Promise<Ticket | null> => {
    const found = validateTicketForm(values)
    setErrors(found)
    if (Object.keys(found).length > 0) return null
    setIsSaving(true)
    try {
      return ticketId
        ? await supportService.updateTicket(slug, ticketId, toUpdatePayload(values))
        : await supportService.createTicket(slug, toCreatePayload(values))
    } finally {
      setIsSaving(false)
    }
  }, [slug, ticketId, values])

  return {
    slug,
    values,
    errors,
    change,
    save,
    ticket,
    contacts,
    companyNameById,
    loadError,
    isLoading,
    isSaving,
  }
}
