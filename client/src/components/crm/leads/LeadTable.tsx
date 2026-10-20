import { ArrowRight, Mail, Pencil, Phone, Trash2, Users } from 'lucide-react'
import { Tooltip } from '@/components/ui'
import type { Lead } from '@/types/crm'
import { LeadStatusBadge, MustWinBadge } from './LeadStatusBadge'
import { formatDateSafe, formatINR } from '../crm-formatters'

interface LeadTableProps {
  leads: Lead[]
  ownerNameMap: Map<string, string>
  onEdit: (lead: Lead) => void
  onConvert: (lead: Lead) => void
  onDelete: (lead: Lead) => void
}

const AVATAR_PALETTES = [
  'bg-blue-50 text-blue-700 border-blue-200',
  'bg-indigo-50 text-indigo-700 border-indigo-200',
  'bg-purple-50 text-purple-700 border-purple-200',
  'bg-emerald-50 text-emerald-700 border-emerald-200',
  'bg-amber-50 text-amber-700 border-amber-200',
  'bg-rose-50 text-rose-700 border-rose-200',
  'bg-teal-50 text-teal-700 border-teal-200',
]

function getCompanyMonogram(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean)
  const first = words[0]?.[0] ?? 'L'
  const second = words[1]?.[0] ?? words[0]?.[1] ?? ''
  const initials = (first + second).toUpperCase() || 'LE'
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const color = AVATAR_PALETTES[Math.abs(hash) % AVATAR_PALETTES.length]
  return { initials, color }
}

export function LeadTable({
  leads,
  ownerNameMap,
  onEdit,
  onConvert,
  onDelete,
}: LeadTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs sm:text-sm">
        <thead className="bg-gradient-to-r from-slate-50 via-brand-50/20 to-slate-50 border-t border-b border-slate-200 text-[11px] font-semibold text-slate-700 uppercase tracking-wider">
          <tr>
            <th className="py-3 px-4 min-w-[260px]">Lead / Enterprise Client</th>
            <th className="py-3 px-4 min-w-[220px]">Stakeholders & Contacts</th>
            <th className="py-3 px-4 min-w-[130px]">Division & Owner</th>
            <th className="py-3 px-4 min-w-[150px]">Annual Quota (₹)</th>
            <th className="py-3 px-4 min-w-[110px]">Status</th>
            <th className="py-3 px-4 text-right min-w-[100px]">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {leads.map((lead) => {
            const { initials, color } = getCompanyMonogram(lead.companyName)
            const ownerName = ownerNameMap.get(lead.leadOwnerId) || 'Workspace Lead'
            const contactsList = lead.contacts && lead.contacts.length > 0 ? lead.contacts : []
            const primaryContact =
              contactsList.find((c) => c.isPrimary) ||
              contactsList[0] || {
                firstName: lead.contactFirstName,
                lastName: lead.contactLastName,
                email: lead.contactEmail,
                phone: lead.contactPhone,
                designation: lead.designation,
              }
            const extraCount = contactsList.length > 1 ? contactsList.length - 1 : 0

            return (
              <tr
                key={lead.id}
                className="hover:bg-slate-50/80 transition-colors duration-150 group"
              >
                {/* Company & Priority */}
                <td className="py-3.5 px-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex size-10 shrink-0 items-center justify-center rounded-md border text-xs font-bold tracking-tight ${color}`}
                    >
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 group-hover:text-brand-600 transition-colors truncate">
                          {lead.companyName}
                        </span>
                        {lead.isMustWin && <MustWinBadge />}
                      </div>
                      {lead.scope && (
                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                          {lead.scope}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        <span className="capitalize">{lead.source}</span>
                        <span>·</span>
                        <span className="capitalize">{lead.type}</span>
                        {lead.expectedConversionDate && (
                          <>
                            <span>·</span>
                            <span>Est: {formatDateSafe(lead.expectedConversionDate)}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Stakeholders & Multi-Contacts */}
                <td className="py-3.5 px-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-medium text-slate-900">
                        {primaryContact.firstName} {primaryContact.lastName}
                      </span>
                      {extraCount > 0 && (
                        <Tooltip
                          content={contactsList
                            .map((c) => `${c.firstName} ${c.lastName} (${c.designation || 'Contact'})`)
                            .join(', ')}
                        >
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.2 text-[10px] font-semibold text-slate-600 border border-slate-200 cursor-help">
                            <Users className="size-2.5" />
                            +{extraCount} more
                          </span>
                        </Tooltip>
                      )}
                    </div>
                    {primaryContact.designation && (
                      <p className="text-xs text-slate-500 mt-0.5 truncate max-w-[200px]">
                        {primaryContact.designation}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5 truncate">
                      <span className="flex items-center gap-1">
                        <Mail className="size-3" />
                        {primaryContact.email}
                      </span>
                      {primaryContact.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="size-3" />
                          {primaryContact.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </td>

                {/* Division & Lead Owner */}
                <td className="py-3.5 px-4">
                  <div className="space-y-1">
                    <span className="inline-block px-2 py-0.5 text-xs rounded-md border border-slate-200 bg-slate-50 font-medium text-slate-700 capitalize">
                      {lead.businessUnit.replace(/_/g, ' ')}
                    </span>
                    <p className="text-xs text-slate-500 truncate max-w-[120px]">
                      {ownerName}
                    </p>
                  </div>
                </td>

                {/* Annual Target (₹) */}
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-slate-900">
                    {formatINR(lead.annualRevenueTarget)}
                  </div>
                  <div className="text-[11px] text-slate-500 capitalize">
                    {lead.contractPeriod ? `${lead.contractPeriod} yr` : '1 yr'} · {lead.revenueFrequency}
                  </div>
                </td>

                {/* Status Badge */}
                <td className="py-3.5 px-4">
                  <LeadStatusBadge status={lead.status} />
                </td>

                {/* Action Buttons with Modern Colored Tooltips */}
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Tooltip content={lead.status === 'qualified' ? 'Convert / Add Deal' : 'Convert to Deal'}>
                      <button
                        type="button"
                        onClick={() => onConvert(lead)}
                        className={`size-8 inline-flex items-center justify-center rounded-md border transition-colors cursor-pointer ${
                          lead.status === 'qualified'
                            ? 'border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-400'
                            : 'border-emerald-200 bg-emerald-50/70 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300'
                        }`}
                        aria-label={lead.status === 'qualified' ? 'Convert / Add deal' : 'Convert lead to deal'}
                      >
                        <ArrowRight className="size-3.5" />
                      </button>
                    </Tooltip>
                    <Tooltip content="Edit Lead">
                      <button
                        type="button"
                        onClick={() => onEdit(lead)}
                        className="size-8 inline-flex items-center justify-center rounded-md border border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 hover:text-sky-800 transition-colors cursor-pointer"
                        aria-label="Edit lead"
                      >
                        <Pencil className="size-3.5" />
                      </button>
                    </Tooltip>
                    <Tooltip content="Delete Lead">
                      <button
                        type="button"
                        onClick={() => onDelete(lead)}
                        className="size-8 inline-flex items-center justify-center rounded-md border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 hover:text-rose-800 transition-colors cursor-pointer"
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
