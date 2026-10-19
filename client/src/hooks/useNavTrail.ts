import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { useWorkspaceSlug } from '@/hooks/useWorkspaceSlug'
import { findNavTrail } from '@/lib/navigation'

export function useNavTrail() {
  const { pathname } = useLocation()
  const slug = useWorkspaceSlug()
  return useMemo(() => findNavTrail(pathname, slug), [pathname, slug])
}
