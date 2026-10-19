import { useEffect, useState } from 'react'
import { Plus, Users } from 'lucide-react'
import { Button, Modal, Select, Spinner, type SelectOption } from '@/components/ui'
import { teamService } from '@/services/team.service'
import type { WorkspaceMember } from '@/types/member'
import type { TeamDetail, TeamSummary } from '@/types/team'
import { TeamMemberRow } from './TeamMemberRow'

interface TeamMembersModalProps {
  team: TeamSummary | null
  isOpen: boolean
  onClose: () => void
  orgSlug: string
  workspaceMembers: WorkspaceMember[]
  canManage: boolean
  onTeamUpdated: () => void
}

export function TeamMembersModal({
  team,
  isOpen,
  onClose,
  orgSlug,
  workspaceMembers,
  canManage,
  onTeamUpdated,
}: TeamMembersModalProps) {
  const [detail, setDetail] = useState<TeamDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedToAdd, setSelectedToAdd] = useState<string[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [removingId, setRemovingId] = useState<string | null>(null)

  const fetchDetail = async (teamId: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await teamService.getTeam(orgSlug, teamId)
      setDetail(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load team members')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen && team) {
      void fetchDetail(team.id)
      setSelectedToAdd([])
    } else {
      setDetail(null)
    }
  }, [isOpen, team])

  const existingUserIds = new Set(detail?.members.map((m) => m.userId) ?? [])
  const availableOptions: SelectOption[] = workspaceMembers
    .filter((m) => !existingUserIds.has(m.userId))
    .map((m) => ({
      value: m.userId,
      label: m.name,
      description: m.email,
    }))

  const handleAddMembers = async () => {
    if (!team || selectedToAdd.length === 0) return
    setIsAdding(true)
    try {
      const updated = await teamService.addMembers(orgSlug, team.id, selectedToAdd)
      setDetail(updated)
      setSelectedToAdd([])
      onTeamUpdated()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to add members')
    } finally {
      setIsAdding(false)
    }
  }

  const handleRemoveMember = async (userId: string, name: string) => {
    if (!team) return
    if (!window.confirm(`Are you sure you want to remove ${name} from this team?`)) return
    setRemovingId(userId)
    try {
      await teamService.removeMember(orgSlug, team.id, userId)
      await fetchDetail(team.id)
      onTeamUpdated()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to remove member')
    } finally {
      setRemovingId(null)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={team ? `${team.name} — Members` : 'Team Members'}
      description="View and assign workspace members belonging to this team."
      className="max-w-xl"
    >
      <div className="space-y-4">
        {error && (
          <div className="rounded-md border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
            {error}
          </div>
        )}

        {canManage && (
          <div className="rounded-md border border-slate-200 bg-slate-50/70 p-3 space-y-2.5">
            <label className="text-xs font-semibold text-slate-700 block">
              Add Members to Team
            </label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="flex-1">
                <Select
                  multiple
                  searchable
                  options={availableOptions}
                  value={selectedToAdd}
                  onChange={(val) => setSelectedToAdd(val)}
                  placeholder={
                    availableOptions.length > 0
                      ? 'Select workspace members...'
                      : 'All members are already in this team'
                  }
                  disabled={availableOptions.length === 0}
                />
              </div>
              <Button
                variant="primary"
                size="md"
                onClick={handleAddMembers}
                disabled={selectedToAdd.length === 0 || isAdding}
                loading={isAdding}
                className="cursor-pointer shrink-0"
              >
                <Plus className="mr-1 size-4" />
                Add
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-1">
            Members ({detail?.members.length ?? 0})
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Spinner size="md" />
            </div>
          ) : detail?.members && detail.members.length > 0 ? (
            <div className="divide-y divide-slate-100 rounded-md border border-slate-200 bg-white max-h-72 overflow-y-auto">
              {detail.members.map((member) => (
                <TeamMemberRow
                  key={member.id}
                  member={member}
                  canManage={canManage}
                  isRemoving={removingId === member.userId}
                  onRemove={handleRemoveMember}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-md border border-dashed border-slate-200 p-8 text-center">
              <Users className="mx-auto size-8 text-slate-300" />
              <p className="mt-2 text-xs font-medium text-slate-600">No members yet</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Use the selector above to add workspace members to this team.
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="ghost" onClick={onClose} className="cursor-pointer text-xs">
            Close
          </Button>
        </div>
      </div>
    </Modal>
  )
}
