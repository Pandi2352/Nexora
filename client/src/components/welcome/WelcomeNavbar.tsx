import { Link } from 'react-router-dom'
import { Logo } from '@/components/common/Logo'

interface WelcomeNavbarProps {
  onOpenSignUp: () => void
}

/**
 * Top navigation bar for the public Welcome landing page.
 */
export function WelcomeNavbar({ onOpenSignUp }: WelcomeNavbarProps) {
  return (
    <header className="relative z-20 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 sm:px-8 backdrop-blur-xs">
      <Link to="/" className="transition-opacity hover:opacity-90">
        <Logo size="md" />
      </Link>

      <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
        <a href="#features" className="hover:text-slate-900 transition">Features</a>
        <a href="#architecture" className="hover:text-slate-900 transition">Multi-Tenancy</a>
        <a href="#security" className="hover:text-slate-900 transition">Security</a>
      </nav>

      <div className="flex items-center gap-3">
        <Link
          to="/login"
          className="text-sm font-medium text-slate-700 hover:text-slate-900 px-3 py-1.5 transition cursor-pointer"
        >
          Sign in
        </Link>
        <button
          type="button"
          onClick={onOpenSignUp}
          className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 cursor-pointer shadow-none"
        >
          Get it free
        </button>
      </div>
    </header>
  )
}
