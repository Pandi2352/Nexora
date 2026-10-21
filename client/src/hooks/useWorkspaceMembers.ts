import { useEffect, useMemo, useState } from 'react'
import type { SelectOption } from '@/components/ui'
import { memberService } from '@/services/member.service'
import type { WorkspaceMember } from '@/types/member'
import { useWorkspaceSlug } from './useWorkspaceSlug'

/** Active workspace members as select options and an id → name lookup. */
export function useWorkspaceMembers() {
  const slug = useWorkspaceSlug()
  const [members, setMembers] = useState<WorkspaceMember[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    let active = true
    memberService
      .listMembers(slug)
      .then((list) => active && setMembers((list ?? []).filter((m) => m.status === 'active')))
      .catch(() => active && setMembers([]))
      .finally(() => active && setIsLoading(false))
    return () => {
      active = false
    }
  }, [slug])

  const options: SelectOption[] = useMemo(
    () => members.map((m) => ({ value: m.userId, label: m.name || m.email, description: m.email })),
    [members],
  )
  const nameById = useMemo(
    () => new Map(members.map((m) => [m.userId, m.name || m.email])),
    [members],
  )

  return { members, options, nameById, isLoading }
}
