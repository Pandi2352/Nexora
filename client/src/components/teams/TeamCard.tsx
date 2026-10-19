import { Edit, MoreVertical, Trash2, UserCheck, Users } from 'lucide-react'
import {
  Avatar,
  Badge,
  Button,
  Dropdown,
  DropdownItem,
  DropdownSeparator,
} from '@/components/ui'
import type { TeamSummary } from '@/types/team'

interface TeamCardProps {
  team: TeamSummary
  canManage: boolean
  onManageMembers: (team: TeamSummary) => void
  onEdit: (team: TeamSummary) => void
  onDelete: (team: TeamSummary) => void
}

export function TeamCard({
  team,
  canManage,
  onManageMembers,
  onEdit,
  onDelete,
}: TeamCardProps) {
  return (
    <div className="flex flex-col justify-between rounded-md border border-slate-200 bg-white p-5 transition-colors hover:border-slate-300">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-base font-semibold text-slate-900">
                {team.name}
              </h3>
              <Badge variant="neutral" size="sm">
                <Users className="mr-1 size-3 inline" />
                {team.memberCount} {team.memberCount === 1 ? 'member' : 'members'}
              </Badge>
            </div>
            <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 min-h-8">
              {team.description || 'No description provided.'}
            </p>
          </div>

          {canManage && (
            <Dropdown
              label="Team actions"
              trigger={
                <span className="inline-flex size-8 cursor-pointer items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                  <MoreVertical className="size-4" />
                </span>
              }
              align="end"
              menuClassName="w-44 py-1"
            >
              <DropdownItem
                label="Manage members"
                icon={Users}
                onClick={() => onManageMembers(team)}
              />
              <DropdownItem
                label="Edit team"
                icon={Edit}
                onClick={() => onEdit(team)}
              />
              <DropdownSeparator />
              <DropdownItem
                label="Delete team"
                icon={Trash2}
                onClick={() => onDelete(team)}
              />
            </Dropdown>
          )}
        </div>

        <div className="mt-4 flex items-center gap-2.5 rounded-md border border-slate-100 bg-slate-50/70 p-2.5">
          {team.lead ? (
            <>
              <Avatar name={team.lead.name} size="sm" />
              <div className="min-w-0 flex-1 text-xs">
                <div className="flex items-center gap-1.5 font-medium text-slate-800">
                  <span className="truncate">{team.lead.name}</span>
                  <Badge variant="brand" size="sm" className="text-[10px] py-0 px-1.5">
                    Lead
                  </Badge>
                </div>
                <div className="truncate text-slate-500">{team.lead.email}</div>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <UserCheck className="size-4 text-slate-400" />
              <span>No team lead assigned</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 border-t border-slate-100 pt-3">
        <Button
          variant="outline"
          size="sm"
          className="w-full cursor-pointer justify-center text-xs"
          onClick={() => onManageMembers(team)}
        >
          <Users className="mr-1.5 size-3.5" />
          Manage members
        </Button>
      </div>
    </div>
  )
}
