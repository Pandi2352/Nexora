import { Trash2, UserCheck } from 'lucide-react'
import { Avatar, Badge, IconButton } from '@/components/ui'
import type { TeamMember } from '@/types/team'

interface TeamMemberRowProps {
  member: TeamMember
  canManage: boolean
  isRemoving: boolean
  onRemove: (userId: string, name: string) => void
}

export function TeamMemberRow({
  member,
  canManage,
  isRemoving,
  onRemove,
}: TeamMemberRowProps) {
  return (
    <div className="flex items-center justify-between p-3 transition-colors hover:bg-slate-50/60">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <Avatar name={member.name} size="sm" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-slate-900 truncate">
              {member.name}
            </span>
            {member.isLead && (
              <Badge variant="brand" size="sm" className="text-[10px] py-0 px-1.5">
                <UserCheck className="mr-0.5 size-3 inline" />
                Lead
              </Badge>
            )}
          </div>
          <p className="text-[11px] text-slate-500 truncate">{member.email}</p>
        </div>
      </div>

      {canManage && (
        <IconButton
          aria-label={`Remove ${member.name}`}
          size="sm"
          onClick={() => onRemove(member.userId, member.name)}
          disabled={isRemoving}
          className="cursor-pointer text-slate-400 hover:text-rose-600 hover:bg-rose-50 size-8"
        >
          <Trash2 className="size-3.5" />
        </IconButton>
      )}
    </div>
  )
}
