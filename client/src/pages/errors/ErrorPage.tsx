import { useParams } from 'react-router-dom'
import { ErrorState } from '@/components/common/ErrorState'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { fromStatus } from '@/lib/errors'

/** Error page for any status: `/error/:status` or `<ErrorPage status={403} />`. */
export default function ErrorPage({ status }: { status?: number }) {
  const params = useParams()
  const code = status ?? Number(params.status)
  const error = fromStatus(Number.isInteger(code) ? code : 404)

  useDocumentTitle(error.definition.title)
  return <ErrorState error={error} />
}
