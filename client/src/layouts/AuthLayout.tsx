import { Outlet } from 'react-router-dom'

/** Minimal layout for public auth pages and workspace selection. */
export function AuthLayout() {
  return (
    <div className="flex min-h-dvh flex-col items-center px-4 py-12">
      <div className="mb-8 flex items-center gap-2.5">
        <span className="flex size-9 items-center justify-center rounded-md bg-brand-600 font-bold text-white">
          N
        </span>
        <span className="text-lg font-semibold">Nexora OS</span>
      </div>
      <main className="w-full max-w-md">
        <Outlet />
      </main>
    </div>
  )
}
