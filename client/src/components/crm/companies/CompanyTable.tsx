import { Building2, ExternalLink, Globe, MoreVertical, Pencil, Phone, Trash2 } from 'lucide-react'
import { Dropdown, DropdownItem } from '@/components/ui'
import type { Company } from '@/types/crm'
import { CompanyStatusBadge } from './CompanyStatusBadge'

interface CompanyTableProps {
  companies: Company[]
  onEdit: (company: Company) => void
  onDelete: (companyId: string) => void
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
    <div className="overflow-x-auto rounded-md border border-slate-200 bg-white">
      <table className="w-full text-left text-xs sm:text-sm">
        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
          <tr>
            <th className="py-3 px-4">Company</th>
            <th className="py-3 px-4">Industry</th>
            <th className="py-3 px-4">Contact</th>
            <th className="py-3 px-4">Revenue</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {companies.map((company) => (
            <tr key={company.id} className="hover:bg-slate-50/70 transition-colors">
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-brand-50 text-brand-600 border border-brand-200">
                    <Building2 className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 truncate">{company.name}</p>
                    {company.address?.city && (
                      <p className="text-xs text-slate-400 truncate">
                        {company.address.city}
                        {company.address.country ? `, ${company.address.country}` : ''}
                      </p>
                    )}
                  </div>
                </div>
              </td>
              <td className="py-3 px-4 text-slate-600">
                <span className="inline-block px-2 py-0.5 text-xs rounded-md bg-slate-100 border border-slate-200 text-slate-700">
                  {company.industry || 'General'}
                </span>
              </td>
              <td className="py-3 px-4 text-slate-600">
                <div className="space-y-0.5 text-xs">
                  {company.website && (
                    <a
                      href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-brand-600 hover:text-brand-700 cursor-pointer"
                    >
                      <Globe className="size-3" />
                      <span className="truncate max-w-[140px]">{company.website.replace(/^https?:\/\//, '')}</span>
                      <ExternalLink className="size-2.5 opacity-70" />
                    </a>
                  )}
                  {company.phone && (
                    <p className="flex items-center gap-1 text-slate-500">
                      <Phone className="size-3" />
                      <span>{company.phone}</span>
                    </p>
                  )}
                  {!company.website && !company.phone && <span className="text-slate-400">—</span>}
                </div>
              </td>
              <td className="py-3 px-4 font-mono text-xs font-medium text-slate-800">
                {formatInr(company.annualRevenue)}
              </td>
              <td className="py-3 px-4">
                <CompanyStatusBadge status={company.status} />
              </td>
              <td className="py-3 px-4 text-right">
                <Dropdown
                  label="Company actions"
                  align="end"
                  trigger={
                    <span className="flex size-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer">
                      <MoreVertical className="size-4" />
                    </span>
                  }
                >
                  <DropdownItem
                    label="Edit Company"
                    icon={Pencil}
                    onClick={() => onEdit(company)}
                  />
                  <DropdownItem
                    label="Delete Company"
                    icon={Trash2}
                    onClick={() => onDelete(company.id)}
                  />
                </Dropdown>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
