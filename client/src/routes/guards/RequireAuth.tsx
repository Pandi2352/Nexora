import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/auth/auth-context'
import { RouteLoader } from '@/components/common/RouteLoader'

export function RequireAuth() {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <RouteLoader message="Verifying session..." fullscreen />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}
