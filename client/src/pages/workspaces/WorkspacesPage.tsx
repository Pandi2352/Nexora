import { PageHeader } from '@/components/common/PageHeader'
import { WorkspaceList } from '@/components/workspaces/WorkspaceList'
import { mockWorkspaces } from '@/data/workspaces'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export default function WorkspacesPage() {
  useDocumentTitle('Workspaces')

  return (
    <div className="w-full max-w-4xl mx-auto">
      <PageHeader title="Your workspaces" description="Choose a workspace to continue." />
      <WorkspaceList workspaces={mockWorkspaces} />
    </div>
  )
}
