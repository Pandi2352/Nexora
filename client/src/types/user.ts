export interface User {
  id: string
  name: string
  email: string
  avatarUrl?: string
  timezone?: string
  locale?: string
  isEmailVerified?: boolean
  isPlatformAdmin?: boolean
}
