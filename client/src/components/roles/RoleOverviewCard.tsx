import { Users } from 'lucide-react'
import { Badge } from '@/components/ui'
import type { RoleDefinition } from '@/types/role'
import { RoleBadge } from './RoleBadge'

interface RoleOverviewCardProps {
  role: RoleDefinition
  isSelected: boolean
  isCurrentRole: boolean
  onSelect: () => void
}

export function RoleOverviewCard({
  role,
  isSelected,
  isCurrentRole,
  onSelect,
}: RoleOverviewCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex flex-col justify-between rounded-md border p-4 text-left transition-colors cursor-pointer ${
        isSelected
          ? 'border-brand-500 bg-brand-50/30 ring-1 ring-brand-500'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
      }`}
    >
      <div>
        <div className="flex items-center justify-between gap-2">
          <RoleBadge role={role.slug} size="sm" />
          {isCurrentRole && (
            <Badge variant="brand" size="sm" className="text-[10px] py-0 px-1.5">
              Your Role
            </Badge>
          )}
        </div>
        <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {role.description}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500">
        <span className="flex items-center gap-1">
          <Users className="size-3 text-slate-400" />
          {role.memberCount ?? 0} {role.memberCount === 1 ? 'member' : 'members'}
        </span>
        <span className="font-medium text-slate-400">
          {role.permissions.length} capabilities
        </span>
      </div>
    </button>
  )
}
