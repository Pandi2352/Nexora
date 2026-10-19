import { useCallback, useEffect, useMemo, useState } from 'react'
import { Calendar, FileText, PhoneCall, Plus, Zap } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { EmptyState } from '@/components/common/EmptyState'
import { Button, Select, Spinner, type SelectOption } from '@/components/ui'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useWorkspaceSlug } from '@/hooks/useWorkspaceSlug'
import { crmService } from '@/services/crm.service'
import type { ActivityType, Company, CreateActivityPayload, SalesActivity } from '@/types/crm'
import { ActivityTimeline } from '@/components/crm/activities/ActivityTimeline'
import { LogActivityModal } from '@/components/crm/activities/LogActivityModal'

const TYPE_FILTER_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'All Activities' },
  { value: 'cold_call', label: 'Cold Calls' },
  { value: 'meeting', label: 'Meetings' },
  { value: 'proposal_submitted', label: 'Proposals' },
  { value: 'follow_up', label: 'Follow Ups' },
  { value: 'email', label: 'Emails' },
]

export default function ActivitiesPage() {
  useDocumentTitle('Sales Activities')
  const slug = useWorkspaceSlug()

  const [activities, setActivities] = useState<SalesActivity[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [companyFilter, setCompanyFilter] = useState<string>('all')
  const [modalOpen, setModalOpen] = useState(false)

  const loadData = useCallback(async () => {
    if (!slug) return
    setIsLoading(true)
    try {
      const [actData, compData] = await Promise.allSettled([
        crmService.listActivities(slug, {
          type: typeFilter !== 'all' ? (typeFilter as ActivityType) : undefined,
          companyId: companyFilter !== 'all' ? companyFilter : undefined,
        }),
        crmService.listCompanies(slug),
      ])
      if (actData.status === 'fulfilled') setActivities(actData.value || [])
      if (compData.status === 'fulfilled') setCompanies(compData.value || [])
    } finally {
      setIsLoading(false)
    }
  }, [slug, typeFilter, companyFilter])

  useEffect(() => {
    void loadData()
  }, [loadData])

  const companyOptions: SelectOption[] = useMemo(
    () => companies.map((c) => ({ value: c.id, label: c.name })),
    [companies],
  )

  const handleSaveActivity = async (payload: CreateActivityPayload) => {
    if (!slug) return
    await crmService.logActivity(slug, payload)
    await loadData()
  }

  const handleDeleteActivity = async (activityId: string) => {
    if (!slug) return
    if (!window.confirm('Are you sure you want to delete this activity?')) return
    await crmService.deleteActivity(slug, activityId)
    await loadData()
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sales Activities"
        description="Logs and follow-ups for cold calls, discovery meetings, and submitted proposals."
        actions={
          <Button size="sm" onClick={() => setModalOpen(true)}>
            <Plus className="size-4 mr-1.5" />
            Log Activity
          </Button>
        }
      />

      {/* KPI stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-md border border-slate-200 bg-white p-3">
          <p className="text-xs text-slate-500">Total Activities</p>
          <p className="text-xl font-bold text-slate-900 mt-1">{activities.length}</p>
        </div>
        <div className="rounded-md border border-purple-200 bg-purple-50/40 p-3">
          <p className="text-xs text-purple-700 flex items-center gap-1">
            <PhoneCall className="size-3 text-purple-500" /> Cold Calls
          </p>
          <p className="text-xl font-bold text-purple-900 mt-1">
            {activities.filter((a) => a.type === 'cold_call').length}
          </p>
        </div>
        <div className="rounded-md border border-blue-200 bg-blue-50/40 p-3">
          <p className="text-xs text-blue-700 flex items-center gap-1">
            <Calendar className="size-3 text-blue-500" /> Meetings
          </p>
          <p className="text-xl font-bold text-blue-900 mt-1">
            {activities.filter((a) => a.type === 'meeting').length}
          </p>
        </div>
        <div className="rounded-md border border-emerald-200 bg-emerald-50/40 p-3">
          <p className="text-xs text-emerald-700 flex items-center gap-1">
            <FileText className="size-3 text-emerald-500" /> Proposals
          </p>
          <p className="text-xl font-bold text-emerald-900 mt-1">
            {activities.filter((a) => a.type === 'proposal_submitted').length}
          </p>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <Select
          value={typeFilter}
          onChange={(val) => setTypeFilter(val)}
          options={TYPE_FILTER_OPTIONS}
          className="w-44"
        />
        <Select
          value={companyFilter}
          onChange={(val) => setCompanyFilter(val)}
          options={[{ value: 'all', label: 'All Companies' }, ...companyOptions]}
          className="w-48"
        />
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex h-48 items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : activities.length === 0 ? (
        <EmptyState
          icon={Zap}
          title="No sales activities recorded"
          description="Log cold calls, discovery meetings, and submitted proposals to build your activity history."
          action={
            <Button size="sm" onClick={() => setModalOpen(true)}>
              <Plus className="size-4 mr-1.5" />
              Log Activity
            </Button>
          }
        />
      ) : (
        <ActivityTimeline
          activities={activities}
          companies={companies}
          onDelete={handleDeleteActivity}
        />
      )}

      <LogActivityModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveActivity}
        companyOptions={companyOptions}
      />
    </div>
  )
}
