import { Check, Minus } from 'lucide-react'
import type { PermissionCategoryGroup } from '@/types/role'

interface PermissionMatrixTableProps {
  categories: PermissionCategoryGroup[]
  roles: Array<{ slug: string; name: string }>
  searchQuery: string
  highlightRole?: string | null
}

export function PermissionMatrixTable({
  categories,
  roles,
  searchQuery,
  highlightRole,
}: PermissionMatrixTableProps) {
  const query = searchQuery.trim().toLowerCase()

  const filteredCategories = categories
    .map((cat) => ({
      ...cat,
      permissions: cat.permissions.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.key.toLowerCase().includes(query),
      ),
    }))
    .filter((cat) => cat.permissions.length > 0)

  if (filteredCategories.length === 0) {
    return (
      <div className="rounded-md border border-slate-200 bg-white p-12 text-center text-xs text-slate-500">
        No permissions found matching &quot;{searchQuery}&quot;.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-md border border-slate-200 bg-white">
      <table className="w-full border-collapse text-left text-xs">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/80">
            <th className="min-w-[260px] p-3.5 font-semibold text-slate-700">
              Capability / Action
            </th>
            {roles.map((role) => {
              const isHighlighted = highlightRole?.toLowerCase() === role.slug
              return (
                <th
                  key={role.slug}
                  className={`min-w-[110px] p-3.5 text-center font-semibold text-slate-700 transition-colors ${
                    isHighlighted ? 'bg-brand-50/60 text-brand-900 font-bold' : ''
                  }`}
                >
                  <span className="block">{role.name}</span>
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {filteredCategories.map((group) => (
            <tr key={`header-${group.category}`} className="contents">
              <td
                colSpan={roles.length + 1}
                className="bg-slate-50/50 px-3.5 py-2 font-semibold uppercase tracking-wider text-[11px] text-slate-500 border-t border-b border-slate-200/60"
              >
                {group.category}
              </td>
              {group.permissions.map((perm) => (
                <tr key={perm.key} className="transition-colors hover:bg-slate-50/40">
                  <td className="p-3.5">
                    <div className="font-medium text-slate-800">{perm.name}</div>
                    <div className="mt-0.5 text-[11px] text-slate-500">{perm.description}</div>
                  </td>
                  {roles.map((role) => {
                    const isGranted = perm.grantedRoles.includes(role.slug)
                    const isHighlighted = highlightRole?.toLowerCase() === role.slug
                    return (
                      <td
                        key={role.slug}
                        className={`p-3.5 text-center align-middle transition-colors ${
                          isHighlighted ? 'bg-brand-50/30' : ''
                        }`}
                      >
                        {isGranted ? (
                          <span
                            title={`Allowed for ${role.name}`}
                            className="inline-flex size-5 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"
                          >
                            <Check className="size-3.5 stroke-[2.5]" />
                          </span>
                        ) : (
                          <span
                            title={`Denied for ${role.name}`}
                            className="inline-flex size-5 items-center justify-center text-slate-300"
                          >
                            <Minus className="size-3.5" />
                          </span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
