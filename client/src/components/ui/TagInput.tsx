import { X } from 'lucide-react'
import { useId, useState, type KeyboardEvent } from 'react'
import { cn } from '@/lib/cn'

export interface TagInputProps {
  label?: string
  value: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  hint?: string
  maxTags?: number
  maxLength?: number
}

/** Free-form tags: Enter or comma adds, Backspace on empty input removes the last one. */
export function TagInput({
  label,
  value,
  onChange,
  placeholder = 'Type and press Enter',
  hint,
  maxTags = 10,
  maxLength = 30,
}: TagInputProps) {
  const id = useId()
  const [draft, setDraft] = useState('')
  const isFull = value.length >= maxTags

  const add = (raw: string) => {
    const tag = raw.trim().toLowerCase().slice(0, maxLength)
    if (tag && !value.includes(tag) && !isFull) onChange([...value, tag])
    setDraft('')
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      add(draft)
    } else if (e.key === 'Backspace' && !draft && value.length > 0) {
      onChange(value.slice(0, -1))
    }
  }

  return (
    <div>
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <div
        className={cn(
          'flex min-h-10 flex-wrap items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2 py-1.5',
          'focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-100',
        )}
      >
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-md bg-slate-100 py-0.5 pl-2 pr-1 text-xs text-slate-700"
          >
            {tag}
            <button
              type="button"
              onClick={() => onChange(value.filter((t) => t !== tag))}
              aria-label={`Remove tag ${tag}`}
              className="rounded-md p-0.5 text-slate-500 hover:bg-slate-200 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              <X className="size-3" />
            </button>
          </span>
        ))}
        <input
          id={id}
          value={draft}
          disabled={isFull}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => draft && add(draft)}
          placeholder={isFull ? `Up to ${maxTags} tags` : placeholder}
          className="min-w-24 flex-1 bg-transparent px-1 text-sm text-slate-900 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed"
        />
      </div>
      {hint && <p className="mt-1.5 text-xs text-slate-500">{hint}</p>}
    </div>
  )
}
