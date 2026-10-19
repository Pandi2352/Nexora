import { Link, Outlet } from 'react-router-dom'
import { Logo } from '@/components/common/Logo'
import { AuthCornerIllustrations } from '@/components/auth/AuthCornerIllustrations'
import { TopNavigationProgress } from '@/components/common/TopNavigationProgress'

/**
 * Authentication layout for Login, Register, Forgot Password, and Reset Password.
 * Locked to viewport height with corner graphics pinned flush to the bottom-left and bottom-right edges.
 */
export function AuthLayout() {
  return (
    <div className="relative flex h-dvh max-h-dvh w-full flex-col justify-between overflow-hidden bg-white select-none">
      <TopNavigationProgress />
      {/* Corner illustrations directly in bottom corners without any spacing */}
      <AuthCornerIllustrations />

      {/* Top Brand Header */}
      <header className="relative z-10 flex shrink-0 items-center justify-center pt-4 sm:pt-6 px-4">
        <Link to="/" className="transition-opacity hover:opacity-90">
          <Logo size="lg" />
        </Link>
      </header>

      {/* Main Content: Perfectly centered with no scroll spill */}
      <main
        id="main-content"
        className="relative z-10 flex w-full flex-1 items-center justify-center px-4 py-2 overflow-y-auto sm:overflow-visible"
      >
        <Outlet />
      </main>

      {/* Footer Note */}
      <footer className="relative z-10 shrink-0 text-center text-[11px] sm:text-xs text-slate-400 pb-3 sm:pb-4 px-4">
        <span>One account for all Nexora OS workspaces and developer tools</span>
      </footer>
    </div>
  )
}
