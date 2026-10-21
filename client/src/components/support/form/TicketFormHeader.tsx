import { ArrowLeft, Save } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button, Kbd, buttonVariants } from '@/components/ui'

interface TicketFormHeaderProps {
  title: string
  subtitle: string
  backTo: string
  isSaving: boolean
  submitLabel: string
}

/** Sticky title bar of the full-page ticket form with Cancel / Save. */
export function TicketFormHeader({
  title,
  subtitle,
  backTo,
  isSaving,
  submitLabel,
}: TicketFormHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <Link
          to={backTo}
          aria-label="Back"
          className="flex size-9 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">{title}</h1>
          <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
        </div>
      </div>
      <div className="flex items-center gap-2.5 self-end sm:self-auto">
        <span className="hidden text-xs text-slate-500 md:inline">
          <Kbd>Ctrl</Kbd> + <Kbd>S</Kbd> to save
        </span>
        <Link to={backTo} className={buttonVariants({ variant: 'outline' })}>
          Cancel
        </Link>
        <Button type="submit" variant="primary" loading={isSaving}>
          {!isSaving && <Save className="size-4" aria-hidden />}
          {submitLabel}
        </Button>
      </div>
    </div>
  )
}
