import { useState, type FormEvent } from 'react'
import { Check, KeyRound } from 'lucide-react'
import { Button, Input } from '@/components/ui'
import { extractApiError } from '@/lib/api-client'
import { userService } from '@/services/user.service'

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSuccessMsg(null)
    setErrorMsg(null)

    if (newPassword.length < 8) {
      setErrorMsg('New password must be at least 8 characters long')
      return
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('New passwords do not match')
      return
    }

    setIsSubmitting(true)
    try {
      await userService.changePassword({ currentPassword, newPassword })
      setSuccessMsg('Your password has been changed. Other active sessions were signed out.')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
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
        label="Current Password"
        type="password"
        icon={KeyRound}
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        required
      />

      <Input
        label="New Password"
        type="password"
        icon={KeyRound}
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        showPasswordToggle
        showPasswordStrength
        required
        hint="Must be at least 8 characters with letters, numbers, and symbols."
      />

      <Input
        label="Confirm New Password"
        type="password"
        icon={KeyRound}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        showPasswordToggle
        required
      />

      <div className="pt-2">
        <Button type="submit" variant="primary" loading={isSubmitting}>
          Update Password
        </Button>
      </div>
    </form>
  )
}
