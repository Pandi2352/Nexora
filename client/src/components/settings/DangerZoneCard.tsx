import { AlertOctagon, Crown, LogOut, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui'

interface DangerZoneCardProps {
  isOwner: boolean
  onTransferOwnership: () => void
  onDeleteWorkspace: () => void
  onLeaveWorkspace: () => void
  isLeaving: boolean
}

export function DangerZoneCard({
  isOwner,
  onTransferOwnership,
  onDeleteWorkspace,
  onLeaveWorkspace,
  isLeaving,
}: DangerZoneCardProps) {
  return (
    <div className="rounded-md border border-rose-200 bg-white p-6">
      <div className="flex items-center gap-2 border-b border-rose-100 pb-4">
        <AlertOctagon className="size-5 text-rose-600" />
        <h3 className="text-base font-semibold text-rose-950">Danger Zone</h3>
      </div>

      <div className="divide-y divide-rose-100 text-xs">
        {isOwner ? (
          <>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 py-4">
              <div>
                <h4 className="font-semibold text-slate-900">Transfer Workspace Ownership</h4>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Transfer the primary Owner role to another active workspace member.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onTransferOwnership}
                className="cursor-pointer border-slate-300 hover:border-slate-400 shrink-0"
              >
                <Crown className="mr-1.5 size-3.5 text-amber-500" />
                Transfer Ownership
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4">
              <div>
                <h4 className="font-semibold text-rose-900">Delete Workspace</h4>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Permanently remove this workspace, membership links, teams, and data.
                </p>
              </div>
              <Button
                variant="danger"
                size="sm"
                onClick={onDeleteWorkspace}
                className="cursor-pointer shrink-0"
              >
                <Trash2 className="mr-1.5 size-3.5" />
                Delete Workspace
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4">
            <div>
              <h4 className="font-semibold text-slate-900">Leave Workspace</h4>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Revoke your access and remove your account from this organization.
              </p>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={onLeaveWorkspace}
              loading={isLeaving}
              className="cursor-pointer shrink-0"
            >
              <LogOut className="mr-1.5 size-3.5" />
              Leave Workspace
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
