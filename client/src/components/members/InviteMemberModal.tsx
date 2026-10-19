import { useState, type FormEvent } from 'react'
import { Mail } from 'lucide-react'
import { Button, Input, Modal, Select, type SelectOption } from '@/components/ui'
import { extractApiError } from '@/lib/api-client'
import { memberService } from '@/services/member.service'

interface InviteMemberModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  orgSlug: string
}

const ROLE_OPTIONS: SelectOption[] = [
  {
    value: 'member',
    label: 'Member',
    description: 'Standard access to collaborate on assigned projects and operations.',
  },
  {
    value: 'manager',
    label: 'Manager',
    description: 'Can manage projects, workflows, and assign team tasks.',
  },
  {
    value: 'admin',
    label: 'Admin',
    description: 'Full access to organization settings, team management, and member invites.',
  },
  {
    value: 'support_agent',
    label: 'Support Agent',
    description: 'Specialized access for handling customer support tickets and live inquiries.',
  },
]

export function InviteMemberModal({
  isOpen,
  onClose,
  onSuccess,
  orgSlug,
}: InviteMemberModalProps) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('member')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setIsSubmitting(true)
    setError(null)

    try {
      await memberService.sendInvitation(orgSlug, {
        email: email.trim(),
        role,
      })
      setEmail('')
      setRole('member')
      onSuccess()
      onClose()
    } catch (err) {
      const parsed = extractApiError(err)
      setError(parsed.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Invite Team Member"
      description="Send an invitation email to collaborate in this workspace."
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-md border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
            {error}
          </div>
        )}

        <Input
          label="Colleague Email Address"
          type="email"
          placeholder="colleague@company.com"
          icon={Mail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoFocus
        />

        <Select
          label="Workspace Role"
          value={role}
          options={ROLE_OPTIONS}
          onChange={(val) => setRole(val)}
        />

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={isSubmitting}>
            Send Invitation
          </Button>
        </div>
      </form>
    </Modal>
  )
}
