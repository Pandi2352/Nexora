import { PageHeader } from '@/components/common/PageHeader'
import { CreateWorkspaceForm } from '@/components/workspaces/CreateWorkspaceForm'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export default function CreateWorkspacePage() {
  useDocumentTitle('Create workspace')

  return (
    <div className="w-full max-w-xl mx-auto py-6">
      <PageHeader
        title="Create workspace"
        description="Set up a multi-tenant business operations space for your organization."
      />
      <CreateWorkspaceForm />
    </div>
  )
}
