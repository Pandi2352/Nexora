import type { User } from '@/types/user'

// Development mock data. Replaced by the auth session in MVP 1.
export const mockUser: User = {
  id: '9b2d7a3e-5c1f-4e8a-b6d0-2f4c8e1a7b93',
  name: 'Pandi Selvam',
  email: 'pandi@example.com',
}

/** Role in the active workspace (comes from the membership once the API exists). */
export const mockMembershipRole = 'Owner'
