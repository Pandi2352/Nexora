export function SkipLink({ targetId = 'main-content' }: { targetId?: string }) {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:border focus:border-slate-200 focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-slate-900"
    >
      Skip to content
    </a>
  )
}
