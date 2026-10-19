import { api, setAccessToken } from '@/lib/api'
import type { User } from '@/types/user'

export interface LoginResponse {
  user: User
  accessToken: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface ResetPasswordPayload {
  token: string
  newPassword: string
}

export const authService = {
  async register(payload: RegisterPayload): Promise<User> {
    const res = await api.post<{ data: User }>('/auth/register', payload)
    return res.data.data
  },

  async login(payload: LoginPayload): Promise<LoginResponse> {
    const res = await api.post<{ data: LoginResponse }>('/auth/login', payload)
    setAccessToken(res.data.data.accessToken)
    return res.data.data
  },

  async refresh(): Promise<string> {
    const res = await api.post<{ data: { accessToken: string } }>('/auth/refresh')
    const token = res.data.data.accessToken
    setAccessToken(token)
    return token
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout')
    } finally {
      setAccessToken(null)
    }
  },

  async logoutAll(): Promise<void> {
    try {
      await api.post('/auth/logout-all')
    } finally {
      setAccessToken(null)
    }
  },

  async verifyEmail(token: string): Promise<string> {
    const res = await api.post<{ message: string }>('/auth/verify-email', { token })
    return res.data.message
  },

  async resendVerification(email: string): Promise<string> {
    const res = await api.post<{ message: string }>('/auth/resend-verification', { email })
    return res.data.message
  },

  async forgotPassword(email: string): Promise<string> {
    const res = await api.post<{ message: string }>('/auth/forgot-password', { email })
    return res.data.message
  },

  async resetPassword(payload: ResetPasswordPayload): Promise<string> {
    const res = await api.post<{ message: string }>('/auth/reset-password', payload)
    return res.data.message
  },

  async getMe(): Promise<User> {
    const res = await api.get<{ data: User }>('/auth/me')
    return res.data.data
  },
}
