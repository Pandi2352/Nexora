import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui'
import type { Workspace } from '@/types/workspace'
import { WorkspaceCard } from './WorkspaceCard'

export interface WorkspaceListProps {
  workspaces: Workspace[]
}

export function WorkspaceList({ workspaces }: WorkspaceListProps) {
  const [query, setQuery] = useState('')

  const filtered = workspaces.filter(
    (w) =>
      w.name.toLowerCase().includes(query.toLowerCase()) ||
      w.slug.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      {workspaces.length > 2 && (
        <div className="relative">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search workspaces by name or slug..."
            icon={Search}
            size="md"
          />
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="rounded-md border border-slate-200 bg-white p-8 text-center">
          <p className="text-sm font-medium text-slate-700">No workspaces match your search</p>
          <p className="mt-1 text-xs text-slate-500">Try a different query or clear the filter.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {filtered.map((workspace) => (
            <WorkspaceCard key={workspace.id} workspace={workspace} />
          ))}
        </div>
      )}
    </div>
  )
}
