import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Lock, Mail } from 'lucide-react'
import { useAuth } from '@/context/auth/auth-context'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { getApiErrorMessage } from '@/lib/errors'
import { SocialAuthButtons } from '@/components/auth/SocialAuthButtons'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
} from '@/components/ui'

/**
 * Atlassian/Jira-style two-step Sign In flow:
 * Step 1: Work email input + social providers
 * Step 2: Selected email pill + password input + "Can't log in?" recovery
 */
export function LoginPage() {
  useDocumentTitle('Sign In — Nexora OS')
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [step, setStep] = useState<'email' | 'password'>('email')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/workspaces'

  const handleEmailSubmit = (e: FormEvent) => {
    e.preventDefault(); setError(null); setEmailError(null)
    const trimmed = email.trim()
    if (!trimmed) return setEmailError('Work email is required')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      return setEmailError('Please enter a valid work email address')
    }
    setStep('password')
  }

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault(); setError(null); setPasswordError(null)
    if (!password) return setPasswordError('Password is required')
    setIsSubmitting(true)
    try {
      await login({ email: email.trim(), password })
      navigate(from, { replace: true })
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Invalid email or password. Please try again.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-sm sm:max-w-md">
      <Card className="w-full bg-white/95 backdrop-blur-xs">
        <CardHeader className="text-center pb-4 pt-6">
          <CardTitle className="text-xl sm:text-2xl font-bold">
            {step === 'email' ? 'Sign in to continue' : 'Enter your password'}
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            {step === 'email' ? 'Access your Nexora OS workspaces and tools' : 'Enter your password to complete sign in'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 px-6 sm:px-8 pb-6">
          {error && (
            <div
              role="alert"
              className="rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-700 space-y-1.5"
            >
              <div>{error}</div>
              {error.toLowerCase().includes('verify your email') && (
                <div className="pt-1">
                  <Link
                    to={`/verify-email?email=${encodeURIComponent(email.trim())}`}
                    className="font-semibold text-brand-700 underline hover:text-brand-900"
                  >
                    Enter your 6-digit verification code &rarr;
                  </Link>
                </div>
              )}
            </div>
          )}

          {step === 'email' ? (
            <form noValidate onSubmit={handleEmailSubmit} className="space-y-4">
              <Input
                label="Work email"
                type="email"
                icon={Mail}
                required
                autoFocus
                autoComplete="email"
                placeholder="you@company.com"
                value={email}
                error={emailError}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (emailError) setEmailError(null)
                }}
              />

              <Button type="submit" variant="primary" className="w-full">
                Continue
              </Button>

              <div className="relative my-4 text-center text-xs text-slate-400">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <span className="relative bg-white px-2.5 text-slate-500">Or continue with</span>
              </div>

              <SocialAuthButtons />
            </form>
          ) : (
            <form noValidate onSubmit={handlePasswordSubmit} className="space-y-4">
              <Input
                label="Email"
                type="email"
                icon={Mail}
                value={email}
                readOnly
                cornerAction={
                  <button
                    type="button"
                    onClick={() => {
                      setStep('email')
                      setPassword('')
                      setPasswordError(null)
                      setError(null)
                    }}
                    className="font-medium text-brand-600 hover:text-brand-700 hover:underline cursor-pointer text-xs"
                  >
                    Change
                  </button>
                }
                inputClassName="bg-slate-50 text-slate-700 border-slate-200 cursor-not-allowed select-none font-medium"
              />

              <Input
                label="Password"
                type="password"
                icon={Lock}
                required
                autoFocus
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                error={passwordError}
                cornerAction={
                  <Link
                    to="/forgot-password"
                    className="font-medium text-brand-600 hover:text-brand-700 hover:underline cursor-pointer"
                  >
                    Can't log in?
                  </Link>
                }
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (passwordError) setPasswordError(null)
                }}
                disabled={isSubmitting}
              />

              <Button type="submit" variant="primary" className="w-full" loading={isSubmitting}>
                Sign In
              </Button>
            </form>
          )}
        </CardContent>

        <CardFooter className="justify-center border-t border-slate-100 py-3.5 text-xs text-slate-500">
          Don't have an account?{' '}
          <Link
            to="/register"
            onMouseEnter={() => {
              void import('@/pages/auth/RegisterPage')
            }}
            className="ml-1 font-semibold text-brand-600 hover:text-brand-700 hover:underline cursor-pointer"
          >
            Sign up for an account
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

export default LoginPage
