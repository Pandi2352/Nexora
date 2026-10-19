import { useEffect, useState, type ReactNode } from 'react'
import type { User } from '@/types/user'
import { authService, type LoginPayload, type RegisterPayload } from '@/services/auth.service'
import { AuthContext } from './auth-context'

export interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    let isMounted = true

    async function initAuth() {
      try {
        await authService.refresh()
        const me = await authService.getMe()
        if (isMounted) setUser(me)
      } catch {
        if (isMounted) setUser(null)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    void initAuth()

    const onSessionExpired = () => {
      if (isMounted) setUser(null)
    }
    window.addEventListener('nexora:session-expired', onSessionExpired)

    return () => {
      isMounted = false
      window.removeEventListener('nexora:session-expired', onSessionExpired)
    }
  }, [])

  const login = async (payload: LoginPayload): Promise<void> => {
    const res = await authService.login(payload)
    setUser(res.user)
  }

  const register = async (payload: RegisterPayload): Promise<User> => {
    return authService.register(payload)
  }

  const logout = async (): Promise<void> => {
    await authService.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
