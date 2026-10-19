import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AlertCircle } from 'lucide-react'
import { useAuth } from '@/context/auth/auth-context'
import { setAccessToken } from '@/lib/api'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { Button, Card, CardDescription, CardFooter, CardTitle, Spinner } from '@/components/ui'

export default function OAuthCallbackPage() {
  useDocumentTitle('Authenticating — Nexora OS')
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { setUser } = useAuth()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = searchParams.get('token')
    const err = searchParams.get('error')

    if (err) {
      setError(decodeURIComponent(err))
      return
    }

    if (token) {
      setAccessToken(token)
      // If user object is passed or can be fetched
      navigate('/workspaces', { replace: true })
    } else {
      // Simulate quick resolution if returning from simulated provider
      const timer = setTimeout(() => {
        navigate('/workspaces', { replace: true })
      }, 700)
      return () => clearTimeout(timer)
    }
  }, [searchParams, navigate, setUser])

  if (error) {
    return (
      <div className="w-full max-w-sm sm:max-w-md">
        <Card className="w-full bg-white text-center p-6">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-red-50 text-red-600 mb-4">
            <AlertCircle className="size-6" />
          </div>
          <CardTitle className="text-xl font-bold">Authentication failed</CardTitle>
          <CardDescription className="mt-2 text-sm text-slate-600">
            {error || 'Unable to complete sign in with social provider.'}
          </CardDescription>
          <CardFooter className="mt-6 flex justify-center">
            <Button onClick={() => navigate('/login')} className="justify-center">
              Back to Sign In
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full max-w-sm sm:max-w-md">
      <Card className="w-full bg-white text-center p-8">
        <div className="mx-auto flex justify-center mb-4">
          <Spinner size="lg" variant="brand" label="Completing sign in..." />
        </div>
        <CardTitle className="text-lg font-bold">Connecting your account</CardTitle>
        <CardDescription className="mt-1.5 text-xs text-slate-500">
          Securing session and preparing your Nexora workspaces...
        </CardDescription>
      </Card>
    </div>
  )
}
