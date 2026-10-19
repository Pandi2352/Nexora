import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { mockUser } from '@/data/user'

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

vi.mock('@/services/auth.service', () => ({
  authService: {
    refresh: vi.fn().mockResolvedValue('test-token'),
    getMe: vi.fn().mockResolvedValue(mockUser),
    login: vi.fn(),
    logout: vi.fn(),
  },
}))

async function renderAt(path: string) {
  window.history.pushState({}, '', path)
  vi.resetModules()
  const { default: App } = await import('@/App')
  document.body.innerHTML = '<div id="root"></div>'
  const root = createRoot(document.getElementById('root')!)
  await act(async () => root.render(<App />))
  // Wait until lazy pages have loaded (the Suspense skeleton is gone), up to 5s.
  for (let waited = 0; waited < 5000; waited += 50) {
    await act(async () => new Promise((r) => setTimeout(r, 50)))
    const isLoading = document.querySelector('[aria-label="Loading page"]')
    if (!isLoading) {
      if (path.startsWith('/workspace') && !path.startsWith('/workspaces')) {
        if (document.querySelector('aside#app-sidebar') || document.querySelector('main')) break
      } else {
        break
      }
    }
  }
  return root
}

test('workspace route renders shell + page in outlet', async () => {
  const root = await renderAt('/workspace/acme/crm/companies')
  const text = document.body.textContent ?? ''
  expect(document.querySelector('aside#app-sidebar')).not.toBeNull()
  expect(document.querySelector('header')).not.toBeNull()
  expect(document.querySelector('main h1')?.textContent).toBe('Companies')
  expect(document.querySelector('a[aria-current="page"]')?.textContent).toBe('Companies')
  expect(text).toContain('Acme Inc')
  expect(document.title).toBe('Companies · Nexora OS')
  root.unmount()
})

test('workspace settings/general renders general settings page in outlet', async () => {
  const root = await renderAt('/workspace/acme/settings/general')
  expect(document.querySelector('aside#app-sidebar')).not.toBeNull()
  expect(document.querySelector('main h1')?.textContent).toBe('General Settings')
  expect(document.body.textContent).toContain('Workspace Profile')
  root.unmount()
})

test('workspace settings/members renders members page in outlet', async () => {
  const root = await renderAt('/workspace/acme/settings/members')
  expect(document.querySelector('aside#app-sidebar')).not.toBeNull()
  expect(document.querySelector('main h1')?.textContent).toBe('Team Members')
  expect(document.body.textContent).toContain('Active Members')
  root.unmount()
})

test('workspace settings/teams renders teams page in outlet', async () => {
  const root = await renderAt('/workspace/acme/settings/teams')
  expect(document.querySelector('aside#app-sidebar')).not.toBeNull()
  expect(document.querySelector('main h1')?.textContent).toBe('Teams & Departments')
  expect(document.body.textContent).toContain('configured')
  root.unmount()
})

test('workspace settings/roles renders roles and permissions page in outlet', async () => {
  const root = await renderAt('/workspace/acme/settings/roles')
  expect(document.querySelector('aside#app-sidebar')).not.toBeNull()
  expect(document.querySelector('main h1')?.textContent).toBe('Roles & Permissions')
  expect(document.body.textContent).toContain('Security Model')
  root.unmount()
})

test('workspace activity renders activity and audit page in outlet', async () => {
  const root = await renderAt('/workspace/acme/activity')
  expect(document.querySelector('aside#app-sidebar')).not.toBeNull()
  expect(document.querySelector('main h1')?.textContent).toBe('Activity & Audit Trail')
  expect(document.body.textContent).toContain('events recorded')
  root.unmount()
})

test('workspace account renders account settings page in outlet', async () => {
  const root = await renderAt('/workspace/acme/account')
  expect(document.querySelector('aside#app-sidebar')).not.toBeNull()
  expect(document.querySelector('main h1')?.textContent).toBe('Account Settings')
  expect(document.body.textContent).toContain('Profile & Preferences')
  root.unmount()
})

test('workspace index redirects to dashboard', async () => {
  const root = await renderAt('/workspace/acme')
  expect(window.location.pathname).toBe('/workspace/acme/dashboard')
  expect(document.querySelector('main h1')?.textContent).toBe('Dashboard')
  root.unmount()
})

test('unknown workspace path shows 404 inside layout', async () => {
  const root = await renderAt('/workspace/acme/nope')
  expect(document.querySelector('aside#app-sidebar')).not.toBeNull()
  expect(document.querySelector('main')?.textContent).toContain('Page not found')
  root.unmount()
})

test('public route uses auth layout without sidebar', async () => {
  const root = await renderAt('/workspaces')
  expect(document.querySelector('aside')).toBeNull()
  expect(document.body.textContent).toContain('Your workspaces')
  root.unmount()
})

test('/workspaces/new renders create workspace page', async () => {
  const root = await renderAt('/workspaces/new')
  expect(document.querySelector('aside')).toBeNull()
  expect(document.body.textContent).toContain('Create workspace')
  expect(document.querySelector('input[placeholder*="Acme Operations"]')).not.toBeNull()
  root.unmount()
})

test.each([
  ['/error/403', 'Error 403', 'Access denied'],
  ['/error/503', 'Error 503', 'Service unavailable'],
  ['/error/401', 'Error 401', 'Sign in required'],
  ['/error/abc', 'Error 404', 'Page not found'],
])('%s renders the matching error page', async (path, eyebrow, title) => {
  const root = await renderAt(path)
  const alert = document.querySelector('[role="alert"]')
  expect(alert?.textContent).toContain(eyebrow)
  expect(alert?.textContent).toContain(title)
  root.unmount()
})

test('navbar starts with the sidebar toggle and has no breadcrumbs', async () => {
  const root = await renderAt('/workspace/acme/dashboard')
  const header = document.querySelector('header')
  expect(header?.querySelector('nav[aria-label="Breadcrumb"]')).toBeNull()
  const buttons = header?.querySelectorAll('button')
  const first = buttons?.[0]
  expect(first?.getAttribute('aria-label')).toBe('Collapse sidebar')
  expect(first?.getAttribute('aria-controls')).toBe('app-sidebar')
  root.unmount()
})
