import { useCallback, useEffect, useState } from 'react'
import { Info, ShieldCheck } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { SearchInput, Spinner } from '@/components/ui'
import { RoleOverviewCard } from '@/components/roles/RoleOverviewCard'
import { PermissionMatrixTable } from '@/components/roles/PermissionMatrixTable'
import { useWorkspace } from '@/context/workspace/workspace-context'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useWorkspaceSlug } from '@/hooks/useWorkspaceSlug'
import { roleService } from '@/services/role.service'
import type { PermissionCategoryGroup, RoleDefinition } from '@/types/role'

export default function RolesPage() {
  useDocumentTitle('Roles & Permissions')
  const slug = useWorkspaceSlug()
  const { currentWorkspace } = useWorkspace()

  const [roles, setRoles] = useState<RoleDefinition[]>([])
  const [matrix, setMatrix] = useState<PermissionCategoryGroup[]>([])
  const [matrixRoles, setMatrixRoles] = useState<Array<{ slug: string; name: string }>>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const currentRole = currentWorkspace?.role?.toLowerCase() || 'owner'

  const loadData = useCallback(async () => {
    if (!slug) return
    setIsLoading(true)
    try {
      const [rolesData, matrixData] = await Promise.all([
        roleService.getRoles(slug),
        roleService.getMatrix(slug),
      ])
      setRoles(rolesData)
      setMatrix(matrixData.matrix)
      setMatrixRoles(matrixData.roles)
      setSelectedRole(currentRole)
    } catch {
      // Fallback for isolated development / tests
      setRoles([])
      setMatrix([])
      setMatrixRoles([])
    } finally {
      setIsLoading(false)
    }
  }, [slug, currentRole])

  useEffect(() => {
    void loadData()
  }, [loadData])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles & Permissions"
        description="Inspect system roles and granular capabilities across projects, teams, CRM, and administration."
      />

      <div className="flex items-center gap-3 rounded-md border border-brand-200/70 bg-brand-50/40 p-4 text-xs text-brand-900">
        <ShieldCheck className="size-5 shrink-0 text-brand-600" />
        <div className="flex-1">
          <span className="font-semibold">Security Model: </span>
          Nexora OS enforces role-based access control with explicit capabilities. Predefined system roles are read-only to ensure strict compliance and workspace isolation.
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          <div>
            <div className="mb-3 flex items-center justify-between text-xs font-semibold text-slate-700">
              <span>Workspace System Roles ({roles.length})</span>
              <span className="flex items-center gap-1 font-normal text-slate-500">
                <Info className="size-3.5 text-slate-400" />
                Select a role to highlight its column in the matrix below
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {roles.map((role) => (
                <RoleOverviewCard
                  key={role.slug}
                  role={role}
                  isSelected={selectedRole === role.slug}
                  isCurrentRole={currentRole === role.slug}
                  onSelect={() =>
                    setSelectedRole((prev) => (prev === role.slug ? null : role.slug))
                  }
                />
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-slate-900">
                Capability Matrix
              </h3>
              <div className="w-full sm:w-72">
                <SearchInput
                  placeholder="Filter capabilities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <PermissionMatrixTable
              categories={matrix}
              roles={matrixRoles}
              searchQuery={searchQuery}
              highlightRole={selectedRole}
            />
          </div>
        </>
      )}
    </div>
  )
}
