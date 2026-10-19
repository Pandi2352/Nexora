import { useEffect } from 'react'

export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} · Nexora OS` : 'Nexora OS'
  }, [title])
}
