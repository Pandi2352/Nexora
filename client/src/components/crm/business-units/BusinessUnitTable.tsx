import { Pencil, Star, Trash2 } from 'lucide-react'
import { Badge, Tooltip } from '@/components/ui'
import type { BusinessUnitItem } from '@/types/crm'
import { formatDateSafe } from '../crm-formatters'

interface BusinessUnitTableProps {
  units: BusinessUnitItem[]
  onEdit: (unit: BusinessUnitItem) => void
  onDelete: (unitId: string) => void
}

export function BusinessUnitTable({ units, onEdit, onDelete }: BusinessUnitTableProps) {
  return (
    <div className="overflow-x-auto rounded-md border border-slate-200 bg-white">
      <table className="w-full text-left text-xs sm:text-sm">
        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
          <tr>
            <th className="py-3 px-4">Business Unit</th>
            <th className="py-3 px-4">Code</th>
            <th className="py-3 px-4">Description</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4">Created</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {units.map((unit) => (
            <tr key={unit.id} className="hover:bg-slate-50/70 transition-colors">
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900">{unit.name}</span>
                  {unit.isDefault && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 border border-amber-200 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
                      <Star className="size-2.5 fill-amber-500 text-amber-500" />
                      Default
                    </span>
                  )}
                </div>
              </td>
              <td className="py-3 px-4">
                <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-xs font-mono font-medium text-slate-700">
                  {unit.code}
                </span>
              </td>
              <td className="py-3 px-4 text-xs text-slate-500 max-w-xs truncate">
                {unit.description || '—'}
              </td>
              <td className="py-3 px-4">
                <Badge variant={unit.isActive ? 'success' : 'neutral'}>
                  {unit.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </td>
              <td className="py-3 px-4 text-xs text-slate-400">
                {formatDateSafe(unit.createdAt)}
              </td>
              <td className="py-3 px-4 text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <Tooltip content="Edit Business Unit">
                    <button
                      type="button"
                      onClick={() => onEdit(unit)}
                      className="size-8 flex items-center justify-center rounded-md border border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 hover:text-sky-800 transition-colors cursor-pointer"
                      aria-label="Edit business unit"
                    >
                      <Pencil className="size-3.5" />
                    </button>
                  </Tooltip>
                  <Tooltip content="Delete Business Unit">
                    <button
                      type="button"
                      onClick={() => onDelete(unit.id)}
                      className="size-8 flex items-center justify-center rounded-md border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 hover:text-rose-800 transition-colors cursor-pointer"
                      aria-label="Delete business unit"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </Tooltip>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
