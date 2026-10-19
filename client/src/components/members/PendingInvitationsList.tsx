import { Mail, Trash2 } from 'lucide-react'
import { Badge, IconButton } from '@/components/ui'
import { memberService } from '@/services/member.service'
import type { WorkspaceInvitation } from '@/types/member'

interface PendingInvitationsListProps {
  invitations: WorkspaceInvitation[]
  orgSlug: string
  canManage: boolean
  onUpdated: () => void
}

export function PendingInvitationsList({
  invitations,
  orgSlug,
  canManage,
  onUpdated,
}: PendingInvitationsListProps) {
  const handleRevoke = async (inviteId: string) => {
    if (!window.confirm('Are you sure you want to revoke this invitation?')) return
    await memberService.revokeInvitation(orgSlug, inviteId)
    onUpdated()
  }

  if (invitations.length === 0) {
    return (
      <div className="rounded-md border border-slate-200 bg-white p-8 text-center">
        <Mail className="mx-auto size-6 text-slate-300 mb-2" />
        <p className="text-sm font-medium text-slate-700">No pending invitations</p>
        <p className="text-xs text-slate-500 mt-1">
          When you invite teammates who haven't accepted yet, they will appear here.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          <tr>
            <th className="py-2.5 px-4">Invited Email</th>
            <th className="py-2.5 px-4">Role</th>
            <th className="py-2.5 px-4 hidden sm:table-cell">Expires</th>
            <th className="py-2.5 px-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {invitations.map((inv) => (
            <tr key={inv.id} className="hover:bg-slate-50/50">
              <td className="py-3 px-4">
                <span className="font-medium text-slate-800">{inv.email}</span>
              </td>
              <td className="py-3 px-4">
                <Badge variant="neutral" size="sm" className="capitalize">
                  {inv.role}
                </Badge>
              </td>
              <td className="py-3 px-4 text-xs text-slate-500 hidden sm:table-cell">
                {new Date(inv.expiresAt).toLocaleDateString()}
              </td>
              <td className="py-3 px-4 text-right">
                {canManage && (
                  <IconButton
                    aria-label="Revoke invitation"
                    onClick={() => handleRevoke(inv.id)}
                    className="text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="size-4" />
                  </IconButton>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
