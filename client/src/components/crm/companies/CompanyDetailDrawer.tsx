import { useEffect, useState } from 'react'
import {
  Briefcase,
  Calendar,
  ExternalLink,
  Globe,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Plus,
  Star,
  Users,
  X,
} from 'lucide-react'
import { Button, Spinner } from '@/components/ui'
import { crmService } from '@/services/crm.service'
import type { Company, CompanyDetail } from '@/types/crm'
import { CompanyStatusBadge } from './CompanyStatusBadge'
import { OpportunityStageBadge } from '../opportunities/OpportunityStageBadge'
import { formatINR } from '../crm-formatters'

interface CompanyDetailDrawerProps {
  isOpen: boolean
  company: Company | null
  slug: string
  onClose: () => void
  onEdit: (company: Company) => void
  onAddContact?: (company: Company) => void
  onAddDeal?: (company: Company) => void
}

export function CompanyDetailDrawer({
  isOpen,
  company,
  slug,
  onClose,
  onEdit,
  onAddContact,
  onAddDeal,
}: CompanyDetailDrawerProps) {
  const [detail, setDetail] = useState<CompanyDetail | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'contacts' | 'deals'>('overview')

  useEffect(() => {
    if (!isOpen || !company || !slug) {
      setDetail(null)
      return
    }

    const companyId = company.id || (company as any)._id
    if (!companyId) return

    setIsLoading(true)
    crmService
      .getCompany(slug, companyId)
      .then((data) => setDetail(data))
      .catch(() => setDetail(company as CompanyDetail))
      .finally(() => setIsLoading(false))
  }, [isOpen, company, slug])

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen || !company) return null

  const target = detail || company
  const contacts = detail?.contacts || []
  const deals = detail?.opportunities || []

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-[2px] animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-xl h-full bg-white border-l border-slate-200 flex flex-col text-slate-900 animate-in slide-in-from-right duration-200">
        {/* Header bar */}
        <div className="p-5 border-b border-slate-200 bg-slate-50/70 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-md border border-brand-200 bg-brand-50 text-brand-700 font-bold text-sm">
              {target.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-slate-900 truncate">{target.name}</h3>
                <CompanyStatusBadge status={target.status} />
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {target.industry || 'General Industry'} · {target.employeeCount || '11-50'} team
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shrink-0"
            aria-label="Close drawer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Quick KPI Strip */}
        <div className="grid grid-cols-3 border-b border-slate-200 bg-white p-3 text-center">
          <div className="border-r border-slate-100 px-2">
            <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Turnover</p>
            <p className="text-xs sm:text-sm font-bold text-emerald-700 font-mono mt-0.5 truncate">
              {target.annualRevenue ? formatINR(target.annualRevenue) : '—'}
            </p>
          </div>
          <div className="border-r border-slate-100 px-2">
            <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Contacts</p>
            <p className="text-xs sm:text-sm font-bold text-slate-900 font-mono mt-0.5">
              {contacts.length}
            </p>
          </div>
          <div className="px-2">
            <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Deals</p>
            <p className="text-xs sm:text-sm font-bold text-brand-600 font-mono mt-0.5">
              {deals.length}
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50/50 px-5 pt-2 gap-2 text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`pb-2.5 px-3 border-b-2 font-semibold transition-colors cursor-pointer ${
              activeTab === 'overview'
                ? 'border-brand-600 text-brand-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Account Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('contacts')}
            className={`pb-2.5 px-3 border-b-2 font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'contacts'
                ? 'border-brand-600 text-brand-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Linked Contacts</span>
            <span className="rounded-full bg-slate-200 px-1.5 py-0.2 text-[10px] text-slate-700 font-bold">
              {contacts.length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('deals')}
            className={`pb-2.5 px-3 border-b-2 font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'deals'
                ? 'border-brand-600 text-brand-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Pipeline Deals</span>
            <span className="rounded-full bg-slate-200 px-1.5 py-0.2 text-[10px] text-slate-700 font-bold">
              {deals.length}
            </span>
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <Spinner size="md" label="Loading account 360° profile..." />
            </div>
          ) : activeTab === 'overview' ? (
            <div className="space-y-4 text-xs">
              {/* Contact info card */}
              <div className="rounded-md border border-slate-200 p-4 space-y-3 bg-white">
                <h4 className="font-bold text-slate-800 uppercase text-[11px] tracking-wider border-b border-slate-100 pb-2">
                  Direct Communications
                </h4>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3">
                    <span className="flex size-7 items-center justify-center rounded-md bg-purple-50 text-purple-600 border border-purple-100 shrink-0">
                      <Mail className="size-3.5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[10px] text-slate-400">Corporate Email</p>
                      {target.email ? (
                        <a href={`mailto:${target.email}`} className="text-slate-700 font-medium hover:text-brand-600 hover:underline cursor-pointer truncate block">
                          {target.email}
                        </a>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="flex size-7 items-center justify-center rounded-md bg-sky-50 text-sky-600 border border-sky-100 shrink-0">
                      <Phone className="size-3.5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[10px] text-slate-400">Direct Telephone</p>
                      {target.phone ? (
                        <a href={`tel:${target.phone}`} className="text-slate-700 font-medium font-mono hover:text-brand-600 cursor-pointer truncate block">
                          {target.phone}
                        </a>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="flex size-7 items-center justify-center rounded-md bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
                      <Globe className="size-3.5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[10px] text-slate-400">Corporate Website</p>
                      {target.website ? (
                        <a
                          href={target.website.startsWith('http') ? target.website : `https://${target.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand-600 hover:underline inline-flex items-center gap-1 font-medium cursor-pointer truncate max-w-[280px]"
                        >
                          <span>{target.website.replace(/^https?:\/\//, '')}</span>
                          <ExternalLink className="size-2.5 opacity-60" />
                        </a>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Physical Address */}
              <div className="rounded-md border border-slate-200 p-4 space-y-2 bg-white">
                <h4 className="font-bold text-slate-800 uppercase text-[11px] tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <MapPin className="size-3.5 text-slate-400" /> Headquarters Address
                </h4>
                {target.address?.street || target.address?.city ? (
                  <div className="text-slate-700 leading-relaxed space-y-0.5">
                    {target.address.street && <p>{target.address.street}</p>}
                    <p>
                      {[target.address.city, target.address.state, target.address.postalCode]
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                    {target.address.country && (
                      <p className="font-semibold text-slate-800">{target.address.country}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-slate-400 italic">No physical address recorded</p>
                )}
              </div>
            </div>
          ) : activeTab === 'contacts' ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-semibold text-slate-700">Account Stakeholders</span>
                {onAddContact && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onAddContact(target)}
                    className="text-xs cursor-pointer"
                  >
                    <Plus className="size-3 mr-1" /> Add Contact
                  </Button>
                )}
              </div>

              {contacts.length === 0 ? (
                <div className="rounded-md border border-dashed border-slate-200 p-6 text-center text-xs text-slate-500">
                  <Users className="size-6 text-slate-300 mx-auto mb-1.5" />
                  <p className="font-medium text-slate-700">No contacts linked yet</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Add decision makers to track sales touchpoints and meetings.
                  </p>
                </div>
              ) : (
                contacts.map((c) => (
                  <div
                    key={c.id || (c as any)._id}
                    className="rounded-md border border-slate-200 bg-white p-3 space-y-1.5 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-xs">
                          {c.salutation ? `${c.salutation} ` : ''}
                          {c.firstName} {c.lastName}
                        </span>
                        {c.isPrimary && (
                          <span className="rounded-full bg-brand-50 border border-brand-200 text-brand-700 px-2 py-0.2 text-[10px] font-semibold">
                            Primary
                          </span>
                        )}
                      </div>
                      {c.designation && (
                        <span className="text-[11px] text-slate-500 font-medium truncate max-w-[150px]">
                          {c.designation}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                      <a href={`mailto:${c.email}`} className="flex items-center gap-1 hover:text-brand-600 hover:underline cursor-pointer">
                        <Mail className="size-3 text-slate-400" />
                        <span>{c.email}</span>
                      </a>
                      {c.phone && (
                        <a href={`tel:${c.phone}`} className="flex items-center gap-1 hover:text-brand-600 font-mono cursor-pointer">
                          <Phone className="size-3 text-slate-400" />
                          <span>{c.phone}</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-semibold text-slate-700">Pipeline Deals & Quotes</span>
                {onAddDeal && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onAddDeal(target)}
                    className="text-xs cursor-pointer"
                  >
                    <Plus className="size-3 mr-1" /> New Deal
                  </Button>
                )}
              </div>

              {deals.length === 0 ? (
                <div className="rounded-md border border-dashed border-slate-200 p-6 text-center text-xs text-slate-500">
                  <Briefcase className="size-6 text-slate-300 mx-auto mb-1.5" />
                  <p className="font-medium text-slate-700">No active opportunities</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Launch a sales opportunity to track stages and quotation values.
                  </p>
                </div>
              ) : (
                deals.map((opp) => (
                  <div
                    key={opp.id || (opp as any)._id}
                    className="rounded-md border border-slate-200 bg-white p-3 space-y-2 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="font-bold text-slate-900 text-xs truncate">
                          {opp.title}
                        </span>
                        {opp.isMustWin && (
                          <Star className="size-3.5 fill-amber-500 text-amber-500 shrink-0" />
                        )}
                      </div>
                      <OpportunityStageBadge stage={opp.stage} />
                    </div>

                    <div className="flex items-baseline justify-between pt-1 border-t border-slate-100">
                      <span className="text-sm font-bold text-slate-900 font-mono">
                        {formatINR(opp.value)}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {opp.probability}% win probability
                      </span>
                    </div>

                    {opp.quotationNumber && (
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                        <span className="font-mono">{opp.quotationNumber}</span>
                        {opp.expectedCloseDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="size-3" />
                            {opp.expectedCloseDate.slice(0, 10)}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/70 flex items-center justify-between gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onEdit(target)}
            className="cursor-pointer"
          >
            <Pencil className="size-3.5 mr-1.5" />
            Edit Company
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={onClose}
            className="cursor-pointer"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}
