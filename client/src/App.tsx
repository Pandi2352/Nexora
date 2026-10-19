import { AuthProvider } from '@/context/auth/AuthProvider'
import { AppRouter } from '@/routes/router'

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  )
}
