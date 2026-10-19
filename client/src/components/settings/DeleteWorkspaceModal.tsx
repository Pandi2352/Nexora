import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertOctagon, Trash2 } from 'lucide-react'
import { Button, Input, Modal } from '@/components/ui'
import { paths } from '@/config/paths'
import { organizationService } from '@/services/organization.service'

interface DeleteWorkspaceModalProps {
  isOpen: boolean
  onClose: () => void
  workspaceName: string
  workspaceSlug: string
}

export function DeleteWorkspaceModal({
  isOpen,
  onClose,
  workspaceName,
  workspaceSlug,
}: DeleteWorkspaceModalProps) {
  const navigate = useNavigate()
  const [confirmText, setConfirmText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isMatched = confirmText.trim().toLowerCase() === workspaceName.trim().toLowerCase()

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isMatched) return

    setIsDeleting(true)
    setError(null)

    try {
      await organizationService.delete(workspaceSlug)
      navigate(paths.workspaces, { replace: true })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete workspace')
      setIsDeleting(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Workspace"
      description="Permanently delete this workspace and all associated resources."
    >
      <form onSubmit={handleDelete} className="space-y-4">
        {error && (
          <div className="rounded-md border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
            {error}
          </div>
        )}

        <div className="rounded-md border border-rose-200 bg-rose-50/70 p-3.5 text-xs text-rose-800 space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-rose-900">
            <AlertOctagon className="size-4 shrink-0 text-rose-600" />
            <span>Warning: Destructive Action</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            This will soft-delete the workspace &quot;<strong>{workspaceName}</strong>&quot;. All member access, projects, teams, and data will be immediately inaccessible.
          </p>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-700">
            Please type <strong className="text-slate-900">{workspaceName}</strong> to confirm:
          </label>
          <Input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={workspaceName}
            autoFocus
            required
          />
        </div>

        <div className="flex justify-end gap-2 pt-3">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isDeleting}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="danger"
            disabled={!isMatched || isDeleting}
            loading={isDeleting}
            className="cursor-pointer"
          >
            <Trash2 className="mr-1.5 size-3.5" />
            Permanently Delete
          </Button>
        </div>
      </form>
    </Modal>
  )
}
