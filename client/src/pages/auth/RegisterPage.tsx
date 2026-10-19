import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '@/context/auth/auth-context'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { getApiErrorMessage } from '@/lib/errors'
import { RegisterForm } from '@/components/auth/RegisterForm'
import { RegisterSuccess } from '@/components/auth/RegisterSuccess'

/**
 * RegisterPage coordinates state and renders a focused registration card
 * matching the unified layout of all authentication pages.
 */
export function RegisterPage() {
  useDocumentTitle('Create Account — Nexora OS')
  const { register } = useAuth()
  const location = useLocation()
  const prefilledEmail = (location.state as { prefilledEmail?: string })?.prefilledEmail || ''

  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState(prefilledEmail)

  const handleRegister = async (data: { name: string; email: string; password: string }) => {
    setError(null)
    setIsSubmitting(true)

    try {
      await register(data)
      setSubmittedEmail(data.email)
      setIsSuccess(true)
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Failed to create account. Please try again.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="w-full max-w-sm sm:max-w-md">
        <RegisterSuccess email={submittedEmail} />
      </div>
    )
  }

  return (
    <div className="w-full max-w-sm sm:max-w-md">
      <RegisterForm
        onSubmit={handleRegister}
        isSubmitting={isSubmitting}
        error={error}
        initialEmail={prefilledEmail}
      />
    </div>
  )
}

export default RegisterPage
