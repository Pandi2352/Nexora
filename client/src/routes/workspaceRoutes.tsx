import { Navigate, type RouteObject } from 'react-router-dom'
import { paths, workspaceSegments, type WorkspaceSegment } from '@/config/paths'
import { AppLayout } from '@/layouts/AppLayout'
import RouteErrorPage from '@/pages/errors/RouteErrorPage'
import { pages } from './pages'

// Replace pages.Placeholder with the real page as each module is built.
const placeholder = (segment: WorkspaceSegment): RouteObject => ({
  path: segment,
  element: <pages.Placeholder />,
})

export const workspaceRoutes: RouteObject = {
  path: paths.workspaceRoot,
  element: <AppLayout />,
  children: [
    {
      // Pathless route: page errors render inside AppLayout's <Outlet />, keeping the shell.
      errorElement: <RouteErrorPage />,
      children: [
        { index: true, element: <Navigate to={workspaceSegments.dashboard} replace /> },
        ...Object.values(workspaceSegments).map(placeholder),
        { path: '*', element: <pages.NotFound /> },
      ],
    },
  ],
}
