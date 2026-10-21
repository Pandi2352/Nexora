/** "45 min", "6 h", "3 d 4 h". With `coarse`, only the largest unit ("23 h", "3 d"). */
export function formatDuration(minutes: number | null | undefined, coarse = false): string {
  if (minutes === null || minutes === undefined) return '—'
  const m = Math.max(0, Math.round(minutes))
  if (m < 60) return `${m} min`
  const hours = Math.floor(m / 60)
  if (hours < 24) return coarse || !(m % 60) ? `${hours} h` : `${hours} h ${m % 60} min`
  const days = Math.floor(hours / 24)
  return coarse || !(hours % 24) ? `${days} d` : `${days} d ${hours % 24} h`
}

/** "in 2 h", "3 d ago", "just now" relative to now. */
export function formatRelative(
  iso: string | undefined,
  now: Date = new Date(),
  coarse = false,
): string {
  if (!iso) return '—'
  const diffMin = Math.round((new Date(iso).getTime() - now.getTime()) / 60000)
  if (Math.abs(diffMin) < 1) return 'just now'
  const text = formatDuration(Math.abs(diffMin), coarse)
  return diffMin > 0 ? `in ${text}` : `${text} ago`
}

const dateTime = new Intl.DateTimeFormat(undefined, {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
})

export function formatDateTime(iso: string | undefined): string {
  return iso ? dateTime.format(new Date(iso)) : '—'
}
