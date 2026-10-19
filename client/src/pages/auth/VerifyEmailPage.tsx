import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Mail, RefreshCw } from 'lucide-react'
import { authService } from '@/services/auth.service'
import { useAuth } from '@/context/auth/auth-context'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { getApiErrorMessage } from '@/lib/errors'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  OtpInput,
} from '@/components/ui'

export function VerifyEmailPage() {
  useDocumentTitle('Verify Email — Nexora OS')
  const navigate = useNavigate()
  const { setUser } = useAuth()
  const [searchParams] = useSearchParams()

  const urlEmail = searchParams.get('email') || ''
  const urlCode = searchParams.get('code') || ''
  const urlToken = searchParams.get('token') || ''

  const [email, setEmail] = useState(urlEmail)
  const [otp, setOtp] = useState(urlCode)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Resend cooldown timer
  const [cooldown, setCooldown] = useState(0)
  const [resendStatus, setResendStatus] = useState<string | null>(null)

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  const handleVerify = useCallback(
    async (codeToVerify: string, emailToVerify: string) => {
      setError(null)
      setIsSubmitting(true)
      try {
        const res = await authService.verifyEmail(
          urlToken
            ? { token: urlToken }
            : { code: codeToVerify, email: emailToVerify.trim() },
        )
        if (res.user) {
          setUser(res.user)
        }
        setIsSuccess(true)
        setTimeout(() => {
          navigate('/workspaces', { replace: true })
        }, 1200)
      } catch (err: unknown) {
        setError(getApiErrorMessage(err, 'Verification failed. Please check your code.'))
      } finally {
        setIsSubmitting(false)
      }
    },
    [navigate, setUser, urlToken],
  )

  // Auto-verify if full link with token or prefilled code & email was clicked
  useEffect(() => {
    if (urlToken) {
      void handleVerify('', '')
    } else if (urlCode.length === 6 && urlEmail) {
      void handleVerify(urlCode, urlEmail)
    }
  }, [handleVerify, urlCode, urlEmail, urlToken])

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (otp.length !== 6) {
      setError('Please enter all 6 digits of your verification code.')
      return
    }
    if (!email.trim() && !urlToken) {
      setError('Email address is required to verify code.')
      return
    }
    void handleVerify(otp, email)
  }

  const handleResend = async () => {
    if (cooldown > 0 || !email.trim()) return
    setError(null)
    setResendStatus(null)
    try {
      const msg = await authService.resendVerification(email.trim())
      setResendStatus(msg || 'A new 6-digit code has been sent to your email.')
      setCooldown(60)
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Failed to resend code. Please try again.'))
    }
  }

  return (
    <div className="w-full max-w-sm sm:max-w-md">
      <Card className="w-full text-center bg-white/95 backdrop-blur-xs">
        {isSuccess ? (
          <>
            <CardHeader>
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="size-6" />
              </div>
              <CardTitle className="mt-4 text-xl">Email verified!</CardTitle>
              <CardDescription>
                Your email has been confirmed. Redirecting to your workspace...
              </CardDescription>
            </CardHeader>
            <CardFooter className="justify-center border-t border-slate-100 pt-4">
              <Link to="/workspaces" className="w-full">
                <Button variant="primary" className="w-full cursor-pointer">
                  Continue to Workspaces
                </Button>
              </Link>
            </CardFooter>
          </>
        ) : (
          <>
            <CardHeader className="pb-3">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                <Mail className="size-6" />
              </div>
              <CardTitle className="mt-4 text-xl">Enter verification code</CardTitle>
              <CardDescription className="text-slate-600 text-xs sm:text-sm">
                We sent a 6-digit code to{' '}
                <strong className="text-slate-800">{email || 'your email address'}</strong>. Enter it
                below to activate your account.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 pt-2">
              {error && (
                <div className="p-3 text-xs rounded-md bg-red-50 text-red-700 border border-red-200 text-center">
                  {error}
                </div>
              )}

              {resendStatus && (
                <div className="p-3 text-xs rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-center">
                  {resendStatus}
                </div>
              )}

              <form onSubmit={onSubmit} className="space-y-4">
                {!urlEmail && (
                  <div className="text-left">
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Account Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-sm rounded-md border border-slate-300 px-3 py-2 focus:border-brand-600 focus:outline-none"
                    />
                  </div>
                )}

                <OtpInput
                  value={otp}
                  onChange={(val) => {
                    setOtp(val)
                    if (error) setError(null)
                  }}
                  error={!!error}
                  disabled={isSubmitting}
                />

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full cursor-pointer"
                  disabled={otp.length !== 6 || isSubmitting}
                  loading={isSubmitting}
                >
                  Verify & Continue
                </Button>
              </form>

              <div className="pt-2 text-center text-xs text-slate-500">
                <span>Didn't receive a code? </span>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={cooldown > 0 || isSubmitting}
                  className={`font-semibold transition-colors cursor-pointer ${
                    cooldown > 0
                      ? 'text-slate-400 cursor-not-allowed'
                      : 'text-brand-600 hover:text-brand-700 hover:underline'
                  }`}
                >
                  {cooldown > 0 ? (
                    `Resend code in ${cooldown}s`
                  ) : (
                    <span className="inline-flex items-center gap-1">
                      <RefreshCw className="size-3" /> Resend code
                    </span>
                  )}
                </button>
              </div>
            </CardContent>

            <CardFooter className="justify-center border-t border-slate-100 pt-4 text-xs">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <ArrowLeft className="size-3.5" /> Back to Sign In
              </Link>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  )
}

export default VerifyEmailPage
