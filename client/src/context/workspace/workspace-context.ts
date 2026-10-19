import { createContext, useContext } from 'react'
import type { CreateWorkspacePayload, Workspace } from '@/types/workspace'

export interface WorkspaceContextValue {
  workspaces: Workspace[]
  currentWorkspace: Workspace | null
  isLoading: boolean
  error: string | null
  createWorkspace: (payload: CreateWorkspacePayload) => Promise<Workspace>
  refreshWorkspaces: () => Promise<void>
  switchWorkspace: (slug: string) => void
}

export const WorkspaceContext = createContext<WorkspaceContextValue | null>(null)

export function useWorkspace(): WorkspaceContextValue {
  const context = useContext(WorkspaceContext)
  if (!context) {
    throw new Error('useWorkspace must be used within a <WorkspaceProvider>')
  }
  return context
}
