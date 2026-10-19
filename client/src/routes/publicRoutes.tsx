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
      { path: paths.login, element: <pages.Login /> },
      { path: paths.register, element: <pages.Register /> },
      { path: paths.verifyEmail, element: <pages.VerifyEmail /> },
      { path: paths.forgotPassword, element: <pages.ForgotPassword /> },
      { path: paths.resetPassword, element: <pages.ResetPassword /> },
      { path: paths.acceptInvitation, element: <pages.AcceptInvitation /> },
      { path: paths.oauthCallback, element: <pages.OAuthCallback /> },
      { path: paths.sessionExpired, element: <pages.SessionExpired /> },
      { path: paths.twoFactor, element: <pages.TwoFactor /> },
      { path: paths.workspaces, element: <pages.Workspaces /> },
      { path: paths.newWorkspace, element: <pages.CreateWorkspace /> },
      { path: paths.error, element: <pages.Error /> },
    ],
  },
]
