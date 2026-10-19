import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button, buttonVariants } from '@/components/ui'
import { paths } from '@/config/paths'
import type { ErrorAction } from '@/types/error'

interface ErrorActionsProps {
  actions: ErrorAction[]
  /** Custom retry (e.g. refetch). Defaults to a page reload. */
  onRetry?: () => void
}

export function ErrorActions({ actions, onRetry }: ErrorActionsProps) {
  const navigate = useNavigate()
  const { pathname, search } = useLocation()

  const reload = () => window.location.reload()
  const goBack = () => (window.history.length > 1 ? navigate(-1) : navigate(paths.home))
  const loginHref = `${paths.login}?redirect=${encodeURIComponent(pathname + search)}`

  // First action is the primary button.
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {actions.map((action, index) => {
        const variant = index === 0 ? 'primary' : 'outline'
        switch (action) {
          case 'retry':
            return (
              <Button key={action} variant={variant} onClick={onRetry ?? reload}>
                Try again
              </Button>
            )
          case 'reload':
            return (
              <Button key={action} variant={variant} onClick={reload}>
                Reload page
              </Button>
            )
          case 'back':
            return (
              <Button key={action} variant={variant} onClick={goBack}>
                Go back
              </Button>
            )
          case 'home':
            return (
              <Link key={action} to={paths.home} className={buttonVariants({ variant })}>
                Go home
              </Link>
            )
          case 'login':
            return (
              <Link key={action} to={loginHref} className={buttonVariants({ variant })}>
                Sign in
              </Link>
            )
        }
      })}
    </div>
  )
}
