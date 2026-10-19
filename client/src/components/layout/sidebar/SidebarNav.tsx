import { navigation } from '@/config/navigation'
import { SidebarSection } from './SidebarSection'

export function SidebarNav() {
  return (
    <nav aria-label="Primary" className="custom-scrollbar flex-1 overflow-y-auto px-3 py-4">
      {navigation.map((section, index) => (
        <SidebarSection key={section.id} section={section} isFirst={index === 0} />
      ))}
    </nav>
  )
}
