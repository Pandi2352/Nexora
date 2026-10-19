import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import { Spinner } from '@/components/ui'
import { GeneralProfileForm } from '@/components/settings/GeneralProfileForm'
import { WorkspaceSlugForm } from '@/components/settings/WorkspaceSlugForm'
import { DangerZoneCard } from '@/components/settings/DangerZoneCard'
import { TransferOwnershipModal } from '@/components/settings/TransferOwnershipModal'
import { DeleteWorkspaceModal } from '@/components/settings/DeleteWorkspaceModal'
import { paths } from '@/config/paths'
import { useAuth } from '@/context/auth/auth-context'
import { useWorkspace } from '@/context/workspace/workspace-context'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useWorkspaceSlug } from '@/hooks/useWorkspaceSlug'
import { memberService } from '@/services/member.service'
import { organizationService } from '@/services/organization.service'
import type { WorkspaceMember } from '@/types/member'
import type { Workspace } from '@/types/workspace'

export default function GeneralSettingsPage() {
  useDocumentTitle('General Settings')
  const slug = useWorkspaceSlug()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { currentWorkspace, refreshWorkspaces } = useWorkspace()

  const [workspace, setWorkspace] = useState<Workspace | null>(currentWorkspace || null)
  const [members, setMembers] = useState<WorkspaceMember[]>([])
  const [isLoading, setIsLoading] = useState(!currentWorkspace)
  const [isTransferOpen, setIsTransferOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  const isOwner = currentWorkspace?.role?.toLowerCase() === 'owner'
  const canManage = isOwner || currentWorkspace?.role?.toLowerCase() === 'admin'

  const loadData = useCallback(async () => {
    if (!slug) return
    if (!workspace) setIsLoading(true)
    try {
      const [wsData, membersData] = await Promise.allSettled([
        organizationService.get(slug),
        memberService.listMembers(slug),
      ])
      if (wsData.status === 'fulfilled') setWorkspace(wsData.value)
      else if (currentWorkspace) setWorkspace(currentWorkspace)
      if (membersData.status === 'fulfilled') setMembers(membersData.value)
      else setMembers([])
    } finally {
      setIsLoading(false)
    }
  }, [slug, currentWorkspace, workspace])

  useEffect(() => {
    void loadData()
  }, [loadData])

  const handleLeaveWorkspace = async () => {
    if (!slug) return
    if (!window.confirm('Are you sure you want to leave this workspace?')) return
    setIsLeaving(true)
    try {
      await organizationService.leave(slug)
      await refreshWorkspaces()
      navigate(paths.workspaces, { replace: true })
    } finally {
      setIsLeaving(false)
    }
  }

  const handleTransferred = async () => {
    await refreshWorkspaces()
    void loadData()
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="General Settings"
        description="Manage workspace identity, operating parameters, URL paths, and ownership."
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Spinner size="lg" />
        </div>
      ) : workspace ? (
        <div className="space-y-6 max-w-4xl">
          <GeneralProfileForm
            workspace={workspace}
            canManage={canManage}
            onUpdated={(updated) => {
              setWorkspace(updated)
              void refreshWorkspaces()
            }}
          />

          <WorkspaceSlugForm
            workspace={workspace}
            canManage={canManage}
            onSlugChanged={(newSlug) => {
              setWorkspace((prev) => (prev ? { ...prev, slug: newSlug } : prev))
              void refreshWorkspaces()
            }}
          />

          <DangerZoneCard
            isOwner={isOwner}
            onTransferOwnership={() => setIsTransferOpen(true)}
            onDeleteWorkspace={() => setIsDeleteOpen(true)}
            onLeaveWorkspace={handleLeaveWorkspace}
            isLeaving={isLeaving}
          />

          <TransferOwnershipModal
            isOpen={isTransferOpen}
            onClose={() => setIsTransferOpen(false)}
            workspaceSlug={workspace.slug}
            members={members}
            currentUserId={user?.id}
            onTransferred={handleTransferred}
          />

          <DeleteWorkspaceModal
            isOpen={isDeleteOpen}
            onClose={() => setIsDeleteOpen(false)}
            workspaceName={workspace.name}
            workspaceSlug={workspace.slug}
          />
        </div>
      ) : null}
    </div>
  )
}
