import { ChevronRight, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Avatar, Badge, type BadgeVariant } from '@/components/ui'
import { paths } from '@/config/paths'
import type { Workspace } from '@/types/workspace'

interface WorkspaceCardProps {
  workspace: Workspace
}

function getRoleBadgeVariant(role?: string): BadgeVariant {
  switch (role?.toLowerCase()) {
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

export function WorkspaceCard({ workspace }: WorkspaceCardProps) {
  const roleName = workspace.role || 'member'
  const badgeVariant = getRoleBadgeVariant(roleName)

  return (
    <Link
      to={paths.workspace(workspace.slug)}
      className="group flex items-center justify-between p-4 rounded-md border border-slate-200 bg-white hover:border-brand-300 hover:bg-slate-50/60 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <Avatar name={workspace.name} shape="square" size="md" />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-900 truncate group-hover:text-brand-600 transition-colors">
              {workspace.name}
            </h3>
            <Badge variant={badgeVariant} size="sm" className="capitalize">
              {roleName}
            </Badge>
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
            <span className="font-mono text-[11px] text-slate-400">/{workspace.slug}</span>
            {workspace.membersCount !== undefined && (
              <span className="flex items-center gap-1">
                <Users className="size-3 text-slate-400" />
                {workspace.membersCount} {workspace.membersCount === 1 ? 'member' : 'members'}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 pl-4 shrink-0">
        <span className="text-xs font-medium text-slate-500 group-hover:text-brand-600 group-hover:translate-x-0.5 transition-all">
          Open
        </span>
        <ChevronRight className="size-4 text-slate-400 group-hover:text-brand-600 group-hover:translate-x-0.5 transition-all" />
      </div>
    </Link>
  )
}
