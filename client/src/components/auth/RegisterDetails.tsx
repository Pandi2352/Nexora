import { Building2, CheckCircle2, ShieldCheck, Zap } from 'lucide-react'

/**
 * Left-side overview presenting Nexora OS project capabilities and architecture.
 */
export function RegisterDetails() {
  const highlights = [
    {
      icon: Building2,
      title: 'Multi-Tenant Architecture',
      description:
        'Complete workspace isolation, organization scoping, and dynamic domain routing out of the box.',
    },
    {
      icon: ShieldCheck,
      title: 'Enterprise-Grade Security',
      description:
        'Argon2id password hashing, rotating cryptographic sessions, and zero-trust authorization.',
    },
    {
      icon: Zap,
      title: 'Real-Time Observability',
      description:
        'Unified HTTP logging, sub-millisecond telemetry, and reliable transactional notifications.',
    },
  ]

  return (
    <div className="flex flex-col justify-between py-6 lg:pr-8">
      <div>
        <div className="inline-flex items-center gap-2 rounded-md border border-brand-200 bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">
          <span className="flex size-1.5 rounded-full bg-brand-600 animate-pulse" />
          Nexora OS v1.0
        </div>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Unified operations for modern enterprises
        </h1>

        <p className="mt-3 text-base text-slate-600 leading-relaxed">
          Streamline your company’s business operations, multi-tenant workspaces, and team
          management in a single high-performance operating system.
        </p>

        <div className="mt-8 space-y-5">
          {highlights.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.title} className="flex items-start gap-3.5">
                <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-white text-brand-600">
                  <Icon className="size-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-0.5 text-xs text-slate-500 leading-normal">{item.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-10 border-t border-slate-200/80 pt-6">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <CheckCircle2 className="size-4 text-emerald-600" />
          <span>Zero-trust architecture · Fully audited · 99.99% uptime target</span>
        </div>
      </div>
    </div>
  )
}
