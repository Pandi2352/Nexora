import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { paths } from '@/config/paths'
import { defaultWorkspaceSlug } from '@/data/workspaces'
import { AuthLayout } from '@/layouts/AuthLayout'
import RouteErrorPage from '@/pages/errors/RouteErrorPage'
import { pages } from './pages'
import { publicRoutes } from './publicRoutes'
import { workspaceRoutes } from './workspaceRoutes'

const router = createBrowserRouter([
  // Temporary until auth: send "/" to the default workspace.
  { path: paths.home, element: <Navigate to={paths.workspace(defaultWorkspaceSlug)} replace /> },
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
