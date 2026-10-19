import { useState, type FormEvent } from 'react'
import { Building2, Link2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button, Input } from '@/components/ui'
import { paths } from '@/config/paths'
import { useWorkspace } from '@/context/workspace/workspace-context'
import { extractApiError } from '@/lib/api-client'

export function CreateWorkspaceForm() {
  const navigate = useNavigate()
  const { createWorkspace } = useWorkspace()

  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [isSlugCustomized, setIsSlugCustomized] = useState(false)
  const [timezone, setTimezone] = useState('UTC')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const handleNameChange = (val: string) => {
    setName(val)
    if (!isSlugCustomized) {
      const generated = val
        .normalize('NFKD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
      setSlug(generated)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setFormError('Workspace name is required')
      return
    }

    setIsSubmitting(true)
    setFormError(null)

    try {
      const created = await createWorkspace({
        name: name.trim(),
        slug: slug.trim() || undefined,
        timezone,
      })
      navigate(paths.workspace(created.slug))
    } catch (err) {
      const parsed = extractApiError(err)
      setFormError(parsed.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-md border border-slate-200 bg-white p-6">
      {formError && (
        <div className="rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          {formError}
        </div>
      )}

      <div>
        <Input
          label="Workspace Name"
          placeholder="e.g. Acme Operations"
          icon={Building2}
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          required
          autoFocus
        />
      </div>

      <div>
        <Input
          label="Workspace URL Slug"
          placeholder="e.g. acme-operations"
          icon={Link2}
          value={slug}
          onChange={(e) => {
            setIsSlugCustomized(true)
            setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))
          }}
          hint={`nexora.app/workspace/${slug || 'your-slug'}`}
          required
        />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
          Workspace Timezone
        </label>
        <div className="relative">
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full min-h-10 px-3 py-2 text-sm rounded-md border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-brand-500 cursor-pointer"
          >
            <option value="UTC">UTC (Universal Coordinated Time)</option>
            <option value="America/New_York">America / New York (EST/EDT)</option>
            <option value="America/Los_Angeles">America / Los Angeles (PST/PDT)</option>
            <option value="Europe/London">Europe / London (GMT/BST)</option>
            <option value="Europe/Paris">Europe / Paris (CET/CEST)</option>
            <option value="Asia/Tokyo">Asia / Tokyo (JST)</option>
            <option value="Asia/Kolkata">Asia / Kolkata (IST)</option>
            <option value="Australia/Sydney">Australia / Sydney (AEST)</option>
          </select>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate(paths.workspaces)}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={isSubmitting}>
          Create workspace
        </Button>
      </div>
    </form>
  )
}
