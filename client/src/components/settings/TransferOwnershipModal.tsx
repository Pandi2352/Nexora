import { useState } from 'react'
import { AlertTriangle, Crown } from 'lucide-react'
import { Button, Modal, Select, type SelectOption } from '@/components/ui'
import { organizationService } from '@/services/organization.service'
import type { WorkspaceMember } from '@/types/member'

interface TransferOwnershipModalProps {
  isOpen: boolean
  onClose: () => void
  workspaceSlug: string
  members: WorkspaceMember[]
  currentUserId?: string
  onTransferred: () => void
}

export function TransferOwnershipModal({
  isOpen,
  onClose,
  workspaceSlug,
  members,
  currentUserId,
  onTransferred,
}: TransferOwnershipModalProps) {
  const [selectedUserId, setSelectedUserId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const candidates = members.filter(
    (m) => m.userId !== currentUserId && m.status === 'active',
  )

  const memberOptions: SelectOption[] = candidates.map((m) => ({
    value: m.userId,
    label: m.name,
    description: `${m.email} (${m.role})`,
  }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUserId) return

    setIsSubmitting(true)
    setError(null)

    try {
      await organizationService.transferOwnership(workspaceSlug, selectedUserId)
      onClose()
      onTransferred()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to transfer ownership')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Transfer Workspace Ownership"
      description="Transfer primary ownership of this workspace to another active member."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-md border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
            {error}
          </div>
        )}

        <div className="rounded-md border border-amber-200 bg-amber-50/70 p-3.5 text-xs text-amber-800 space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-amber-900">
            <AlertTriangle className="size-4 shrink-0 text-amber-600" />
            <span>Irreversible Action</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            You will be demoted to <strong>Administrator</strong>. The selected user will become the sole <strong>Owner</strong> with full administrative authority, including workspace deletion.
          </p>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-700">
            Select New Owner <span className="text-rose-500">*</span>
          </label>
          <Select
            searchable
            options={memberOptions}
            value={selectedUserId}
            onChange={(val) => setSelectedUserId(val as string)}
            placeholder={
              memberOptions.length > 0
                ? 'Select an active member...'
                : 'No eligible members found'
            }
            disabled={memberOptions.length === 0}
          />
        </div>

        <div className="flex justify-end gap-2 pt-3">
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
            variant="danger"
            disabled={!selectedUserId || isSubmitting}
            loading={isSubmitting}
            className="cursor-pointer"
          >
            <Crown className="mr-1.5 size-3.5" />
            Transfer Ownership
          </Button>
        </div>
      </form>
    </Modal>
  )
}
