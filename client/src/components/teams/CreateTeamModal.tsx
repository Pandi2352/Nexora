import { useState } from 'react'
import { Button, Input, Modal, Select, type SelectOption } from '@/components/ui'
import { teamService } from '@/services/team.service'
import type { WorkspaceMember } from '@/types/member'

interface CreateTeamModalProps {
  isOpen: boolean
  onClose: () => void
  onCreated: () => void
  orgSlug: string
  members: WorkspaceMember[]
}

export function CreateTeamModal({
  isOpen,
  onClose,
  onCreated,
  orgSlug,
  members,
}: CreateTeamModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [leadUserId, setLeadUserId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const leadOptions: SelectOption[] = [
    { value: '', label: 'None (no team lead)' },
    ...members.map((m) => ({
      value: m.userId,
      label: m.name,
      description: m.email,
    })),
  ]

  const resetForm = () => {
    setName('')
    setDescription('')
    setLeadUserId('')
    setError(null)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Team name is required')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await teamService.createTeam(orgSlug, {
        name: name.trim(),
        description: description.trim() || undefined,
        leadUserId: leadUserId || undefined,
      })
      handleClose()
      onCreated()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create team'
      setError(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Team"
      description="Create a functional department or team to organize projects and members."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-md border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
            {error}
          </div>
        )}

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-700">
            Team Name <span className="text-rose-500">*</span>
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Engineering, Sales, Product"
            required
            autoFocus
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-700">
            Description
          </label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What does this team focus on?"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-700">
            Designated Team Lead
          </label>
          <Select
            options={leadOptions}
            value={leadUserId}
            onChange={(val) => setLeadUserId(val as string)}
            placeholder="Select a team lead..."
            searchable
          />
          <p className="mt-1 text-[11px] text-slate-500">
            The team lead will automatically be added as a member of this team.
          </p>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={isSubmitting}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={isSubmitting}
            className="cursor-pointer"
          >
            Create Team
          </Button>
        </div>
      </form>
    </Modal>
  )
}
