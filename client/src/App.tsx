import { AuthProvider } from '@/context/auth/AuthProvider'
import { WorkspaceProvider } from '@/context/workspace/WorkspaceProvider'
import { AppRouter } from '@/routes/router'

export default function App() {
  return (
    <AuthProvider>
      <WorkspaceProvider>
        <AppRouter />
      </WorkspaceProvider>
    </AuthProvider>
  )
}
