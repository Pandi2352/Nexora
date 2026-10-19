import { useParams } from 'react-router-dom'

/** Active workspace slug from `/workspace/:workspaceSlug/*`. Empty outside a workspace. */
export function useWorkspaceSlug() {
  const { workspaceSlug } = useParams()
  return workspaceSlug ?? ''
}
