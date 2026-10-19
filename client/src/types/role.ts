export interface RoleDefinition {
  slug: string
  name: string
  description: string
  permissions: string[]
  isSystem: boolean
  memberCount?: number
}

export interface PermissionMatrixItem {
  key: string
  name: string
  description: string
  grantedRoles: string[]
}

export interface PermissionCategoryGroup {
  category: string
  permissions: PermissionMatrixItem[]
}

export interface RolesMatrixResponse {
  roles: Array<{
    slug: string
    name: string
    description: string
    isSystem: boolean
  }>
  matrix: PermissionCategoryGroup[]
}

export interface UserWorkspacePermissions {
  role: string
  permissions: string[]
}
