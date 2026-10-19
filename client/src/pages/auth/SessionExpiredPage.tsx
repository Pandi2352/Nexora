import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LockKeyhole } from 'lucide-react'
import { useAuth } from '@/context/auth/auth-context'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Input } from '@/components/ui'

export default function SessionExpiredPage() {
  useDocumentTitle('Session Expired — Nexora OS')
  const { login, user } = useAuth()
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleReauth = async (e: FormEvent) => {
    e.preventDefault()
    if (!password) {
      setError('Password is required')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      if (user?.email) {
        await login({ email: user.email, password })
        navigate('/workspaces', { replace: true })
      } else {
        navigate('/login', { replace: true })
      }
    } catch {
      setError('Invalid password. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-sm sm:max-w-md">
      <Card className="w-full bg-white">
        <CardHeader className="text-center pb-4 pt-6">
          <div className="mx-auto flex size-11 items-center justify-center rounded-md bg-amber-50 text-amber-600 mb-3 border border-amber-200">
            <LockKeyhole className="size-5" />
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold">Session expired</CardTitle>
          <CardDescription className="text-xs sm:text-sm mt-1">
            Your secure session ended due to inactivity. Enter your password to continue without losing your place.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <form id="reauth-form" onSubmit={handleReauth} className="space-y-3.5">
            {user?.email ? (
              <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Account</p>
                <p className="text-xs font-semibold text-slate-900 mt-0.5">{user.name || user.email}</p>
                <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
              </div>
            ) : null}

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={error ?? undefined}
              showPasswordToggle
              autoFocus
              required
            />
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 pb-6 pt-2">
          <Button
            type="submit"
            form="reauth-form"
            loading={isSubmitting}
            className="w-full justify-center"
          >
            Unlock & Resume
          </Button>

          <Link
            to="/login"
            className="text-center text-xs text-slate-500 hover:text-slate-800 transition cursor-pointer"
          >
            Sign in with a different account
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
