import { Construction } from 'lucide-react'
import { EmptyState } from '@/components/common/EmptyState'
import { PageHeader } from '@/components/common/PageHeader'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useNavTrail } from '@/hooks/useNavTrail'

/** Temporary page for routes whose module isn't built yet. Title comes from the sidebar config. */
export default function PlaceholderPage({ title }: { title?: string }) {
  const trail = useNavTrail()
  const pageTitle = title ?? trail.at(-1)?.label ?? 'Page'
  useDocumentTitle(pageTitle)

  return (
    <>
      <PageHeader title={pageTitle} />
      <EmptyState
        icon={Construction}
        title="Not built yet"
        description="This page will be built in a later milestone."
      />
    </>
  )
}
