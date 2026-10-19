import { Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui'
import { WorkspaceList } from '@/components/workspaces/WorkspaceList'
import { paths } from '@/config/paths'
import { useWorkspace } from '@/context/workspace/workspace-context'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export default function WorkspacesPage() {
  useDocumentTitle('Your workspaces')
  const { workspaces, isLoading } = useWorkspace()

  return (
    <div className="w-full max-w-4xl mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          title="Your workspaces"
          description="Choose an operational workspace to continue, or create a new one."
        />
        <Link to={paths.newWorkspace} className="shrink-0">
          <Button variant="primary">
            <Plus className="size-4" />
            New workspace
          </Button>
        </Link>
      </div>

      {workspaces.length === 0 && !isLoading ? (
        <div className="rounded-md border border-slate-200 bg-white p-12 text-center">
          <h3 className="text-base font-semibold text-slate-900">No workspaces yet</h3>
          <p className="mt-1 text-sm text-slate-500 max-w-md mx-auto">
            You don't belong to any organization yet. Create a new workspace to start managing your
            operations, team members, and projects.
          </p>
          <div className="mt-6">
            <Link to={paths.newWorkspace}>
              <Button variant="primary">
                <Plus className="size-4" />
                Create your first workspace
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <WorkspaceList workspaces={workspaces} />
      )}
    </div>
  )
}
