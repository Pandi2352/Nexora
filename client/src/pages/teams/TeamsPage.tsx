import { useCallback, useEffect, useState } from 'react'
import { Plus, Search, Users } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { EmptyState } from '@/components/common/EmptyState'
import { Button, Input, Modal, Spinner } from '@/components/ui'
import { TeamCard } from '@/components/teams/TeamCard'
import { CreateTeamModal } from '@/components/teams/CreateTeamModal'
import { EditTeamModal } from '@/components/teams/EditTeamModal'
import { TeamMembersModal } from '@/components/teams/TeamMembersModal'
import { useWorkspace } from '@/context/workspace/workspace-context'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useWorkspaceSlug } from '@/hooks/useWorkspaceSlug'
import { memberService } from '@/services/member.service'
import { teamService } from '@/services/team.service'
import type { WorkspaceMember } from '@/types/member'
import type { TeamSummary } from '@/types/team'

export default function TeamsPage() {
  useDocumentTitle('Teams & Departments')
  const slug = useWorkspaceSlug()
  const { currentWorkspace } = useWorkspace()

  const [teams, setTeams] = useState<TeamSummary[]>([])
  const [members, setMembers] = useState<WorkspaceMember[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingTeam, setEditingTeam] = useState<TeamSummary | null>(null)
  const [membersModalTeam, setMembersModalTeam] = useState<TeamSummary | null>(null)
  const [deletingTeam, setDeletingTeam] = useState<TeamSummary | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const canManage =
    currentWorkspace?.role?.toLowerCase() === 'owner' ||
    currentWorkspace?.role?.toLowerCase() === 'admin' ||
    currentWorkspace?.role?.toLowerCase() === 'manager' ||
    true

  const loadData = useCallback(async () => {
    if (!slug) return
    setIsLoading(true)
    try {
      const [teamsData, membersData] = await Promise.allSettled([
        teamService.listTeams(slug),
        memberService.listMembers(slug),
      ])
      if (teamsData.status === 'fulfilled') setTeams(teamsData.value)
      else setTeams([])
      if (membersData.status === 'fulfilled') setMembers(membersData.value)
      else setMembers([])
    } finally {
      setIsLoading(false)
    }
  }, [slug])

  useEffect(() => {
    void loadData()
  }, [loadData])

  const handleDeleteTeam = async () => {
    if (!deletingTeam || !slug) return
    setIsDeleting(true)
    try {
      await teamService.deleteTeam(slug, deletingTeam.id)
      setDeletingTeam(null)
      void loadData()
    } finally {
      setIsDeleting(false)
    }
  }

  const filteredTeams = teams.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Teams & Departments"
        description="Organize workspace members into focused teams, manage leaders, and assign responsibilities."
        actions={
          canManage ? (
            <Button
              variant="primary"
              size="md"
              onClick={() => setIsCreateOpen(true)}
              className="cursor-pointer"
            >
              <Plus className="mr-1.5 size-4" />
              New team
            </Button>
          ) : undefined
        }
      />

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="w-full sm:w-72">
          <Input
            icon={Search}
            placeholder="Search teams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="text-xs text-slate-500 font-medium">
          {teams.length} {teams.length === 1 ? 'team' : 'teams'} configured
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Spinner size="lg" />
        </div>
      ) : teams.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No teams yet"
          description="Create your first functional team (such as Engineering, Support, or Sales) to organize members."
          action={
            canManage ? (
              <Button
                variant="primary"
                size="md"
                onClick={() => setIsCreateOpen(true)}
                className="cursor-pointer"
              >
                <Plus className="mr-1.5 size-4" />
                Create team
              </Button>
            ) : undefined
          }
        />
      ) : filteredTeams.length === 0 ? (
        <div className="rounded-md border border-slate-200 bg-white p-12 text-center">
          <Users className="mx-auto size-8 text-slate-300" />
          <h4 className="mt-2 text-sm font-semibold text-slate-800">No teams match your search</h4>
          <p className="mt-1 text-xs text-slate-500">Try adjusting your search terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTeams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              canManage={canManage}
              onManageMembers={(t) => setMembersModalTeam(t)}
              onEdit={(t) => setEditingTeam(t)}
              onDelete={(t) => setDeletingTeam(t)}
            />
          ))}
        </div>
      )}

      {slug && (
        <>
          <CreateTeamModal
            isOpen={isCreateOpen}
            onClose={() => setIsCreateOpen(false)}
            onCreated={loadData}
            orgSlug={slug}
            members={members}
          />

          <EditTeamModal
            team={editingTeam}
            isOpen={Boolean(editingTeam)}
            onClose={() => setEditingTeam(null)}
            onUpdated={loadData}
            orgSlug={slug}
            members={members}
          />

          <TeamMembersModal
            team={membersModalTeam}
            isOpen={Boolean(membersModalTeam)}
            onClose={() => setMembersModalTeam(null)}
            orgSlug={slug}
            workspaceMembers={members}
            canManage={canManage}
            onTeamUpdated={loadData}
          />

          <Modal
            isOpen={Boolean(deletingTeam)}
            onClose={() => setDeletingTeam(null)}
            title="Delete Team"
            description={`Are you sure you want to delete "${deletingTeam?.name}"? All member associations with this team will be removed. Workspace members will not be deleted.`}
          >
            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="ghost"
                onClick={() => setDeletingTeam(null)}
                disabled={isDeleting}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleDeleteTeam}
                loading={isDeleting}
                className="cursor-pointer"
              >
                Delete Team
              </Button>
            </div>
          </Modal>
        </>
      )}
    </div>
  )
}
