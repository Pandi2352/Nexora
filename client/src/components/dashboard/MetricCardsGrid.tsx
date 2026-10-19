import { Mail, ShieldCheck, Users, UsersRound } from 'lucide-react'

interface MetricCardsGridProps {
  membersCount: number
  teamsCount: number
  invitationsCount: number
  eventsCount: number
}

export function MetricCardsGrid({
  membersCount,
  teamsCount,
  invitationsCount,
  eventsCount,
}: MetricCardsGridProps) {
  const cards = [
    {
      title: 'Active Members',
      value: membersCount,
      sub: 'Colleagues & staff',
      icon: Users,
      color: 'bg-brand-50 text-brand-700 border-brand-200',
    },
    {
      title: 'Functional Teams',
      value: teamsCount,
      sub: 'Configured rosters',
      icon: UsersRound,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      title: 'Pending Invites',
      value: invitationsCount,
      sub: 'Awaiting registration',
      icon: Mail,
      color: 'bg-sky-50 text-sky-700 border-sky-200',
    },
    {
      title: 'Audit Events',
      value: eventsCount,
      sub: 'Security operations',
      icon: ShieldCheck,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div
            key={card.title}
            className="flex items-center justify-between rounded-md border border-slate-200 bg-white p-5 transition-colors hover:border-slate-300"
          >
            <div>
              <span className="text-xs font-medium text-slate-500">{card.title}</span>
              <div className="mt-1 text-2xl font-bold font-mono text-slate-900">
                {card.value}
              </div>
              <span className="mt-0.5 block text-[11px] text-slate-400">{card.sub}</span>
            </div>

            <div
              className={`flex size-11 items-center justify-center rounded-md border ${card.color}`}
            >
              <Icon className="size-5" />
            </div>
          </div>
        )
      })}
    </div>
  )
}
