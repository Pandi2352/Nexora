import { Contact, FolderKanban, LifeBuoy, SquareCheckBig, UserPlus } from 'lucide-react'
import { workspaceSegments as s } from '@/config/paths'
import type { QuickAction } from '@/types/navigation'

// Navbar "New" menu.
export const quickActions: QuickAction[] = [
  {
    id: 'new-task',
    label: 'New task',
    description: 'Assign work with a due date',
    icon: SquareCheckBig,
    segment: s.tasks,
  },
  {
    id: 'new-project',
    label: 'New project',
    description: 'Group tasks, members and files',
    icon: FolderKanban,
    segment: s.projects,
  },
  {
    id: 'new-contact',
    label: 'Add contact',
    description: 'A person at a customer company',
    icon: Contact,
    segment: s.crmContacts,
  },
  {
    id: 'new-lead',
    label: 'New lead',
    description: 'Track a potential customer',
    icon: UserPlus,
    segment: s.crmLeads,
  },
  {
    id: 'new-ticket',
    label: 'New ticket',
    description: 'Log a support request',
    icon: LifeBuoy,
    segment: s.supportTickets,
  },
]
