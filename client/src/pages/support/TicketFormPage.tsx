import { useRef, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ErrorState } from '@/components/common/ErrorState'
import { PageSkeleton } from '@/components/common/PageSkeleton'
import { TicketDetailsSection } from '@/components/support/form/TicketDetailsSection'
import { TicketFormHeader } from '@/components/support/form/TicketFormHeader'
import { TicketRequesterSection } from '@/components/support/form/TicketRequesterSection'
import { TicketTriageSection } from '@/components/support/form/TicketTriageSection'
import { toast } from '@/components/ui'
import { paths, workspaceSegments } from '@/config/paths'
import { useAuth } from '@/context/auth/auth-context'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useHotkey } from '@/hooks/useHotkey'
import { useTicketForm } from '@/hooks/useTicketForm'
import { useWorkspaceMembers } from '@/hooks/useWorkspaceMembers'
import { extractApiError } from '@/lib/api-client'
import { resolveError } from '@/lib/errors'

/** Full-page create / edit form (`/support/tickets/new`, `/support/tickets/:id/edit`). */
export default function TicketFormPage() {
  const { ticketId } = useParams()
  const isEditing = !!ticketId
  const navigate = useNavigate()
  const formRef = useRef<HTMLFormElement>(null)
  const { user } = useAuth()
  const { options: memberOptions } = useWorkspaceMembers()
  const form = useTicketForm(ticketId)
  useDocumentTitle(isEditing ? `Edit ${form.ticket?.ticketKey ?? 'ticket'}` : 'New ticket')
  useHotkey('s', () => formRef.current?.requestSubmit())

  const backTo = isEditing
    ? paths.supportTicket(form.slug, ticketId)
    : paths.workspace(form.slug, workspaceSegments.supportTickets)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      const saved = await form.save()
      if (!saved) {
        toast.error('Please fix the highlighted fields')
        return
      }
      toast.success(isEditing ? `${saved.ticketKey} updated` : `${saved.ticketKey} created`)
      navigate(paths.supportTicket(form.slug, saved.id))
    } catch (err) {
      toast.error(extractApiError(err).message)
    }
  }

  if (form.loadError) return <ErrorState error={resolveError(form.loadError)} />
  if (form.isLoading) return <PageSkeleton />

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-6 pb-16">
      <TicketFormHeader
        title={isEditing ? `Edit ${form.ticket?.ticketKey}` : 'New support ticket'}
        subtitle={
          isEditing
            ? 'Update the request details, requester and triage. Status and replies are managed on the ticket.'
            : 'Log a customer or internal request. SLA timers start as soon as it is saved.'
        }
        backTo={backTo}
        isSaving={form.isSaving}
        submitLabel={isEditing ? 'Save changes' : 'Create ticket'}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <TicketDetailsSection values={form.values} errors={form.errors} onChange={form.change} />
          <TicketRequesterSection
            values={form.values}
            errors={form.errors}
            onChange={form.change}
            contacts={form.contacts}
            companyNameById={form.companyNameById}
          />
        </div>
        <TicketTriageSection
          values={form.values}
          onChange={form.change}
          memberOptions={memberOptions}
          currentUserId={user?.id}
          isEditing={isEditing}
        />
      </div>
    </form>
  )
}
