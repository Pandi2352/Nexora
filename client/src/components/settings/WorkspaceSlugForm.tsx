import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle, Link as LinkIcon } from 'lucide-react'
import { Button, Input } from '@/components/ui'
import { paths, workspaceSegments } from '@/config/paths'
import { organizationService } from '@/services/organization.service'
import type { Workspace } from '@/types/workspace'

interface WorkspaceSlugFormProps {
  workspace: Workspace
  canManage: boolean
  onSlugChanged: (newSlug: string) => void
}

export function WorkspaceSlugForm({
  workspace,
  canManage,
  onSlugChanged,
}: WorkspaceSlugFormProps) {
  const navigate = useNavigate()
  const [slug, setSlug] = useState(workspace.slug)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isChanged = slug.trim().toLowerCase() !== workspace.slug.toLowerCase()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isChanged || !slug.trim()) return

    setIsSaving(true)
    setError(null)

    try {
      const updated = await organizationService.update(workspace.slug, {
        slug: slug.trim().toLowerCase(),
      })
      onSlugChanged(updated.slug)
      navigate(paths.workspace(updated.slug, workspaceSegments.settingsGeneral), {
        replace: true,
      })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update workspace URL')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="rounded-md border border-slate-200 bg-white p-6">
      <div className="border-b border-slate-100 pb-5">
        <h3 className="text-base font-semibold text-slate-900">Workspace URL & Slug</h3>
        <p className="text-xs text-slate-500">
          The unique identifier used in your team’s workspace URLs.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        {error && (
          <div className="rounded-md border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
            {error}
          </div>
        )}

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-700">
            Workspace Slug
          </label>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-xs text-slate-500 font-mono">
              nexora.app/workspace/
            </span>
            <div className="flex-1">
              <Input
                value={slug}
                onChange={(e) =>
                  setSlug(
                    e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9-]/g, '-')
                      .replace(/-+/g, '-'),
                  )
                }
                disabled={!canManage || isSaving}
                placeholder="acme-corp"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2.5 rounded-md border border-amber-200 bg-amber-50/60 p-3 text-xs text-amber-800">
          <AlertCircle className="size-4 shrink-0 mt-0.5 text-amber-600" />
          <div>
            <span className="font-semibold">Note: </span>
            Changing your workspace URL will invalidate existing browser bookmarks and shared direct links.
          </div>
        </div>

        {canManage && (
          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              variant="primary"
              disabled={!isChanged || isSaving}
              loading={isSaving}
              className="cursor-pointer"
            >
              <LinkIcon className="mr-1.5 size-3.5" />
              Update Slug
            </Button>
          </div>
        )}
      </form>
    </div>
  )
}
