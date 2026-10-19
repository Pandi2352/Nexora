import { useState, type FormEvent } from 'react'
import { Building2, Globe, Link2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Select, type SelectOption } from '@/components/ui'
import { paths } from '@/config/paths'
import { useWorkspace } from '@/context/workspace/workspace-context'
import { extractApiError } from '@/lib/api-client'

const TIMEZONE_OPTIONS: SelectOption[] = [
  { value: 'UTC', label: 'UTC (Universal Coordinated Time)' },
  { value: 'America/New_York', label: 'America / New York (EST/EDT)' },
  { value: 'America/Los_Angeles', label: 'America / Los Angeles (PST/PDT)' },
  { value: 'Europe/London', label: 'Europe / London (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Europe / Paris (CET/CEST)' },
  { value: 'Asia/Tokyo', label: 'Asia / Tokyo (JST)' },
  { value: 'Asia/Kolkata', label: 'Asia / Kolkata (IST)' },
  { value: 'Australia/Sydney', label: 'Australia / Sydney (AEST)' },
]

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

      <Select
        label="Workspace Timezone"
        icon={Globe}
        value={timezone}
        options={TIMEZONE_OPTIONS}
        onChange={(val) => setTimezone(val)}
        searchable
      />

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
