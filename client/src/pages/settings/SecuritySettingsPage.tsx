import { useState } from 'react'
import {
  CheckCircle2,
  KeyRound,
  Lock,
  LogOut,
  ShieldCheck,
  Smartphone,
} from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Select,
  type SelectOption,
} from '@/components/ui'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

const TWO_FACTOR_OPTIONS: SelectOption[] = [
  { value: 'optional', label: 'Optional for all members', description: 'Members decide individually' },
  { value: 'admins', label: 'Required for Admins & Owners', description: 'Recommended default for security' },
  { value: 'all', label: 'Enforced for all members', description: 'Mandatory 6-digit OTP code on login' },
]

const SESSION_TIMEOUT_OPTIONS: SelectOption[] = [
  { value: '15m', label: '15 Minutes (Strict)' },
  { value: '1h', label: '1 Hour' },
  { value: '12h', label: '12 Hours (Standard workday)' },
  { value: '24h', label: '24 Hours' },
  { value: '7d', label: '7 Days' },
]

export default function SecuritySettingsPage() {
  useDocumentTitle('Authentication & Security')

  const [requireEmailVerification, setRequireEmailVerification] = useState(true)
  const [twoFactorPolicy, setTwoFactorPolicy] = useState('admins')
  const [sessionTimeout, setSessionTimeout] = useState('12h')
  const [minPasswordLength, setMinPasswordLength] = useState('8')
  const [requireSymbols, setRequireSymbols] = useState(true)
  const [isSaved, setIsSaved] = useState(false)
  const [revoking, setRevoking] = useState(false)
  const [revokedMsg, setRevokedMsg] = useState(false)

  const handleSave = () => {
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2500)
  }

  const handleRevokeSessions = () => {
    setRevoking(true)
    setTimeout(() => {
      setRevoking(false)
      setRevokedMsg(true)
      setTimeout(() => setRevokedMsg(false), 3000)
    }, 600)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Authentication & Security"
        description="Configure workspace-wide user authentication policies, 6-digit OTP verification, and session security."
        actions={
          <Button variant="primary" onClick={handleSave}>
            {isSaved ? 'Saved successfully' : 'Save Changes'}
          </Button>
        }
      />

      <div className="grid gap-6">
        {/* Email Verification Policy */}
        <Card className="bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-md bg-brand-50 text-brand-600 border border-brand-200">
                  <KeyRound className="size-4" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold">Email Verification & 6-Digit OTP</CardTitle>
                  <CardDescription className="text-xs">
                    Prevent unverified accounts from creating or accessing workspace data.
                  </CardDescription>
                </div>
              </div>
              <Badge variant="success" size="sm">Active Guard</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={requireEmailVerification}
                onChange={(e) => setRequireEmailVerification(e.target.checked)}
                className="mt-1 size-4 rounded-md border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
              />
              <div>
                <p className="text-sm font-medium text-slate-800">
                  Enforce email verification before workspace access
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Users must verify their email with a 6-digit OTP code before accessing organizations, accepting invites, or viewing dashboards.
                </p>
              </div>
            </label>
          </CardContent>
        </Card>

        {/* 2FA / OTP Enforcement */}
        <Card className="bg-white">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-md bg-blue-50 text-blue-600 border border-blue-200">
                <Smartphone className="size-4" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">Two-Factor Authentication (2FA)</CardTitle>
                <CardDescription className="text-xs">
                  Require members to enter a one-time security code on login.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            <Select
              label="2FA Policy Requirement"
              value={twoFactorPolicy}
              options={TWO_FACTOR_OPTIONS}
              onChange={(val) => setTwoFactorPolicy(val)}
            />
          </CardContent>
        </Card>

        {/* Session Management */}
        <Card className="bg-white">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-md bg-amber-50 text-amber-600 border border-amber-200">
                <ShieldCheck className="size-4" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">Session Management & Inactivity</CardTitle>
                <CardDescription className="text-xs">
                  Manage active device sessions and idle expiration rules.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            <Select
              label="Idle Session Timeout"
              value={sessionTimeout}
              options={SESSION_TIMEOUT_OPTIONS}
              onChange={(val) => setSessionTimeout(val)}
            />

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div>
                <p className="text-sm font-medium text-slate-800">Revoke active sessions</p>
                <p className="text-xs text-slate-500">Sign out of all other browsers and devices except this current session.</p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleRevokeSessions}
                loading={revoking}
              >
                <LogOut className="size-3.5 mr-1.5" />
                Revoke Others
              </Button>
            </div>
            {revokedMsg && (
              <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 p-2.5 rounded-md">
                <CheckCircle2 className="size-4" />
                All other active sessions were revoked successfully.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Password Policy */}
        <Card className="bg-white">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                <Lock className="size-4" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">Password Requirements</CardTitle>
                <CardDescription className="text-xs">
                  Complexity standards enforced during member registration and password resets.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Minimum Password Length"
                value={minPasswordLength}
                options={[
                  { value: '8', label: '8 Characters (Standard)' },
                  { value: '10', label: '10 Characters' },
                  { value: '12', label: '12 Characters (Strong)' },
                  { value: '16', label: '16 Characters (Enterprise)' },
                ]}
                onChange={(val) => setMinPasswordLength(val)}
              />
              <div className="flex items-center pt-6">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={requireSymbols}
                    onChange={(e) => setRequireSymbols(e.target.checked)}
                    className="size-4 rounded-md border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
                  />
                  <span className="text-xs sm:text-sm text-slate-700 font-medium">
                    Require numbers & special characters
                  </span>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
