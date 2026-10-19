export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface ToastItem {
  id: string
  type: ToastType
  message: string
  duration?: number
}

type Listener = (toasts: ToastItem[]) => void

let toasts: ToastItem[] = []
let listeners: Listener[] = []

function notify() {
  listeners.forEach((listener) => listener([...toasts]))
}

export function subscribeToasts(listener: Listener) {
  listeners.push(listener)
  listener([...toasts])
  return () => {
    listeners = listeners.filter((l) => l !== listener)
  }
}

export function dismissToast(id: string) {
  toasts = toasts.filter((t) => t.id !== id)
  notify()
}

export function showToast(message: string, type: ToastType = 'info', duration = 3500) {
  const id = Math.random().toString(36).substring(2, 9)
  const item: ToastItem = { id, type, message, duration }
  toasts = [...toasts, item]
  notify()

  if (duration > 0) {
    setTimeout(() => {
      dismissToast(id)
    }, duration)
  }
  return id
}

export const toast = {
  success: (message: string, duration?: number) => showToast(message, 'success', duration),
  error: (message: string, duration?: number) => showToast(message, 'error', duration),
  info: (message: string, duration?: number) => showToast(message, 'info', duration),
  warning: (message: string, duration?: number) => showToast(message, 'warning', duration),
  dismiss: dismissToast,
}
