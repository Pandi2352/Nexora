import { useEffect, type RefObject } from 'react'
import { useLocation } from 'react-router-dom'

/** Resets the scroll container to the top when the route changes. */
export function useScrollTopOnNavigate(ref: RefObject<HTMLElement | null>) {
  const { pathname } = useLocation()

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = 0
  }, [ref, pathname])
}
