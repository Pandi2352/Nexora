import { Navigate, type RouteObject } from 'react-router-dom'
import { paths, workspaceSegments, type WorkspaceSegment } from '@/config/paths'
import { AppLayout } from '@/layouts/AppLayout'
import RouteErrorPage from '@/pages/errors/RouteErrorPage'
import { RequireAuth } from './guards/RequireAuth'
import { pages } from './pages'

// Replace pages.Placeholder with the real page as each module is built.
const placeholder = (segment: WorkspaceSegment): RouteObject => ({
  path: segment,
  element: <pages.Placeholder />,
})

export const workspaceRoutes: RouteObject = {
  element: <RequireAuth />,
  children: [
    {
      path: paths.workspaceRoot,
      element: <AppLayout />,
      children: [
        {
          // Pathless route: page errors render inside AppLayout's <Outlet />, keeping the shell.
          errorElement: <RouteErrorPage />,
          children: [
            { index: true, element: <Navigate to={workspaceSegments.dashboard} replace /> },
            { path: workspaceSegments.settingsMembers, element: <pages.Members /> },
            { path: workspaceSegments.account, element: <pages.Account /> },
            ...Object.values(workspaceSegments)
              .filter(
                (segment) =>
                  segment !== workspaceSegments.settingsMembers &&
                  segment !== workspaceSegments.account,
              )
              .map(placeholder),
            { path: '*', element: <pages.NotFound /> },
          ],
        },
      ],
    },
  ],
}
