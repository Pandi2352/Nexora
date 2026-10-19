import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/auth/auth-context'
import { Skeleton } from '@/components/ui/Skeleton'

export function RequireAuth() {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <Skeleton className="h-12 w-64 rounded-md" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/register" state={{ from: location }} replace />
  }

  return <Outlet />
}
