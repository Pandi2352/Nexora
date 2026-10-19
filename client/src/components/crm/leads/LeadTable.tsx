import { ArrowRight, Mail, Pencil, Phone, Trash2 } from 'lucide-react'
import { Tooltip } from '@/components/ui'
import type { Lead } from '@/types/crm'
import { LeadStatusBadge, MustWinBadge } from './LeadStatusBadge'
import { formatDateSafe, formatINR } from '../crm-formatters'

interface LeadTableProps {
  leads: Lead[]
  ownerNameMap: Map<string, string>
  onEdit: (lead: Lead) => void
  onConvert: (lead: Lead) => void
  onDelete: (leadId: string) => void
}

export function LeadTable({
  leads,
  ownerNameMap,
  onEdit,
  onConvert,
  onDelete,
}: LeadTableProps) {
  return (
    <div className="overflow-x-auto rounded-md border border-slate-200 bg-white">
      <table className="w-full text-left text-xs sm:text-sm">
        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
          <tr>
            <th className="py-3 px-4">Company & Stakeholder</th>
            <th className="py-3 px-4">Status & Owner</th>
            <th className="py-3 px-4">Annual Target (₹)</th>
            <th className="py-3 px-4">Funnel / Dates</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {leads.map((lead) => {
            const ownerName = ownerNameMap.get(lead.leadOwnerId) || 'Unassigned'

            return (
              <tr key={lead.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900">{lead.companyName}</span>
                    {lead.isMustWin && <MustWinBadge />}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {lead.salutation || ''} {lead.contactFirstName} {lead.contactLastName}
                    {lead.designation ? ` · ${lead.designation}` : ''}
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Mail className="size-3" />
                      {lead.contactEmail}
                    </span>
                    {lead.contactPhone && (
                      <span className="flex items-center gap-1">
                        <Phone className="size-3" />
                        {lead.contactPhone}
                      </span>
                    )}
                  </div>
                </td>

                <td className="py-3 px-4">
                  <div className="flex flex-col gap-1 items-start">
                    <LeadStatusBadge status={lead.status} />
                    <span className="text-[11px] text-slate-500">Owner: {ownerName}</span>
                  </div>
                </td>

                <td className="py-3 px-4">
                  <div className="font-medium text-slate-900">
                    {formatINR(lead.annualRevenueTarget)}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {lead.contractPeriod ? `${lead.contractPeriod} yr contract` : 'No contract'} · {lead.revenueFrequency}
                  </div>
                </td>

                <td className="py-3 px-4 text-xs text-slate-500">
                  <div>
                    <span className="text-slate-400">Next Contact:</span> {formatDateSafe(lead.nextContactDate)}
                  </div>
                  <div>
                    <span className="text-slate-400">Target Close:</span> {formatDateSafe(lead.expectedConversionDate)}
                  </div>
                </td>

                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Tooltip content="Convert to Deal">
                      <button
                        type="button"
                        onClick={() => onConvert(lead)}
                        className="size-8 flex items-center justify-center rounded-md border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 transition-colors cursor-pointer"
                        aria-label="Convert lead to deal"
                      >
                        <ArrowRight className="size-3.5" />
                      </button>
                    </Tooltip>
                    <Tooltip content="Edit Lead">
                      <button
                        type="button"
                        onClick={() => onEdit(lead)}
                        className="size-8 flex items-center justify-center rounded-md border border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 hover:text-sky-800 transition-colors cursor-pointer"
                        aria-label="Edit lead"
                      >
                        <Pencil className="size-3.5" />
                      </button>
                    </Tooltip>
                    <Tooltip content="Delete Lead">
                      <button
                        type="button"
                        onClick={() => onDelete(lead.id)}
                        className="size-8 flex items-center justify-center rounded-md border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 hover:text-rose-800 transition-colors cursor-pointer"
                        aria-label="Delete lead"
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
