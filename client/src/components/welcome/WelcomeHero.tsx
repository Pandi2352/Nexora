import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Building2, CheckCircle2, Mail, ShieldCheck, Zap } from 'lucide-react'
import { SocialAuthButtons } from '@/components/auth/SocialAuthButtons'
import { Button, Input } from '@/components/ui'

interface WelcomeHeroProps {
  onStartSignUp?: (email: string) => void
}

/**
 * Hero section for the Welcome page with inline email signup shortcut and value propositions.
 * Submitting directly navigates to /register with the prefilled email.
 */
export function WelcomeHero({ onStartSignUp }: WelcomeHeroProps) {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setEmailError(null)

    const trimmed = email.trim()
    if (!trimmed) {
      setEmailError('Work email is required')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(trimmed)) {
      setEmailError('Please enter a valid work email address')
      return
    }

    onStartSignUp?.(trimmed)
    navigate('/register', { state: { prefilledEmail: trimmed } })
  }

  const handleSocialSelect = () => {
    navigate('/register', { state: { prefilledEmail: email.trim() } })
  }

  return (
    <section className="relative z-10 mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
      <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
        {/* Left Column: Heading & Value Prop */}
        <div className="lg:col-span-7">
          <div className="inline-flex items-center gap-2 rounded-md border border-brand-200 bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">
            <span className="flex size-1.5 rounded-full bg-brand-600 animate-pulse" />
            Nexora OS Enterprise SaaS
          </div>

          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Turn ideas into <span className="text-brand-600">forward motion</span>
          </h1>

          <p className="mt-4 text-lg text-slate-600 leading-relaxed max-w-xl">
            Nexora OS gives teams and operators the context, coordination, and control to move
            from intent to impact across multi-tenant workspaces.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-start gap-2.5">
              <Building2 className="size-4.5 text-brand-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-900">Multi-Tenancy</p>
                <p className="text-[11px] text-slate-500">Isolated workspace data</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="size-4.5 text-brand-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-900">Zero-Trust</p>
                <p className="text-[11px] text-slate-500">Argon2id + UUID v4</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Zap className="size-4.5 text-brand-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-900">Observability</p>
                <p className="text-[11px] text-slate-500">Real-time HTTP telemetry</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Quick Email Shortcut Card */}
        <div className="lg:col-span-5">
          <div className="rounded-md border border-slate-200/90 bg-white/95 p-6 sm:p-8 backdrop-blur-xs">
            <h2 className="text-lg font-bold text-slate-900">Get started today</h2>
            <p className="mt-1 text-xs text-slate-500">
              Free for up to 10 users. No credit card required.
            </p>

            <form noValidate onSubmit={handleSubmit} className="mt-5 space-y-3">
              <Input
                label="Work email"
                type="email"
                icon={Mail}
                required
                placeholder="you@company.com"
                value={email}
                error={emailError}
                hint="Use a work email to find teammates and get access to Nexora AI"
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (emailError) setEmailError(null)
                }}
              />

              <Button type="submit" variant="primary" className="w-full">
                <span>Sign up</span>
                <ArrowRight className="size-3.5 ml-1.5" />
              </Button>
            </form>

            <div className="relative my-4 text-center text-xs text-slate-400">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <span className="relative bg-white px-2.5 text-slate-500">Or continue with</span>
            </div>

            <SocialAuthButtons onSelectProvider={handleSocialSelect} />

            <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-400">
              <CheckCircle2 className="size-3.5 text-emerald-600" />
              <span>Instant workspace setup in under 60 seconds</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
