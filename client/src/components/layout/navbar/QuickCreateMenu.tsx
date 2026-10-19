import { Plus } from 'lucide-react'
import { Dropdown, DropdownItem, DropdownLabel } from '@/components/ui'
import { paths } from '@/config/paths'
import { quickActions } from '@/config/quickActions'
import { useWorkspaceSlug } from '@/hooks/useWorkspaceSlug'

export function QuickCreateMenu() {
  const slug = useWorkspaceSlug()

  return (
    <Dropdown
      label="Create new"
      menuClassName="w-72 py-1.5"
      triggerClassName="h-9 gap-1.5 bg-brand-600 px-2.5 text-sm font-medium text-white hover:bg-brand-700 focus-visible:ring-offset-2 sm:px-3"
      trigger={
        <>
          <Plus className="size-4" aria-hidden />
          <span className="hidden sm:inline">New</span>
        </>
      }
    >
      <DropdownLabel>Create</DropdownLabel>
      {quickActions.map((action) => (
        <DropdownItem
          key={action.id}
          to={paths.workspace(slug, action.segment)}
          icon={action.icon}
          label={action.label}
          description={action.description}
        />
      ))}
    </Dropdown>
  )
}
