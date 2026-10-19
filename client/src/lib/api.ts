import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'

let inMemoryToken: string | null = null
let activeTenantId: string | null = null
let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (err: unknown) => void
}> = []

export function setAccessToken(token: string | null): void {
  inMemoryToken = token
}

export function getAccessToken(): string | null {
  return inMemoryToken
}

export function setActiveTenant(tenantId: string | null): void {
  activeTenantId = tenantId
}

export function getActiveTenant(): string | null {
  return activeTenantId
}

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) promise.reject(error)
    else if (token) promise.resolve(token)
  })
  failedQueue = []
}

export const api = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor: attach bearer token, tenant scoping, and client trace ID
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (inMemoryToken && config.headers) {
    config.headers.Authorization = `Bearer ${inMemoryToken}`
  }
  if (activeTenantId && config.headers) {
    config.headers['x-organization-id'] = activeTenantId
  }
  if (!config.headers['x-client-request-id'] && typeof crypto !== 'undefined' && crypto.randomUUID) {
    config.headers['x-client-request-id'] = crypto.randomUUID()
  }
  return config
})

// Response interceptor: silent token refresh and idempotent retry
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
      _retryCount?: number
    }

    if (!originalRequest) return Promise.reject(error)

    // Idempotent retry on network failures or 503/504 gateway issues
    const method = (originalRequest.method || 'get').toLowerCase()
    const isIdempotent = ['get', 'head', 'options'].includes(method)
    const isTransient = !error.response || error.response.status === 503 || error.response.status === 504
    const retryCount = originalRequest._retryCount || 0

    if (isIdempotent && isTransient && retryCount < 2) {
      originalRequest._retryCount = retryCount + 1
      await new Promise((r) => setTimeout(r, 300 * Math.pow(2, retryCount)))
      return api(originalRequest)
    }

    // Skip refreshing if request is already to auth endpoints
    const isAuthEndpoint =
      originalRequest.url?.includes('/auth/login') ||
      originalRequest.url?.includes('/auth/register') ||
      originalRequest.url?.includes('/auth/refresh') ||
      originalRequest.url?.includes('/auth/logout')

    if (error.response?.status !== 401 || isAuthEndpoint || originalRequest._retry) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)
        })
        .catch((err) => Promise.reject(err))
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      const response = await axios.post<{ data: { accessToken: string } }>(
        '/api/v1/auth/refresh',
        {},
        { withCredentials: true },
      )
      const newToken = response.data.data.accessToken
      setAccessToken(newToken)
      processQueue(null, newToken)
      originalRequest.headers.Authorization = `Bearer ${newToken}`
      return api(originalRequest)
    } catch (refreshErr) {
      processQueue(refreshErr, null)
      setAccessToken(null)
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('nexora:session-expired'))
      }
      return Promise.reject(refreshErr)
    } finally {
      isRefreshing = false
    }
  },
)
