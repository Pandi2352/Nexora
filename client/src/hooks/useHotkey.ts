import { useEffect, useRef } from 'react'

/** Calls `handler` on Ctrl/⌘ + `key`. */
export function useHotkey(key: string, handler: () => void) {
  const handlerRef = useRef(handler)

  useEffect(() => {
    handlerRef.current = handler
  })

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === key.toLowerCase()) {
        event.preventDefault()
        handlerRef.current()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [key])
}
