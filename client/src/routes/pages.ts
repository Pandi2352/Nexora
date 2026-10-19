import { lazyPage } from './lazyPage'

// Every routed page, lazy-loaded. Add new pages here, then reference them in a route file.
export const pages = {
  Welcome: lazyPage(() => import('@/pages/welcome/WelcomePage')),
  Dashboard: lazyPage(() => import('@/pages/dashboard/DashboardPage')),
  Placeholder: lazyPage(() => import('@/pages/PlaceholderPage')),
  NotFound: lazyPage(() => import('@/pages/errors/NotFoundPage')),
  Error: lazyPage(() => import('@/pages/errors/ErrorPage')),
  Workspaces: lazyPage(() => import('@/pages/workspaces/WorkspacesPage')),
  CreateWorkspace: lazyPage(() => import('@/pages/workspaces/CreateWorkspacePage')),
  Members: lazyPage(() => import('@/pages/members/MembersPage')),
  Teams: lazyPage(() => import('@/pages/teams/TeamsPage')),
  Roles: lazyPage(() => import('@/pages/roles/RolesPage')),
  GeneralSettings: lazyPage(() => import('@/pages/settings/GeneralSettingsPage')),
  Activity: lazyPage(() => import('@/pages/activity/ActivityPage')),
  Account: lazyPage(() => import('@/pages/account/AccountPage')),
  Login: lazyPage(() => import('@/pages/auth/LoginPage')),
  Register: lazyPage(() => import('@/pages/auth/RegisterPage')),
  VerifyEmail: lazyPage(() => import('@/pages/auth/VerifyEmailPage')),
  ForgotPassword: lazyPage(() => import('@/pages/auth/ForgotPasswordPage')),
  ResetPassword: lazyPage(() => import('@/pages/auth/ResetPasswordPage')),
  AcceptInvitation: lazyPage(() => import('@/pages/auth/AcceptInvitationPage')),
  OAuthCallback: lazyPage(() => import('@/pages/auth/OAuthCallbackPage')),
  SessionExpired: lazyPage(() => import('@/pages/auth/SessionExpiredPage')),
  TwoFactor: lazyPage(() => import('@/pages/auth/TwoFactorPage')),
}
