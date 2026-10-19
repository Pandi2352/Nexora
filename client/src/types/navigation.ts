import type { LucideIcon } from 'lucide-react'
import type { WorkspaceSegment } from '@/config/paths'

export interface NavLinkItem {
  id: string
  label: string
  segment: WorkspaceSegment
}

export interface NavItem {
  id: string
  label: string
  icon: LucideIcon
  /** Set for direct links. Items with children open a submenu instead. */
  segment?: WorkspaceSegment
  children?: NavLinkItem[]
  /** Required permission (e.g. `crm.companies.read`). Used for filtering once auth exists. */
  permission?: string
}

export interface NavSection {
  id: string
  label: string
  items: NavItem[]
}

export interface NavTrailItem {
  label: string
  to?: string
}

export interface QuickAction {
  id: string
  label: string
  description: string
  icon: LucideIcon
  segment: WorkspaceSegment
}
