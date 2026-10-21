import { Tag } from 'lucide-react'

export function TicketTags({ tags, max = 3 }: { tags: string[]; max?: number }) {
  if (tags.length === 0) return null
  const shown = tags.slice(0, max)
  const extra = tags.length - shown.length

  return (
    <span className="flex flex-wrap items-center gap-1">
      {shown.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[11px] text-slate-600"
        >
          <Tag className="size-2.5" aria-hidden />
          {tag}
        </span>
      ))}
      {extra > 0 && <span className="text-[11px] text-slate-500">+{extra}</span>}
    </span>
  )
}
