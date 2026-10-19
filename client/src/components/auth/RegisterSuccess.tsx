import { Link } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import { Button, Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui'

interface RegisterSuccessProps {
  email: string
}

/**
 * Success view shown once registration request succeeds, directing user to check email.
 */
export function RegisterSuccess({ email }: RegisterSuccessProps) {
  return (
    <Card className="w-full text-center bg-white/95 backdrop-blur-xs">
      <CardHeader>
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="size-6" />
        </div>
        <CardTitle className="mt-4 text-xl">Verify your email address</CardTitle>
        <CardDescription className="text-slate-600">
          We've sent a 6-digit verification code to{' '}
          <strong className="text-slate-800">{email}</strong>. Please enter the code to
          activate your account and get started.
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex-col gap-2 border-t border-slate-100 pt-4">
        <Link to={`/verify-email?email=${encodeURIComponent(email)}`} className="w-full">
          <Button variant="primary" className="w-full cursor-pointer">
            Enter 6-Digit Code
          </Button>
        </Link>
        <Link to="/login" className="text-xs text-slate-500 hover:text-slate-800">
          Back to Sign In
        </Link>
      </CardFooter>
    </Card>
  )
}
