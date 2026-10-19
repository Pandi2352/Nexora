import { Badge, type BadgeVariant } from '@/components/ui'

interface ActivityActionBadgeProps {
  action: string
}

export function ActivityActionBadge({ action }: ActivityActionBadgeProps) {
  let variant: BadgeVariant = 'neutral'

  if (action.startsWith('auth.')) {
    variant = 'brand'
  } else if (action.startsWith('member.')) {
    variant = 'neutral'
  } else if (action.startsWith('team.')) {
    variant = 'warning'
  } else if (action.startsWith('org.')) {
    variant = 'success'
  }

  return (
    <Badge variant={variant} size="sm" className="font-mono text-[10px] tracking-tight">
      {action}
    </Badge>
  )
}
