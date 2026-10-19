import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, X } from 'lucide-react'
import { Logo } from '@/components/common/Logo'
import { SocialAuthButtons } from '@/components/auth/SocialAuthButtons'
import { Button, Input } from '@/components/ui'

interface SignUpModalProps {
  isOpen: boolean
  onClose: () => void
  initialEmail?: string
}

/**
 * Jira-style Sign up Modal dialog with work email and social login options.
 * Submitting navigates cleanly to /register with prefilled email.
 */
export function SignUpModal({ isOpen, onClose, initialEmail = '' }: SignUpModalProps) {
  const [email, setEmail] = useState(initialEmail)
  const [emailError, setEmailError] = useState<string | null>(null)
  const navigate = useNavigate()

  if (!isOpen) return null

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

    onClose()
    navigate('/register', { state: { prefilledEmail: trimmed } })
  }

  const handleSocialSelect = () => {
    onClose()
    navigate('/register', { state: { prefilledEmail: email.trim() } })
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm sm:max-w-md rounded-md border border-slate-200 bg-white p-6 sm:p-8 shadow-none animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close modal"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition p-1 rounded-md cursor-pointer"
        >
          <X className="size-5" />
        </button>

        <div className="text-center">
          <div className="mx-auto mb-3 flex justify-center">
            <Logo size="md" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Get started with <span className="text-brand-600">Nexora OS</span>
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            It's free for up to 10 users — no credit card needed.
          </p>
        </div>

        <form noValidate onSubmit={handleSubmit} className="mt-5 space-y-3">
          <Input
            label="Work email"
            type="email"
            icon={Mail}
            required
            autoFocus
            value={email}
            error={emailError}
            hint="Using a work email helps find teammates and boost collaboration."
            onChange={(e) => {
              setEmail(e.target.value)
              if (emailError) setEmailError(null)
            }}
            placeholder="you@company.com"
          />

          <Button type="submit" variant="primary" className="w-full">
            Sign up
          </Button>
        </form>

        <div className="relative my-4 text-center text-xs text-slate-400">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <span className="relative bg-white px-2.5 text-slate-500">Or continue with</span>
        </div>

        <SocialAuthButtons onSelectProvider={handleSocialSelect} />

        <div className="mt-5 text-center text-xs text-slate-500">
          Already have Nexora?{' '}
          <Link
            to="/login"
            onClick={onClose}
            className="font-semibold text-brand-600 hover:text-brand-700 hover:underline cursor-pointer"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  )
}
