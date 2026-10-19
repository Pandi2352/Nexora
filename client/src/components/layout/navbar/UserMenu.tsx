import { Bell, Check, ChevronDown, LayoutGrid, LogOut, Settings, UserRound } from 'lucide-react'
import { Avatar, Dropdown, DropdownItem, DropdownLabel, DropdownSeparator } from '@/components/ui'
import { paths, workspaceSegments as s } from '@/config/paths'
import { mockMembershipRole, mockUser } from '@/data/user'
import { mockWorkspaces } from '@/data/workspaces'
import { useWorkspaceSlug } from '@/hooks/useWorkspaceSlug'

export function UserMenu() {
  const slug = useWorkspaceSlug()
  const workspace = mockWorkspaces.find((w) => w.slug === slug)

  return (
    <Dropdown
      label={`Account menu for ${mockUser.name}`}
      menuClassName="w-64 py-1.5"
      triggerClassName="gap-2 p-1 hover:bg-slate-100"
      trigger={
        <>
          <Avatar name={mockUser.name} size="sm" />
          <span className="hidden text-left lg:block">
            <span className="block text-sm font-medium leading-4 text-slate-900">
              {mockUser.name}
            </span>
            <span className="block text-[11px] text-slate-500">{mockMembershipRole}</span>
          </span>
          <ChevronDown className="hidden size-4 text-slate-400 lg:block" aria-hidden />
        </>
      }
    >
      <div className="px-3 py-2">
        <p className="truncate text-sm font-semibold text-slate-900">{mockUser.name}</p>
        <p className="truncate text-xs text-slate-500">{mockUser.email}</p>
        <p className="mt-1 text-xs text-slate-500">
          {mockMembershipRole} · {workspace?.name}
        </p>
      </div>
      <DropdownSeparator />
      <DropdownItem to={paths.workspace(slug, s.account)} icon={UserRound} label="My account" />
      <DropdownItem to={paths.workspace(slug, s.notifications)} icon={Bell} label="Notifications" />
      <DropdownItem
        to={paths.workspace(slug, s.settingsGeneral)}
        icon={Settings}
        label="Workspace settings"
      />
      <DropdownSeparator />
      <DropdownLabel>Switch workspace</DropdownLabel>
      {mockWorkspaces.map((w) => (
        <DropdownItem
          key={w.id}
          to={paths.workspace(w.slug)}
          label={w.name}
          trailing={
            w.slug === slug && (
              <Check className="mt-0.5 size-4 text-brand-600" aria-label="Current" />
            )
          }
        />
      ))}
      <DropdownItem to={paths.workspaces} icon={LayoutGrid} label="All workspaces" />
      <DropdownSeparator />
      <DropdownItem icon={LogOut} label="Sign out" hint="Needs auth API" disabled />
    </Dropdown>
  )
}
