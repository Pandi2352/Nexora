import { useState } from 'react'
import { SearchInput, Select, type SelectOption } from '@/components/ui'
import type { WorkspaceMember } from '@/types/member'
import { MemberRow } from './MemberRow'

const ROLE_FILTER_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'All Roles' },
  { value: 'owner', label: 'Owner' },
  { value: 'admin', label: 'Admin' },
  { value: 'manager', label: 'Manager' },
  { value: 'member', label: 'Member' },
  { value: 'support_agent', label: 'Support Agent' },
]

interface MembersListProps {
  members: WorkspaceMember[]
  orgSlug: string
  canManage: boolean
  currentUserId?: string
  onUpdated: () => void
}

export function MembersList({
  members,
  orgSlug,
  canManage,
  currentUserId,
  onUpdated,
}: MembersListProps) {
  const [query, setQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  const filtered = members.filter((m) => {
    const matchesQuery =
      m.name.toLowerCase().includes(query.toLowerCase()) ||
      m.email.toLowerCase().includes(query.toLowerCase())
    const matchesRole = roleFilter === 'all' || m.role.toLowerCase() === roleFilter
    return matchesQuery && matchesRole
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex-1">
          <SearchInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or email..."
            size="md"
          />
        </div>
        <div className="w-full sm:w-48 shrink-0">
          <Select
            value={roleFilter}
            options={ROLE_FILTER_OPTIONS}
            onChange={(val) => setRoleFilter(val)}
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="py-2.5 px-4">Member</th>
              <th className="py-2.5 px-4">Role</th>
              <th className="py-2.5 px-4 hidden sm:table-cell">Joined</th>
              <th className="py-2.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((member) => (
              <MemberRow
                key={member.id}
                member={member}
                orgSlug={orgSlug}
                canManage={canManage}
                currentUserId={currentUserId}
                onUpdated={onUpdated}
              />
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="p-8 text-center text-xs text-slate-500">
            No members match your search or filter criteria.
          </div>
        )}
      </div>
    </div>
  )
}
