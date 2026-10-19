import { ExternalLink, Globe, Mail, MapPin, Pencil, Phone, Trash2, Users } from 'lucide-react'
import { Tooltip } from '@/components/ui'
import type { Company } from '@/types/crm'
import { CompanyStatusBadge } from './CompanyStatusBadge'

interface CompanyTableProps {
  companies: Company[]
  onEdit: (company: Company) => void
  onDelete: (company: Company) => void
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

const INDUSTRY_COLORS: Record<string, string> = {
  Technology: 'bg-sky-50 text-sky-700 border-sky-200',
  Finance: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Healthcare: 'bg-rose-50 text-rose-700 border-rose-200',
  Manufacturing: 'bg-amber-50 text-amber-700 border-amber-200',
  Consulting: 'bg-purple-50 text-purple-700 border-purple-200',
}

function getCompanyMonogram(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean)
  const first = words[0]?.[0] ?? 'C'
  const second = words[1]?.[0] ?? words[0]?.[1] ?? ''
  const initials = (first + second).toUpperCase() || 'CO'
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const color = AVATAR_PALETTES[Math.abs(hash) % AVATAR_PALETTES.length]
  return { initials, color }
}

export function CompanyTable({ companies, onEdit, onDelete }: CompanyTableProps) {
  const formatInr = (amount?: number) => {
    if (!amount) return '—'
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs sm:text-sm">
        <thead className="bg-gradient-to-r from-slate-50 via-brand-50/20 to-slate-50 border-t border-b border-slate-200 text-[11px] font-semibold text-slate-700 uppercase tracking-wider">
          <tr>
            <th className="py-3 px-4 min-w-[280px]">Company & Presence</th>
            <th className="py-3 px-4 min-w-[170px]">Industry & Scale</th>
            <th className="py-3 px-4 min-w-[230px]">Direct Contact</th>
            <th className="py-3 px-4 min-w-[150px]">Annual Revenue</th>
            <th className="py-3 px-4 min-w-[130px]">Status</th>
            <th className="py-3 px-4 text-right min-w-[80px]">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {companies.map((company) => {
            const { initials, color } = getCompanyMonogram(company.name)
            const indStyle =
              (company.industry && INDUSTRY_COLORS[company.industry]) ||
              'bg-slate-100 text-slate-700 border-slate-200'

            return (
              <tr
                key={company.id}
                className="hover:bg-slate-50/80 transition-colors duration-150 group"
              >
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex size-10 shrink-0 items-center justify-center rounded-md border text-xs font-bold tracking-tight ${color}`}
                    >
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 group-hover:text-brand-600 transition-colors truncate">
                        {company.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                        {company.address?.city && (
                          <span className="inline-flex items-center gap-1 truncate max-w-[140px]">
                            <MapPin className="size-3 shrink-0 text-slate-400" />
                            {company.address.city}
                            {company.address.country ? `, ${company.address.country}` : ''}
                          </span>
                        )}
                        {company.address?.city && company.website && (
                          <span className="text-slate-300">·</span>
                        )}
                        {company.website && (
                          <a
                            href={
                              company.website.startsWith('http')
                                ? company.website
                                : `https://${company.website}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-slate-500 hover:text-brand-600 hover:underline truncate max-w-[130px] cursor-pointer"
                          >
                            <Globe className="size-3 shrink-0 opacity-70" />
                            <span className="truncate">{company.website.replace(/^https?:\/\//, '')}</span>
                            <ExternalLink className="size-2.5 opacity-50" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="py-3.5 px-4">
                  <div className="space-y-1">
                    <span
                      className={`inline-block px-2.5 py-0.5 text-xs rounded-md border font-medium ${indStyle}`}
                    >
                      {company.industry || 'General'}
                    </span>
                    {company.employeeCount && (
                      <p className="flex items-center gap-1 text-xs text-slate-500">
                        <Users className="size-3 text-slate-400" />
                        <span>{company.employeeCount} team</span>
                      </p>
                    )}
                  </div>
                </td>

                <td className="py-3.5 px-4">
                  <div className="space-y-1">
                    {company.phone ? (
                      <a
                        href={`tel:${company.phone}`}
                        className="inline-flex items-center gap-1.5 font-mono text-xs text-slate-700 hover:text-brand-600 transition-colors cursor-pointer"
                      >
                        <span className="flex size-5 items-center justify-center rounded-md bg-sky-50 text-sky-600 border border-sky-100 shrink-0">
                          <Phone className="size-3" />
                        </span>
                        <span>{company.phone}</span>
                      </a>
                    ) : (
                      <span className="text-slate-400 text-xs">—</span>
                    )}
                    {company.email && (
                      <div>
                        <a
                          href={`mailto:${company.email}`}
                          className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-brand-600 hover:underline transition-colors cursor-pointer"
                        >
                          <span className="flex size-5 items-center justify-center rounded-md bg-purple-50 text-purple-600 border border-purple-100 shrink-0">
                            <Mail className="size-3" />
                          </span>
                          <span className="truncate max-w-[170px]">{company.email}</span>
                        </a>
                      </div>
                    )}
                  </div>
                </td>

                <td className="py-3.5 px-4">
                  <div>
                    <span className="inline-flex items-center font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/80">
                      {formatInr(company.annualRevenue)}
                    </span>
                    <p className="text-[10px] text-slate-400 tracking-tight mt-0.5">Annual gross</p>
                  </div>
                </td>

                <td className="py-3.5 px-4">
                  <CompanyStatusBadge status={company.status} />
                </td>

                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Tooltip content="Edit Company">
                      <button
                        type="button"
                        onClick={() => onEdit(company)}
                        className="size-7 flex items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:text-sky-600 hover:border-sky-200 hover:bg-sky-50 transition-all cursor-pointer"
                        aria-label="Edit company"
                      >
                        <Pencil className="size-3.5" />
                      </button>
                    </Tooltip>
                    <Tooltip content="Delete Company">
                      <button
                        type="button"
                        onClick={() => onDelete(company)}
                        className="size-7 flex items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-all cursor-pointer"
                        aria-label="Delete company"
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
