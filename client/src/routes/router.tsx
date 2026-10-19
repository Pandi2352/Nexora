import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { paths } from '@/config/paths'
import { useAuth } from '@/context/auth/auth-context'
import { AuthLayout } from '@/layouts/AuthLayout'
import { RouteLoader } from '@/components/common/RouteLoader'
import RouteErrorPage from '@/pages/errors/RouteErrorPage'
import { pages } from './pages'
import { publicRoutes } from './publicRoutes'
import { workspaceRoutes } from './workspaceRoutes'

function RootRoute() {
  const { isAuthenticated, isLoading } = useAuth()
  if (isLoading) return <RouteLoader message="Initializing Nexora OS..." fullscreen />
  if (isAuthenticated) {
    return <Navigate to={paths.workspaces} replace />
  }
  return <pages.Welcome />
}

const router = createBrowserRouter([
  { path: paths.home, element: <RootRoute /> },
  { path: paths.welcome, element: <pages.Welcome /> },
  ...publicRoutes,
  workspaceRoutes,
  {
    element: <AuthLayout />,
    errorElement: <RouteErrorPage />,
    children: [{ path: '*', element: <pages.NotFound /> }],
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
