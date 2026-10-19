import { createContext, useContext } from 'react'

export const DropdownContext = createContext<{ close: () => void } | null>(null)

export function useDropdown() {
  const context = useContext(DropdownContext)
  if (!context) throw new Error('Dropdown items must be used within Dropdown')
  return context
}
