import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, ChevronDown, ChevronUp, Circle, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui'
import { paths, workspaceSegments } from '@/config/paths'

interface OnboardingChecklistProps {
  slug: string
  hasMembers: boolean
  hasTeams: boolean
}

export function OnboardingChecklist({
  slug,
  hasMembers,
  hasTeams,
}: OnboardingChecklistProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  const steps = [
    {
      id: 'ws',
      title: 'Workspace Initialized',
      description: 'Your multi-tenant organization foundation is active and secure.',
      completed: true,
      href: paths.workspace(slug, workspaceSegments.settingsGeneral),
    },
    {
      id: 'members',
      title: 'Invite Team Members',
      description: 'Add colleagues to your workspace with role-based access.',
      completed: hasMembers,
      href: paths.workspace(slug, workspaceSegments.settingsMembers),
    },
    {
      id: 'teams',
      title: 'Create Functional Teams',
      description: 'Organize members into focused departments with team leads.',
      completed: hasTeams,
      href: paths.workspace(slug, workspaceSegments.settingsTeams),
    },
    {
      id: 'roles',
      title: 'Review Permissions Matrix',
      description: 'Inspect security boundaries and capabilities across all 5 roles.',
      completed: true,
      href: paths.workspace(slug, workspaceSegments.settingsRoles),
    },
  ]

  const completedCount = steps.filter((s) => s.completed).length
  const progressPct = Math.round((completedCount / steps.length) * 100)

  return (
    <div className="rounded-md border border-brand-200/80 bg-brand-50/20 p-5 transition-colors">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-md border border-brand-200 bg-brand-100 text-brand-700">
            <Sparkles className="size-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-slate-900">
                Workspace Setup Checklist
              </h3>
              <span className="rounded-md bg-brand-100 px-2 py-0.5 text-[11px] font-bold text-brand-800">
                {progressPct}% Completed
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Complete these steps to unlock the full potential of your Nexora OS workspace.
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="cursor-pointer text-slate-500"
        >
          {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </Button>
      </div>

      {isExpanded && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-brand-100/80">
          {steps.map((step, idx) => (
            <Link
              key={step.id}
              to={step.href}
              className="flex flex-col justify-between rounded-md border border-slate-200/80 bg-white p-3.5 transition-colors hover:border-brand-300 hover:bg-slate-50/50 cursor-pointer"
            >
              <div>
                <div className="flex items-center gap-2">
                  {step.completed ? (
                    <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                  ) : (
                    <Circle className="size-4 text-slate-300 shrink-0" />
                  )}
                  <span className="text-xs font-semibold text-slate-800">
                    {idx + 1}. {step.title}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-slate-500 line-clamp-2">
                  {step.description}
                </p>
              </div>

              <div className="mt-3 text-right text-[11px] font-medium text-brand-600 hover:text-brand-700">
                {step.completed ? 'View details →' : 'Get started →'}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
