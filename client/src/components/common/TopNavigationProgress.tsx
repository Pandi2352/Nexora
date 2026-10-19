import { useNavigation } from 'react-router-dom'

/**
 * High-performance 2px top loading progress indicator that shows
 * instant feedback during route transitions without shifting layout.
 */
export function TopNavigationProgress() {
  const navigation = useNavigation()
  const isNavigating = navigation.state === 'loading'

  if (!isNavigating) return null

  return (
    <div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-50 h-0.5 w-full bg-brand-500 animate-pulse pointer-events-none"
    />
  )
}
