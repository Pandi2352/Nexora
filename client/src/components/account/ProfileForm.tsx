import { useState, type FormEvent } from 'react'
import { Check, Globe, Mail, User as UserIcon } from 'lucide-react'
import { Button, Input, Select, type SelectOption } from '@/components/ui'
import { useAuth } from '@/context/auth/auth-context'
import { extractApiError } from '@/lib/api-client'
import { userService } from '@/services/user.service'

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

const LOCALE_OPTIONS: SelectOption[] = [
  { value: 'en-US', label: 'English (United States)' },
  { value: 'en-GB', label: 'English (United Kingdom)' },
  { value: 'fr-FR', label: 'Français (France)' },
  { value: 'de-DE', label: 'Deutsch (Deutschland)' },
  { value: 'ja-JP', label: '日本語 (Japan)' },
]

export function ProfileForm() {
  const { user, setUser } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [timezone, setTimezone] = useState(user?.timezone || 'UTC')
  const [locale, setLocale] = useState(user?.locale || 'en-US')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSuccessMsg(null)
    setErrorMsg(null)

    try {
      const updated = await userService.updateProfile({
        name: name.trim(),
        timezone,
        locale,
      })
      if (user) {
        setUser({ ...user, ...updated })
      }
      setSuccessMsg('Profile information updated successfully')
    } catch (err) {
      const parsed = extractApiError(err)
      setErrorMsg(parsed.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      {successMsg && (
        <div className="flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-700">
          <Check className="size-4 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="rounded-md border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
          {errorMsg}
        </div>
      )}

      <Input
        label="Full Name"
        icon={UserIcon}
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <Input
        label="Work Email"
        type="email"
        icon={Mail}
        value={user?.email || 'admin@nexora.local'}
        readOnly
        disabled
        hint="To change your primary email address, contact your platform administrator."
      />

      <Select
        label="Timezone"
        icon={Globe}
        value={timezone}
        options={TIMEZONE_OPTIONS}
        onChange={(val) => setTimezone(val)}
        searchable
      />

      <Select
        label="Language / Locale"
        value={locale}
        options={LOCALE_OPTIONS}
        onChange={(val) => setLocale(val)}
      />

      <div className="pt-2">
        <Button type="submit" variant="primary" loading={isSubmitting}>
          Save Profile Changes
        </Button>
      </div>
    </form>
  )
}
