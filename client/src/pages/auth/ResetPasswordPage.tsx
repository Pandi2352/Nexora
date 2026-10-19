import { useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle2, Lock, XCircle } from 'lucide-react'
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
} from '@/components/ui'

export function ResetPasswordPage() {
  useDocumentTitle('Reset Password — Nexora OS')
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  if (!token) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center py-12">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-red-50 text-red-600">
              <XCircle className="size-6" />
            </div>
            <CardTitle className="mt-4 text-xl">Invalid reset link</CardTitle>
            <CardDescription>
              No password reset token was provided. Please check the link from your email or request
              a new one.
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center border-t border-slate-100 pt-4">
            <Link to="/forgot-password" className="w-full">
              <Button variant="outline" className="w-full">
                Request New Reset Link
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setIsSubmitting(true)

    try {
      await authService.resetPassword({ token, newPassword: password })
      setIsSuccess(true)
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Password reset token is invalid or has expired.'
      setError(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center py-12">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="size-6" />
            </div>
            <CardTitle className="mt-4 text-xl">Password updated!</CardTitle>
            <CardDescription>
              Your password has been reset successfully. All active sessions have been revoked.
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center border-t border-slate-100 pt-4">
            <Link to="/login" className="w-full">
              <Button variant="primary" className="w-full">
                Sign In with New Password
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Set new password</CardTitle>
          <CardDescription>Create a strong password for your Nexora OS account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                {error}
              </div>
            )}
            <Input
              label="New password"
              type="password"
              icon={Lock}
              required
              placeholder="Minimum 8 characters"
              hint="Must contain uppercase, lowercase, and a number or special character"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
            />
            <Input
              label="Confirm new password"
              type="password"
              icon={Lock}
              required
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isSubmitting}
            />
            <Button type="submit" variant="primary" className="w-full" loading={isSubmitting}>
              Update Password
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center border-t border-slate-100 pt-4 text-xs text-slate-500">
          <Link to="/login" className="font-semibold text-primary-600 hover:underline">
            Back to Sign In
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

export default ResetPasswordPage
