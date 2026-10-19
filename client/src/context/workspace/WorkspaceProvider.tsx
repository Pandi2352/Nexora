import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { useAuth } from '@/context/auth/auth-context'
import { mockWorkspaces } from '@/data/workspaces'
import { setActiveTenant } from '@/lib/api'
import { organizationService } from '@/services/organization.service'
import type { CreateWorkspacePayload, Workspace } from '@/types/workspace'
import { WorkspaceContext } from './workspace-context'

const LAST_WORKSPACE_KEY = 'nexora.last_workspace_slug'

export interface WorkspaceProviderProps {
  children: ReactNode
}

export function WorkspaceProvider({ children }: WorkspaceProviderProps) {
  const { isAuthenticated, user } = useAuth()
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const refreshWorkspaces = useCallback(async () => {
    if (!isAuthenticated) {
      setWorkspaces(mockWorkspaces)
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      const data = await organizationService.list()
      const list = data.length > 0 ? data : mockWorkspaces
      setWorkspaces(list)

      const savedSlug = localStorage.getItem(LAST_WORKSPACE_KEY)
      const matched = list.find((w) => w.slug === savedSlug) || list[0] || null
      setCurrentWorkspace(matched)
      setActiveTenant(matched ? matched.id : null)
    } catch {
      setWorkspaces(mockWorkspaces)
      setError('Failed to load workspaces')
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    void refreshWorkspaces()
  }, [refreshWorkspaces, user])

  const switchWorkspace = useCallback(
    (slug: string) => {
      const target = workspaces.find((w) => w.slug === slug)
      if (target) {
        setCurrentWorkspace(target)
        setActiveTenant(target.id)
        localStorage.setItem(LAST_WORKSPACE_KEY, target.slug)
      }
    },
    [workspaces],
  )

  const createWorkspace = useCallback(
    async (payload: CreateWorkspacePayload): Promise<Workspace> => {
      const created = await organizationService.create(payload)
      setWorkspaces((prev) => [created, ...prev.filter((w) => w.id !== created.id)])
      setCurrentWorkspace(created)
      setActiveTenant(created.id)
      localStorage.setItem(LAST_WORKSPACE_KEY, created.slug)
      return created
    },
    [],
  )

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces: workspaces.length > 0 ? workspaces : mockWorkspaces,
        currentWorkspace,
        isLoading,
        error,
        createWorkspace,
        refreshWorkspaces,
        switchWorkspace,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  )
}
