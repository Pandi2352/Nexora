import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { paths } from '@/config/paths'
import { AuthLayout } from '@/layouts/AuthLayout'
import RouteErrorPage from '@/pages/errors/RouteErrorPage'
import { pages } from './pages'
import { publicRoutes } from './publicRoutes'
import { workspaceRoutes } from './workspaceRoutes'

const router = createBrowserRouter([
  { path: paths.home, element: <Navigate to={paths.workspaces} replace /> },
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
