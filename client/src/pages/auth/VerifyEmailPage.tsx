import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle2, Mail, XCircle } from 'lucide-react'
import { authService } from '@/services/auth.service'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Skeleton,
} from '@/components/ui'

export function VerifyEmailPage() {
  useDocumentTitle('Verify Email — Nexora OS')
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [isLoading, setIsLoading] = useState(!!token)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [resendEmail, setResendEmail] = useState('')
  const [resendStatus, setResendStatus] = useState<string | null>(null)
  const [isResending, setIsResending] = useState(false)

  useEffect(() => {
    if (!token) {
      setError('No verification token provided. Please check the link from your email.')
      return
    }

    let isMounted = true
    authService
      .verifyEmail(token)
      .then(() => {
        if (isMounted) setIsSuccess(true)
      })
      .catch((err: any) => {
        if (isMounted) {
          const msg = err.response?.data?.message || 'Verification token is invalid or has expired.'
          setError(msg)
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [token])

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsResending(true)
    setResendStatus(null)

    try {
      const msg = await authService.resendVerification(resendEmail)
      setResendStatus(msg)
    } catch {
      setResendStatus('If an account exists, a link was sent.')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center py-12">
      <Card className="w-full max-w-md text-center">
        {isLoading ? (
          <CardContent className="space-y-4 py-12">
            <Skeleton className="mx-auto size-12 rounded-full" />
            <Skeleton className="mx-auto h-6 w-48 rounded-md" />
            <Skeleton className="mx-auto h-4 w-64 rounded-md" />
          </CardContent>
        ) : isSuccess ? (
          <>
            <CardHeader>
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="size-6" />
              </div>
              <CardTitle className="mt-4 text-xl">Email verified!</CardTitle>
              <CardDescription>
                Your email address has been confirmed. You can now sign in to your Nexora OS
                account.
              </CardDescription>
            </CardHeader>
            <CardFooter className="justify-center border-t border-slate-100 pt-4">
              <Link to="/login" className="w-full">
                <Button variant="primary" className="w-full">
                  Sign In
                </Button>
              </Link>
            </CardFooter>
          </>
        ) : (
          <>
            <CardHeader>
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-red-50 text-red-600">
                <XCircle className="size-6" />
              </div>
              <CardTitle className="mt-4 text-xl">Verification failed</CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleResend} className="space-y-3 text-left">
                <p className="text-xs font-medium text-slate-700">Need a new verification link?</p>
                <Input
                  type="email"
                  icon={Mail}
                  required
                  placeholder="Enter your registered email"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  disabled={isResending}
                />
                <Button
                  type="submit"
                  variant="outline"
                  size="sm"
                  className="w-full"
                  loading={isResending}
                >
                  Resend Verification Email
                </Button>
                {resendStatus && (
                  <p className="text-xs text-emerald-600 text-center">{resendStatus}</p>
                )}
              </form>
            </CardContent>
            <CardFooter className="justify-center border-t border-slate-100 pt-4 text-xs text-slate-500">
              <Link to="/login" className="font-semibold text-primary-600 hover:underline">
                Return to Sign In
              </Link>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  )
}

export default VerifyEmailPage
