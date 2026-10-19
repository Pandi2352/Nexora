import type { RouteObject } from 'react-router-dom'
import { paths } from '@/config/paths'
import { AuthLayout } from '@/layouts/AuthLayout'
import RouteErrorPage from '@/pages/errors/RouteErrorPage'
import { pages } from './pages'

// Auth pages and workspace selection (minimal layout, no sidebar).
export const publicRoutes: RouteObject[] = [
  {
    element: <AuthLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      { path: paths.login, element: <pages.Placeholder title="Log in" /> },
      { path: paths.register, element: <pages.Placeholder title="Create account" /> },
      { path: paths.forgotPassword, element: <pages.Placeholder title="Forgot password" /> },
      { path: paths.workspaces, element: <pages.Workspaces /> },
      { path: paths.newWorkspace, element: <pages.Placeholder title="Create workspace" /> },
      { path: paths.error, element: <pages.Error /> },
    ],
  },
]
