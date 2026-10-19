import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, UserPlus } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Button, Spinner } from '@/components/ui'
import { paths, workspaceSegments } from '@/config/paths'
import { useAuth } from '@/context/auth/auth-context'
import { useWorkspace } from '@/context/workspace/workspace-context'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useWorkspaceSlug } from '@/hooks/useWorkspaceSlug'
import { auditService } from '@/services/audit.service'
import { memberService } from '@/services/member.service'
import { teamService } from '@/services/team.service'
import type { AuditLogItem } from '@/types/audit'
import type { TeamSummary } from '@/types/team'
import { MetricCardsGrid } from '@/components/dashboard/MetricCardsGrid'
import { OnboardingChecklist } from '@/components/dashboard/OnboardingChecklist'
import { RecentActivityWidget } from '@/components/dashboard/RecentActivityWidget'
import { ActivityVelocityChart } from '@/components/dashboard/charts/ActivityVelocityChart'
import {
  TeamDistributionChart,
  type DistributionItem,
} from '@/components/dashboard/charts/TeamDistributionChart'

const PALETTE = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6', '#f43f5e']

export default function DashboardPage() {
  useDocumentTitle('Dashboard')
  const slug = useWorkspaceSlug()
  const { user } = useAuth()
  const { currentWorkspace } = useWorkspace()

  const [membersCount, setMembersCount] = useState(1)
  const [teams, setTeams] = useState<TeamSummary[]>([])
  const [invitesCount, setInvitesCount] = useState(0)
  const [recentEvents, setRecentEvents] = useState<AuditLogItem[]>([])
  const [totalEvents, setTotalEvents] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const loadDashboardData = useCallback(async () => {
    if (!slug) return
    setIsLoading(true)
    try {
      const [membersRes, invitesRes, teamsRes, auditRes] = await Promise.allSettled([
        memberService.listMembers(slug),
        memberService.listInvitations(slug),
        teamService.listTeams(slug),
        auditService.listLogs(slug, { limit: 5 }),
      ])

      if (membersRes.status === 'fulfilled') {
        setMembersCount(membersRes.value.length || 1)
      }
      if (invitesRes.status === 'fulfilled') {
        setInvitesCount(invitesRes.value.length)
      }
      if (teamsRes.status === 'fulfilled') {
        setTeams(teamsRes.value)
      }
      if (auditRes.status === 'fulfilled') {
        setRecentEvents(auditRes.value.items)
        setTotalEvents(auditRes.value.pagination.total)
      }
    } finally {
      setIsLoading(false)
    }
  }, [slug])

  useEffect(() => {
    void loadDashboardData()
  }, [loadDashboardData])

  const teamDistribution: DistributionItem[] =
    teams.length > 0
      ? teams.map((team, idx) => ({
          name: team.name,
          value: Math.max(team.memberCount, 1),
          color: PALETTE[idx % PALETTE.length] ?? '#4f46e5',
        }))
      : [
          { name: 'Engineering', value: 4, color: '#4f46e5' },
          { name: 'Operations', value: 2, color: '#06b6d4' },
          { name: 'Support', value: 1, color: '#10b981' },
        ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description={`Operational overview and real-time health metrics for ${currentWorkspace?.name || 'your workspace'}. Welcome back, ${user?.name || 'Administrator'}.`}
        actions={
          slug ? (
            <div className="flex items-center gap-2">
              <Link to={paths.workspace(slug, workspaceSegments.settingsMembers)}>
                <Button variant="outline" size="sm" className="cursor-pointer">
                  <UserPlus className="mr-1.5 size-3.5" />
                  Invite Member
                </Button>
              </Link>
              <Link to={paths.workspace(slug, workspaceSegments.settingsTeams)}>
                <Button variant="primary" size="sm" className="cursor-pointer">
                  <Plus className="mr-1.5 size-3.5" />
                  New Team
                </Button>
              </Link>
            </div>
          ) : undefined
        }
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          {slug && (
            <OnboardingChecklist
              slug={slug}
              hasMembers={membersCount > 1}
              hasTeams={teams.length > 0}
            />
          )}

          <MetricCardsGrid
            membersCount={membersCount}
            teamsCount={teams.length}
            invitationsCount={invitesCount}
            eventsCount={totalEvents}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <ActivityVelocityChart />
            <TeamDistributionChart
              data={teamDistribution}
              totalCount={membersCount}
            />
          </div>

          {slug && (
            <RecentActivityWidget slug={slug} events={recentEvents} />
          )}
        </>
      )}
    </div>
  )
}
