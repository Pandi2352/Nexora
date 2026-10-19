import { lazyPage } from './lazyPage'

// Every routed page, lazy-loaded. Add new pages here, then reference them in a route file.
export const pages = {
  Placeholder: lazyPage(() => import('@/pages/PlaceholderPage')),
  NotFound: lazyPage(() => import('@/pages/errors/NotFoundPage')),
  Error: lazyPage(() => import('@/pages/errors/ErrorPage')),
  Workspaces: lazyPage(() => import('@/pages/workspaces/WorkspacesPage')),
}
