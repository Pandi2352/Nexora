import { Crown, Shield, ShieldAlert, User, Headphones } from 'lucide-react'
import { Badge, type BadgeVariant } from '@/components/ui'

interface RoleBadgeProps {
  role: string
  size?: 'sm' | 'md'
  showIcon?: boolean
}

export function RoleBadge({ role, size = 'sm', showIcon = true }: RoleBadgeProps) {
  const norm = role.toLowerCase()

  let variant: BadgeVariant = 'neutral'
  let Icon = User
  let label = role

  switch (norm) {
    case 'owner':
      variant = 'brand'
      Icon = Crown
      label = 'Owner'
      break
    case 'admin':
      variant = 'neutral'
      Icon = Shield
      label = 'Admin'
      break
    case 'manager':
      variant = 'warning'
      Icon = ShieldAlert
      label = 'Manager'
      break
    case 'member':
      variant = 'neutral'
      Icon = User
      label = 'Member'
      break
    case 'support_agent':
      variant = 'neutral'
      Icon = Headphones
      label = 'Support Agent'
      break
  }

  return (
    <Badge variant={variant} size={size} className="gap-1 font-medium">
      {showIcon && <Icon className="size-3 inline" />}
      {label}
    </Badge>
  )
}
