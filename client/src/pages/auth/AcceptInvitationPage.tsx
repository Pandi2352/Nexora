import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Building2, CheckCircle2, UserCheck } from 'lucide-react'
import { useAuth } from '@/context/auth/auth-context'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Input } from '@/components/ui'
import { extractApiError } from '@/lib/api-client'
import { memberService } from '@/services/member.service'

export default function AcceptInvitationPage() {
  useDocumentTitle('Accept Invitation — Nexora OS')
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const orgName = searchParams.get('org') || 'Acme Technologies'
  const inviterName = searchParams.get('inviter') || 'Sarah Chen'
  const inviterEmail = searchParams.get('email') || ''

  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [accepted, setAccepted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAccept = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    try {
      if (token) {
        await memberService.acceptInvitation({
          token,
          name: fullName || undefined,
          password: password || undefined,
        })
      }
      setAccepted(true)
      setTimeout(() => navigate('/workspaces'), 1200)
    } catch (err) {
      const parsed = extractApiError(err)
      setError(parsed.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (accepted) {
    return (
      <div className="w-full max-w-sm sm:max-w-md">
        <Card className="w-full bg-white text-center p-6 sm:p-8">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-4">
            <CheckCircle2 className="size-6" />
          </div>
          <CardTitle className="text-xl font-bold">Welcome to {orgName}!</CardTitle>
          <CardDescription className="mt-2 text-sm">
            Your invitation was accepted successfully. Redirecting to workspaces...
          </CardDescription>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full max-w-sm sm:max-w-md">
      <Card className="w-full bg-white">
        <CardHeader className="text-center pb-4 pt-6">
          <div className="mx-auto flex size-11 items-center justify-center rounded-md bg-brand-50 text-brand-600 mb-3 border border-brand-200">
            <Building2 className="size-5" />
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold">Join {orgName}</CardTitle>
          <CardDescription className="text-xs sm:text-sm mt-1">
            <span className="font-medium text-slate-700">{inviterName}</span> invited you to collaborate in their Nexora OS workspace.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-md border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
              {error}
            </div>
          )}
          <form id="invite-form" onSubmit={handleAccept} className="space-y-3.5">
            {isAuthenticated ? (
              <div className="rounded-md border border-slate-200 bg-slate-50 p-3 flex items-center gap-3">
                <UserCheck className="size-4 text-emerald-600 shrink-0" />
                <div className="min-w-0 text-xs">
                  <p className="font-semibold text-slate-800">Signed in as {user?.name}</p>
                  <p className="text-slate-500 truncate">{user?.email}</p>
                </div>
              </div>
            ) : (
              <>
                <Input
                  label="Work Email"
                  type="email"
                  value={inviterEmail}
                  readOnly
                  disabled={!!inviterEmail}
                  hint="This invitation was sent specifically to this address."
                />
                <Input
                  label="Your Full Name"
                  placeholder="Jane Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
                <Input
                  label="Create a Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  showPasswordToggle
                  showPasswordStrength
                  required
                />
              </>
            )}
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 pb-6 pt-2">
          <Button
            type="submit"
            form="invite-form"
            loading={isSubmitting}
            className="w-full justify-center"
          >
            {isAuthenticated ? 'Accept & Join Workspace' : 'Create Account & Join'}
          </Button>

          <p className="text-center text-xs text-slate-500">
            Have a different account?{' '}
            <Link to="/login" className="text-brand-600 hover:text-brand-700 font-semibold cursor-pointer">
              Sign in with another email
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
