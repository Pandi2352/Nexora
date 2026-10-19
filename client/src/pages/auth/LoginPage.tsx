import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Lock, Mail } from 'lucide-react'
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

export function LoginPage() {
  useDocumentTitle('Sign In — Nexora OS')
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/workspaces'

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await login({ email, password })
      navigate(from, { replace: true })
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Invalid email or password'
      setError(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Sign in to Nexora OS</CardTitle>
          <CardDescription>Enter your email and password to access your workspaces</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                {error}
              </div>
            )}
            <Input
              label="Email address"
              type="email"
              icon={Mail}
              required
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">Password</label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-primary-600 hover:text-primary-700 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                type="password"
                icon={Lock}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <Button type="submit" variant="primary" className="w-full" loading={isSubmitting}>
              Sign In
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center border-t border-slate-100 pt-4 text-xs text-slate-500">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="ml-1 font-semibold text-primary-600 hover:text-primary-700 hover:underline"
          >
            Create an account
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

export default LoginPage
