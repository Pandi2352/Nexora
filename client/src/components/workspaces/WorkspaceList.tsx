import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Avatar } from '@/components/ui'
import { paths } from '@/config/paths'
import type { Workspace } from '@/types/workspace'

export function WorkspaceList({ workspaces }: { workspaces: Workspace[] }) {
  return (
    <ul className="divide-y divide-slate-200 rounded-md border border-slate-200 bg-white">
      {workspaces.map((workspace) => (
        <li key={workspace.id}>
          <Link
            to={paths.workspace(workspace.slug)}
            className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary-600"
          >
            <Avatar name={workspace.name} shape="square" />
            <span className="flex-1 text-sm font-medium text-slate-900">{workspace.name}</span>
            <ChevronRight className="size-4 text-slate-400" aria-hidden />
          </Link>
        </li>
      ))}
    </ul>
  )
}
