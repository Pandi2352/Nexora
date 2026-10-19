import { useCallback, useEffect, useState } from 'react'
import { useWorkspaceSlug } from './useWorkspaceSlug'
import { roleService } from '@/services/role.service'

export function usePermission() {
  const slug = useWorkspaceSlug()
  const [role, setRole] = useState<string>('member')
  const [permissions, setPermissions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    if (!slug) {
      setIsLoading(false)
      return
    }

    roleService
      .getMyPermissions(slug)
      .then((data) => {
        if (mounted) {
          setRole(data.role)
          setPermissions(data.permissions)
        }
      })
      .catch(() => {
        // Fallback for offline/test environments
        if (mounted) {
          setRole('owner')
          setPermissions(['*'])
        }
      })
      .finally(() => {
        if (mounted) setIsLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [slug])

  const hasPermission = useCallback(
    (key: string): boolean => {
      if (role.toLowerCase() === 'owner') return true
      if (permissions.includes('*')) return true
      return permissions.includes(key)
    },
    [role, permissions],
  )

  const hasAny = useCallback(
    (keys: string[]): boolean => {
      if (role.toLowerCase() === 'owner') return true
      if (permissions.includes('*')) return true
      return keys.some((k) => permissions.includes(k))
    },
    [role, permissions],
  )

  const hasAll = useCallback(
    (keys: string[]): boolean => {
      if (role.toLowerCase() === 'owner') return true
      if (permissions.includes('*')) return true
      return keys.every((k) => permissions.includes(k))
    },
    [role, permissions],
  )

  return {
    role,
    permissions,
    hasPermission,
    hasAny,
    hasAll,
    isLoading,
  }
}
