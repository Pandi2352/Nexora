import type { ReactNode } from 'react'
import { usePermission } from '@/hooks/usePermission'

interface CanProps {
  permission?: string
  anyOf?: string[]
  allOf?: string[]
  fallback?: ReactNode
  children: ReactNode
}

export function Can({
  permission,
  anyOf,
  allOf,
  fallback = null,
  children,
}: CanProps) {
  const { hasPermission, hasAny, hasAll, isLoading } = usePermission()

  if (isLoading) return null

  let allowed = true

  if (permission && !hasPermission(permission)) {
    allowed = false
  }

  if (anyOf && anyOf.length > 0 && !hasAny(anyOf)) {
    allowed = false
  }

  if (allOf && allOf.length > 0 && !hasAll(allOf)) {
    allowed = false
  }

  return allowed ? <>{children}</> : <>{fallback}</>
}
