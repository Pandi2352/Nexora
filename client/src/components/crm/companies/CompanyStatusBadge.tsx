import { Badge } from '@/components/ui'
import type { CompanyStatus } from '@/types/crm'

interface CompanyStatusBadgeProps {
  status: CompanyStatus
}

export function CompanyStatusBadge({ status }: CompanyStatusBadgeProps) {
  switch (status) {
    case 'customer':
      return <Badge variant="success" size="sm">Customer</Badge>
    case 'partner':
      return <Badge variant="brand" size="sm">Partner</Badge>
    case 'prospect':
      return <Badge variant="warning" size="sm">Prospect</Badge>
    case 'inactive':
    default:
      return <Badge variant="neutral" size="sm">Inactive</Badge>
  }
}
