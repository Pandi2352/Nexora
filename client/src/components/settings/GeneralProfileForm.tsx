import { useState } from 'react'
import { Check } from 'lucide-react'
import { Avatar, Button, Input, Select, type SelectOption } from '@/components/ui'
import { organizationService } from '@/services/organization.service'
import type { Workspace } from '@/types/workspace'

interface GeneralProfileFormProps {
  workspace: Workspace
  canManage: boolean
  onUpdated: (updated: Workspace) => void
}

const TIMEZONE_OPTIONS: SelectOption[] = [
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { value: 'America/New_York', label: 'Eastern Time (US & Canada)' },
  { value: 'America/Chicago', label: 'Central Time (US & Canada)' },
  { value: 'America/Denver', label: 'Mountain Time (US & Canada)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (US & Canada)' },
  { value: 'Europe/London', label: 'London, Edinburgh (GMT)' },
  { value: 'Europe/Paris', label: 'Paris, Berlin, Rome (CET)' },
  { value: 'Asia/Dubai', label: 'Dubai, Abu Dhabi (GST)' },
  { value: 'Asia/Kolkata', label: 'Mumbai, New Delhi, Chennai (IST)' },
  { value: 'Asia/Singapore', label: 'Singapore, Kuala Lumpur (SGT)' },
  { value: 'Asia/Tokyo', label: 'Tokyo, Osaka (JST)' },
  { value: 'Australia/Sydney', label: 'Sydney, Melbourne (AEST)' },
]

const LOCALE_OPTIONS: SelectOption[] = [
  { value: 'en-US', label: 'English (United States)' },
  { value: 'en-GB', label: 'English (United Kingdom)' },
  { value: 'es-ES', label: 'Spanish (Spain)' },
  { value: 'fr-FR', label: 'French (France)' },
  { value: 'de-DE', label: 'German (Germany)' },
  { value: 'ja-JP', label: 'Japanese (Japan)' },
]

export function GeneralProfileForm({
  workspace,
  canManage,
  onUpdated,
}: GeneralProfileFormProps) {
  const [name, setName] = useState(workspace.name)
  const [timezone, setTimezone] = useState(workspace.timezone || 'UTC')
  const [locale, setLocale] = useState(workspace.locale || 'en-US')
  const [isSaving, setIsSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const updated = await organizationService.update(workspace.slug, {
        name: name.trim(),
        timezone,
        locale,
      })
      onUpdated(updated)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update workspace')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="rounded-md border border-slate-200 bg-white p-6">
      <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
        <Avatar name={name || workspace.name} size="lg" shape="square" />
        <div>
          <h3 className="text-base font-semibold text-slate-900">Workspace Profile</h3>
          <p className="text-xs text-slate-500">
            Configure your company details, regional settings, and operating timezone.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        {error && (
          <div className="rounded-md border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
            {error}
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-700">
            <Check className="size-4 shrink-0" />
            <span>Workspace profile updated successfully.</span>
          </div>
        )}

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-700">
            Workspace Name <span className="text-rose-500">*</span>
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!canManage || isSaving}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">
              Primary Timezone
            </label>
            <Select
              searchable
              options={TIMEZONE_OPTIONS}
              value={timezone}
              onChange={(val) => setTimezone(val as string)}
              disabled={!canManage || isSaving}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">
              Display Locale
            </label>
            <Select
              options={LOCALE_OPTIONS}
              value={locale}
              onChange={(val) => setLocale(val as string)}
              disabled={!canManage || isSaving}
            />
          </div>
        </div>

        {canManage && (
          <div className="flex justify-end pt-3">
            <Button
              type="submit"
              variant="primary"
              loading={isSaving}
              className="cursor-pointer"
            >
              Save Changes
            </Button>
          </div>
        )}
      </form>
    </div>
  )
}
