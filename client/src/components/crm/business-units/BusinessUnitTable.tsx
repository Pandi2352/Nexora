import { Pencil, Star, Trash2 } from 'lucide-react'
import { Badge, Tooltip } from '@/components/ui'
import type { BusinessUnitItem } from '@/types/crm'
import { formatDateSafe } from '../crm-formatters'

interface BusinessUnitTableProps {
  units: BusinessUnitItem[]
  onEdit: (unit: BusinessUnitItem) => void
  onDelete: (unit: BusinessUnitItem) => void
}

const AVATAR_PALETTES = [
  'bg-indigo-50 text-indigo-700 border-indigo-200 ring-1 ring-inset ring-indigo-500/10',
  'bg-cyan-50 text-cyan-700 border-cyan-200 ring-1 ring-inset ring-cyan-500/10',
  'bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-inset ring-emerald-500/10',
  'bg-violet-50 text-violet-700 border-violet-200 ring-1 ring-inset ring-violet-500/10',
  'bg-amber-50 text-amber-700 border-amber-200 ring-1 ring-inset ring-amber-500/10',
  'bg-rose-50 text-rose-700 border-rose-200 ring-1 ring-inset ring-rose-500/10',
  'bg-teal-50 text-teal-700 border-teal-200 ring-1 ring-inset ring-teal-500/10',
  'bg-blue-50 text-blue-700 border-blue-200 ring-1 ring-inset ring-blue-500/10',
]

function getUnitColor(code: string) {
  let hash = 0
  for (let i = 0; i < code.length; i++) {
    hash = code.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_PALETTES[Math.abs(hash) % AVATAR_PALETTES.length]
}

export function BusinessUnitTable({ units, onEdit, onDelete }: BusinessUnitTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs sm:text-sm">
        <thead className="bg-gradient-to-r from-slate-50 via-brand-50/20 to-slate-50 border-t border-b border-slate-200 text-[11px] font-semibold text-slate-700 uppercase tracking-wider">
          <tr>
            <th className="py-3 px-4 min-w-[260px]">Business Unit</th>
            <th className="py-3 px-4 min-w-[120px]">Division Code</th>
            <th className="py-3 px-4 min-w-[260px]">Operational Scope</th>
            <th className="py-3 px-4 min-w-[120px]">Status</th>
            <th className="py-3 px-4 min-w-[120px]">Created</th>
            <th className="py-3 px-4 text-right min-w-[100px]">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {units.map((unit) => {
            const avatarColor = getUnitColor(unit.code || unit.name)
            return (
              <tr
                key={unit.id}
                className="hover:bg-brand-50/25 transition-colors group cursor-default"
              >
                {/* Business Unit & Division */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`size-9 rounded-md border flex items-center justify-center font-bold text-xs shrink-0 select-none ${avatarColor}`}
                    >
                      {unit.code.slice(0, 3)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 truncate">
                          {unit.name}
                        </span>
                        {unit.isDefault && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 border border-amber-200 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 shrink-0">
                            <Star className="size-2.5 fill-amber-500 text-amber-500" />
                            Default
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">
                        ID: {unit.id.slice(0, 8)}...
                      </span>
                    </div>
                  </div>
                </td>

                {/* Code badge */}
                <td className="py-3.5 px-4">
                  <span className="inline-block rounded-md bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-xs font-mono font-bold text-slate-800">
                    {unit.code}
                  </span>
                </td>

                {/* Operational Scope */}
                <td className="py-3.5 px-4">
                  <p className="text-xs text-slate-600 line-clamp-2 max-w-sm leading-relaxed">
                    {unit.description || '—'}
                  </p>
                </td>

                {/* Status */}
                <td className="py-3.5 px-4">
                  <Badge variant={unit.isActive ? 'success' : 'neutral'}>
                    {unit.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </td>

                {/* Created */}
                <td className="py-3.5 px-4 text-xs text-slate-400 whitespace-nowrap">
                  {formatDateSafe(unit.createdAt)}
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Tooltip content="Edit Division" placement="top">
                      <button
                        type="button"
                        onClick={() => onEdit(unit)}
                        className="size-8 flex items-center justify-center rounded-md border border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 hover:text-sky-800 transition-colors cursor-pointer"
                        aria-label="Edit business unit"
                      >
                        <Pencil className="size-3.5" />
                      </button>
                    </Tooltip>
                    <Tooltip content="Delete Division" placement="top">
                      <button
                        type="button"
                        onClick={() => onDelete(unit)}
                        className="size-8 flex items-center justify-center rounded-md border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 hover:text-rose-800 transition-colors cursor-pointer"
                        aria-label="Delete business unit"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </Tooltip>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
