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
            { path: workspaceSegments.dashboard, element: <pages.Dashboard /> },
            { path: workspaceSegments.settingsGeneral, element: <pages.GeneralSettings /> },
            { path: workspaceSegments.settingsMembers, element: <pages.Members /> },
            { path: workspaceSegments.settingsTeams, element: <pages.Teams /> },
            { path: workspaceSegments.settingsRoles, element: <pages.Roles /> },
            { path: workspaceSegments.settingsSecurity, element: <pages.SecuritySettings /> },
            { path: workspaceSegments.crmCompanies, element: <pages.Companies /> },
            { path: workspaceSegments.crmContacts, element: <pages.Contacts /> },
            { path: workspaceSegments.crmLeads, element: <pages.Leads /> },
            { path: workspaceSegments.crmActivities, element: <pages.CrmActivities /> },
            { path: workspaceSegments.crmOpportunities, element: <pages.Opportunities /> },
            { path: workspaceSegments.crmBusinessUnits, element: <pages.BusinessUnits /> },
            { path: workspaceSegments.activity, element: <pages.Activity /> },
            { path: workspaceSegments.account, element: <pages.Account /> },
            ...Object.values(workspaceSegments)
              .filter(
                (segment) =>
                  segment !== workspaceSegments.dashboard &&
                  segment !== workspaceSegments.crmCompanies &&
                  segment !== workspaceSegments.crmContacts &&
                  segment !== workspaceSegments.crmLeads &&
                  segment !== workspaceSegments.crmActivities &&
                  segment !== workspaceSegments.crmOpportunities &&
                  segment !== workspaceSegments.crmBusinessUnits &&
                  segment !== workspaceSegments.settingsGeneral &&
                  segment !== workspaceSegments.settingsMembers &&
                  segment !== workspaceSegments.settingsTeams &&
                  segment !== workspaceSegments.settingsRoles &&
                  segment !== workspaceSegments.settingsSecurity &&
                  segment !== workspaceSegments.activity &&
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
