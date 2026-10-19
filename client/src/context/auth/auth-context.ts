import { createContext, useContext } from 'react'
import type { User } from '@/types/user'
import type { LoginPayload, RegisterPayload } from '@/services/auth.service'

export interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (payload: LoginPayload) => Promise<void>
  register: (payload: RegisterPayload) => Promise<User>
  logout: () => Promise<void>
  setUser: (user: User | null) => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an <AuthProvider>')
  }
  return context
}
