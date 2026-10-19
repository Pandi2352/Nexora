import { useEffect, useRef } from 'react'
import { Outlet } from 'react-router-dom'
import { SkipLink } from '@/components/common/SkipLink'
import { TopNavigationProgress } from '@/components/common/TopNavigationProgress'
import { Navbar } from '@/components/layout/navbar/Navbar'
import { Sidebar } from '@/components/layout/sidebar/Sidebar'
import { SidebarProvider } from '@/context/sidebar/SidebarProvider'
import { useWorkspace } from '@/context/workspace/workspace-context'
import { useScrollTopOnNavigate } from '@/hooks/useScrollTopOnNavigate'
import { useWorkspaceSlug } from '@/hooks/useWorkspaceSlug'

/** Workspace shell: sidebar + navbar, page content renders in <Outlet />. */
export function AppLayout() {
  const mainRef = useRef<HTMLElement>(null)
  useScrollTopOnNavigate(mainRef)
  const slug = useWorkspaceSlug()
  const { switchWorkspace } = useWorkspace()

  useEffect(() => {
    if (slug) {
      switchWorkspace(slug)
    }
  }, [slug, switchWorkspace])

  return (
    <SidebarProvider>
      <SkipLink />
      <TopNavigationProgress />
      <div className="flex h-dvh overflow-hidden">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Navbar />
          <main
            id="main-content"
            ref={mainRef}
            tabIndex={-1}
            className="custom-scrollbar flex-1 overflow-y-auto focus:outline-none"
          >
            <div className="flex min-h-full flex-col w-full px-4 py-6 sm:px-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
