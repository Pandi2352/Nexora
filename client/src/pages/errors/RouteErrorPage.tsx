import { useRouteError } from 'react-router-dom'
import { ErrorState } from '@/components/common/ErrorState'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { resolveError } from '@/lib/errors'

/** Route `errorElement`. Captures whatever was thrown and renders it inside the parent layout. */
export default function RouteErrorPage() {
  const error = resolveError(useRouteError())
  useDocumentTitle(error.definition.title)
  return <ErrorState error={error} />
}
