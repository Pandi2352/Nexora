import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Lock, Mail, User as UserIcon } from 'lucide-react'
import { SocialAuthButtons } from './SocialAuthButtons'
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

interface RegisterFormProps {
  onSubmit: (data: { name: string; email: string; password: string }) => Promise<void>
  isSubmitting: boolean
  error: string | null
  initialEmail?: string
}

/**
 * Registration form card with compact spacing, prefilled email support,
 * and 2-column social auth buttons to prevent vertical scrollbars.
 */
export function RegisterForm({
  onSubmit,
  isSubmitting,
  error,
  initialEmail = '',
}: RegisterFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState(initialEmail)
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string
    email?: string
    password?: string
  }>({})

  useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail)
    }
  }, [initialEmail])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const nextErrors: { name?: string; email?: string; password?: string } = {}

    if (!name.trim()) {
      nextErrors.name = 'Full name is required'
    }

    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      nextErrors.email = 'Work email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      nextErrors.email = 'Please enter a valid work email address'
    }

    if (!password) {
      nextErrors.password = 'Password is required'
    } else if (password.length < 8) {
      nextErrors.password = 'Password must be at least 8 characters'
    }

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors)
      return
    }

    setFieldErrors({})
    await onSubmit({ name: name.trim(), email: trimmedEmail, password })
  }

  return (
    <Card className="w-full bg-white/95 backdrop-blur-xs">
      <CardHeader className="text-center pt-5 pb-2 px-6 sm:px-8">
        <CardTitle className="text-xl font-bold">Create your account</CardTitle>
        <CardDescription className="text-xs">
          Get started with your company’s workspace on Nexora OS
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6 sm:px-8 pb-4">
        <form noValidate onSubmit={handleSubmit} className="space-y-3">
          {error && (
            <div
              role="alert"
              className="rounded-md border border-red-200 bg-red-50 p-2.5 text-xs text-red-700"
            >
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
            error={fieldErrors.name}
            onChange={(e) => {
              setName(e.target.value)
              if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: undefined }))
            }}
            disabled={isSubmitting}
          />

          <Input
            label="Work email"
            type="email"
            icon={Mail}
            required
            placeholder="you@company.com"
            value={email}
            error={fieldErrors.email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }))
            }}
            disabled={isSubmitting}
          />

          <Input
            label="Password"
            type="password"
            icon={Lock}
            required
            showPasswordStrength
            placeholder="Minimum 8 characters"
            hint="Requires uppercase, lowercase, and a number or symbol"
            value={password}
            error={fieldErrors.password}
            onChange={(e) => {
              setPassword(e.target.value)
              if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: undefined }))
            }}
            disabled={isSubmitting}
          />

          <Button type="submit" variant="primary" className="w-full" loading={isSubmitting}>
            Create Account
          </Button>
        </form>

        <div className="relative my-3 text-center text-xs text-slate-400">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <span className="relative bg-white px-2 text-slate-500">Or continue with</span>
        </div>

        <SocialAuthButtons disabled={isSubmitting} />
      </CardContent>
      <CardFooter className="justify-center border-t border-slate-100 py-3 text-xs text-slate-500">
        Already have an account?{' '}
        <Link
          to="/login"
          className="ml-1 font-semibold text-brand-600 hover:text-brand-700 hover:underline cursor-pointer"
        >
          Sign in
        </Link>
      </CardFooter>
    </Card>
  )
}
