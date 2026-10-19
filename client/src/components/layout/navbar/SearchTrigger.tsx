import { Search } from 'lucide-react'
import { IconButton, Kbd } from '@/components/ui'

// `onOpen` opens the command palette (components/command-palette) once it is built.
export function SearchTrigger({ onOpen }: { onOpen?: () => void }) {
  return (
    <>
      <button
        type="button"
        onClick={onOpen}
        className="hidden h-9 w-64 items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500 transition-colors hover:border-slate-300 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 md:flex xl:w-80"
      >
        <Search className="size-4" aria-hidden />
        <span className="flex-1 truncate text-left">Search pages and actions…</span>
        <Kbd>Ctrl K</Kbd>
      </button>
      <IconButton aria-label="Search" onClick={onOpen} className="md:hidden">
        <Search className="size-5" />
      </IconButton>
    </>
  )
}
