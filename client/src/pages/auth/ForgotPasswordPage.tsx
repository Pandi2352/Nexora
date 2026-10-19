import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Mail } from 'lucide-react'
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

export function ForgotPasswordPage() {
  useDocumentTitle('Forgot Password — Nexora OS')

  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await authService.forgotPassword(email)
    } finally {
      setIsSuccess(true)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center py-12">
      <Card className="w-full max-w-md">
        {isSuccess ? (
          <>
            <CardHeader className="text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="size-6" />
              </div>
              <CardTitle className="mt-4 text-xl">Check your email</CardTitle>
              <CardDescription>
                If an active account exists for <strong className="text-slate-800">{email}</strong>,
                we've sent instructions to reset your password.
              </CardDescription>
            </CardHeader>
            <CardFooter className="justify-center border-t border-slate-100 pt-4">
              <Link to="/login" className="w-full">
                <Button variant="outline" className="w-full">
                  Return to Sign In
                </Button>
              </Link>
            </CardFooter>
          </>
        ) : (
          <>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Forgot your password?</CardTitle>
              <CardDescription>
                Enter your account email address and we'll send you a password reset link.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Email address"
                  type="email"
                  icon={Mail}
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                />
                <Button type="submit" variant="primary" className="w-full" loading={isSubmitting}>
                  Send Reset Link
                </Button>
              </form>
            </CardContent>
            <CardFooter className="justify-center border-t border-slate-100 pt-4 text-xs text-slate-500">
              <Link
                to="/login"
                className="inline-flex items-center gap-1 font-semibold text-primary-600 hover:underline"
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

export default ForgotPasswordPage
