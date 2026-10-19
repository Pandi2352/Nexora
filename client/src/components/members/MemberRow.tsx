import { useState } from 'react'
import { UserMinus } from 'lucide-react'
import { Avatar, Badge, type BadgeVariant, IconButton, Select, type SelectOption } from '@/components/ui'
import { memberService } from '@/services/member.service'
import type { WorkspaceMember } from '@/types/member'

interface MemberRowProps {
  member: WorkspaceMember
  orgSlug: string
  canManage: boolean
  currentUserId?: string
  onUpdated: () => void
}

const ROW_ROLE_OPTIONS: SelectOption[] = [
  { value: 'admin', label: 'Admin' },
  { value: 'manager', label: 'Manager' },
  { value: 'member', label: 'Member' },
  { value: 'support_agent', label: 'Support Agent' },
]

function getRoleBadgeVariant(role: string): BadgeVariant {
  switch (role.toLowerCase()) {
    case 'owner':
      return 'brand'
    case 'admin':
      return 'neutral'
    case 'manager':
      return 'warning'
    default:
      return 'neutral'
  }
}

export function MemberRow({
  member,
  orgSlug,
  canManage,
  currentUserId,
  onUpdated,
}: MemberRowProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const isSelf = currentUserId === member.userId
  const isOwner = member.role.toLowerCase() === 'owner'

  const handleRoleChange = async (newRole: string) => {
    if (newRole === member.role) return
    setIsUpdating(true)
    try {
      await memberService.updateRole(orgSlug, member.id, newRole)
      onUpdated()
    } finally {
      setIsUpdating(false)
    }
  }

  const handleRemove = async () => {
    if (!window.confirm(`Are you sure you want to remove ${member.name} from the workspace?`)) return
    setIsUpdating(true)
    try {
      await memberService.removeMember(orgSlug, member.id)
      onUpdated()
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <Avatar name={member.name} size="sm" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">
              {member.name} {isSelf && <span className="text-xs font-normal text-slate-400">(You)</span>}
            </p>
            <p className="text-xs text-slate-500 truncate">{member.email}</p>
          </div>
        </div>
      </td>

      <td className="py-3 px-4">
        {canManage && !isOwner && !isSelf ? (
          <div className="w-36">
            <Select
              size="sm"
              value={member.role}
              disabled={isUpdating}
              options={ROW_ROLE_OPTIONS}
              onChange={(newRole) => handleRoleChange(newRole)}
            />
          </div>
        ) : (
          <Badge variant={getRoleBadgeVariant(member.role)} size="sm" className="capitalize">
            {member.role}
          </Badge>
        )}
      </td>

      <td className="py-3 px-4 text-xs text-slate-500 hidden sm:table-cell">
        {new Date(member.joinedAt).toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })}
      </td>

      <td className="py-3 px-4 text-right">
        {canManage && !isOwner && !isSelf && (
          <IconButton
            aria-label={`Remove ${member.name}`}
            onClick={handleRemove}
            disabled={isUpdating}
            className="text-slate-400 hover:text-rose-600 hover:bg-rose-50"
          >
            <UserMinus className="size-4" />
          </IconButton>
        )}
      </td>
    </tr>
  )
}
