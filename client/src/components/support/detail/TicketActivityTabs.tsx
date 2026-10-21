import { useState, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface TicketActivityTabsProps {
  conversationCount: number
  historyCount: number
  conversation: ReactNode
  history: ReactNode
}

/** Switches the main column between the conversation and the history timeline. */
export function TicketActivityTabs({
  conversationCount,
  historyCount,
  conversation,
  history,
}: TicketActivityTabsProps) {
  const [tab, setTab] = useState<'conversation' | 'history'>('conversation')
  const tabs = [
    { id: 'conversation' as const, label: 'Conversation', count: conversationCount },
    { id: 'history' as const, label: 'History', count: historyCount },
  ]

  return (
    <section>
      <div
        role="tablist"
        aria-label="Ticket activity"
        className="mb-4 flex gap-1 border-b border-slate-200"
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls={`panel-${t.id}`}
            onClick={() => setTab(t.id)}
            className={cn(
              '-mb-px flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500',
              tab === t.id
                ? 'border-brand-600 text-brand-700'
                : 'border-transparent text-slate-500 hover:text-slate-800',
            )}
          >
            {t.label}
            <span className="rounded-full bg-slate-100 px-1.5 text-[10px] text-slate-600">
              {t.count}
            </span>
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
        {tab === 'conversation' ? conversation : history}
      </div>
    </section>
  )
}
