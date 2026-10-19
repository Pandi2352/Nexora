import { useEffect, useState } from 'react'
import { Button, Input, Modal, Select, type SelectOption } from '@/components/ui'
import { teamService } from '@/services/team.service'
import type { WorkspaceMember } from '@/types/member'
import type { TeamSummary } from '@/types/team'

interface EditTeamModalProps {
  team: TeamSummary | null
  isOpen: boolean
  onClose: () => void
  onUpdated: () => void
  orgSlug: string
  members: WorkspaceMember[]
}

export function EditTeamModal({
  team,
  isOpen,
  onClose,
  onUpdated,
  orgSlug,
  members,
}: EditTeamModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [leadUserId, setLeadUserId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (team) {
      setName(team.name || '')
      setDescription(team.description || '')
      setLeadUserId(team.leadUserId || '')
      setError(null)
    }
  }, [team])

  const leadOptions: SelectOption[] = [
    { value: '', label: 'None (no team lead)' },
    ...members.map((m) => ({
      value: m.userId,
      label: m.name,
      description: m.email,
    })),
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!team) return
    if (!name.trim()) {
      setError('Team name is required')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await teamService.updateTeam(orgSlug, team.id, {
        name: name.trim(),
        description: description.trim() || undefined,
        leadUserId: leadUserId || null,
      })
      onClose()
      onUpdated()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update team'
      setError(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Team"
      description="Update team name, mission, or designated team lead."
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
            placeholder="e.g. Engineering"
            required
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
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
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
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  )
}
