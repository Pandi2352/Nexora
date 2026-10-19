import { NotificationsMenu } from './NotificationsMenu'
import { QuickCreateMenu } from './QuickCreateMenu'
import { SearchTrigger } from './SearchTrigger'
import { SidebarToggle } from './SidebarToggle'
import { UserMenu } from './UserMenu'

export function Navbar() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-3.5 sm:px-5">
      <SidebarToggle />

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        <SearchTrigger />
        <QuickCreateMenu />
        <NotificationsMenu />
        <div aria-hidden className="mx-1 hidden h-6 w-px bg-slate-200 sm:block" />
        <UserMenu />
      </div>
    </header>
  )
}
