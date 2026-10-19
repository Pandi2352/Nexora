import { AuthProvider } from '@/context/auth/AuthProvider'
import { WorkspaceProvider } from '@/context/workspace/WorkspaceProvider'
import { AppRouter } from '@/routes/router'
import { Toaster } from '@/components/ui'

export default function App() {
  return (
    <AuthProvider>
      <WorkspaceProvider>
        <AppRouter />
        <Toaster />
      </WorkspaceProvider>
    </AuthProvider>
  )
}
