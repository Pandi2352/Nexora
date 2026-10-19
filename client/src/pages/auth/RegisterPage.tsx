import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, Lock, Mail, User as UserIcon } from 'lucide-react'
import { useAuth } from '@/context/auth/auth-context'
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

export function RegisterPage() {
  useDocumentTitle('Create Account — Nexora OS')
  const { register } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await register({ name, email, password })
      setIsSuccess(true)
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to create account. Please try again.'
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
            <CardTitle className="mt-4 text-xl">Verify your email address</CardTitle>
            <CardDescription className="text-slate-600">
              We've dispatched a verification link to{' '}
              <strong className="text-slate-800">{email}</strong>. Please check your inbox to
              activate your account.
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center border-t border-slate-100 pt-4">
            <Link to="/login" className="w-full">
              <Button variant="primary" className="w-full">
                Proceed to Sign In
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
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>
            Get started with unified business operations on Nexora OS
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                {error}
              </div>
            )}
            <Input
              label="Full name"
              type="text"
              icon={UserIcon}
              required
              placeholder="Alex Smith"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
            />
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
            <Input
              label="Password"
              type="password"
              icon={Lock}
              required
              placeholder="Minimum 8 characters"
              hint="Must contain uppercase, lowercase, and a number or special character"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
            />
            <Button type="submit" variant="primary" className="w-full" loading={isSubmitting}>
              Create Account
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center border-t border-slate-100 pt-4 text-xs text-slate-500">
          Already have an account?{' '}
          <Link
            to="/login"
            className="ml-1 font-semibold text-primary-600 hover:text-primary-700 hover:underline"
          >
            Sign in
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

export default RegisterPage
