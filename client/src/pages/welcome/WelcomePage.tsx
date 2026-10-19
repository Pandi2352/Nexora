import { useState } from 'react'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { InteractiveGridBackground } from '@/components/common/InteractiveGridBackground'
import { WelcomeNavbar } from '@/components/welcome/WelcomeNavbar'
import { WelcomeHero } from '@/components/welcome/WelcomeHero'
import { SignUpModal } from '@/components/welcome/SignUpModal'

/**
 * Public Welcome Landing Page for Nexora OS.
 * Features the interactive square grid hover background effect exclusively on this page.
 */
export default function WelcomePage() {
  useDocumentTitle('Nexora OS — Turn ideas into forward motion')

  const [isSignUpOpen, setIsSignUpOpen] = useState(false)
  const [initialEmail, setInitialEmail] = useState('')

  const handleOpenSignUp = (email = '') => {
    setInitialEmail(email)
    setIsSignUpOpen(true)
  }

  return (
    <div className="relative min-h-dvh flex flex-col justify-between overflow-x-hidden bg-white">
      {/* Interactive hover squares background on Welcome page only */}
      <InteractiveGridBackground cellSize={52} radius={240} />

      <WelcomeNavbar onOpenSignUp={() => handleOpenSignUp('')} />

      <main className="flex-1 flex flex-col justify-center">
        <WelcomeHero onStartSignUp={handleOpenSignUp} />
      </main>

      <footer className="relative z-10 border-t border-slate-200/80 bg-white/70 py-6 text-center text-xs text-slate-500 backdrop-blur-xs">
        <p>© Nexora OS · Enterprise Multi-Tenant Business Operating System</p>
      </footer>

      {/* Jira-style sign up popup modal */}
      <SignUpModal
        isOpen={isSignUpOpen}
        onClose={() => setIsSignUpOpen(false)}
        initialEmail={initialEmail}
      />
    </div>
  )
}
