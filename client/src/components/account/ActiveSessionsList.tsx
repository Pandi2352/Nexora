import { useState } from 'react'
import { Laptop, ShieldAlert, Smartphone, Trash2 } from 'lucide-react'
import { Badge, Button, IconButton } from '@/components/ui'
import { userService } from '@/services/user.service'
import type { UserSession } from '@/types/session'

interface ActiveSessionsListProps {
  sessions: UserSession[]
  onUpdated: () => void
}

function getDeviceIcon(ua: string) {
  const lower = ua.toLowerCase()
  if (lower.includes('mobile') || lower.includes('android') || lower.includes('iphone')) {
    return Smartphone
  }
  return Laptop
}

export function ActiveSessionsList({ sessions, onUpdated }: ActiveSessionsListProps) {
  const [isRevoking, setIsRevoking] = useState(false)

  const handleRevokeSingle = async (sessionId: string) => {
    if (!window.confirm('Are you sure you want to sign out of this device?')) return
    setIsRevoking(true)
    try {
      await userService.revokeSession(sessionId)
      onUpdated()
    } finally {
      setIsRevoking(false)
    }
  }

  const handleRevokeOthers = async () => {
    if (!window.confirm('Sign out of all other devices except this one?')) return
    setIsRevoking(true)
    try {
      await userService.revokeOtherSessions()
      onUpdated()
    } finally {
      setIsRevoking(false)
    }
  }

  const otherCount = sessions.filter((s) => !s.isCurrent).length

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Active Device Sessions</h3>
          <p className="text-xs text-slate-500">
            Devices that currently have access to your Nexora OS account.
          </p>
        </div>
        {otherCount > 0 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRevokeOthers}
            disabled={isRevoking}
          >
            <ShieldAlert className="size-3.5 text-rose-600 mr-1.5" />
            Sign Out All Other Devices
          </Button>
        )}
      </div>

      <div className="divide-y divide-slate-100 rounded-md border border-slate-200 bg-white">
        {sessions.map((session) => {
          const Icon = getDeviceIcon(session.userAgent)
          return (
            <div key={session.id} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="flex size-9 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-slate-600 shrink-0">
                  <Icon className="size-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {session.userAgent}
                    </p>
                    {session.isCurrent && (
                      <Badge variant="brand" size="sm">
                        This Device
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    IP: <span className="font-mono text-[11px]">{session.ipAddress}</span> · Signed in{' '}
                    {new Date(session.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {!session.isCurrent && (
                <IconButton
                  aria-label="Revoke session"
                  onClick={() => handleRevokeSingle(session.id)}
                  disabled={isRevoking}
                  className="text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                >
                  <Trash2 className="size-4" />
                </IconButton>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
