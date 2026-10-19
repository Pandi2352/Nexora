import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'

let inMemoryToken: string | null = null
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

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error)
    } else if (token) {
      promise.resolve(token)
    }
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

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (inMemoryToken && config.headers) {
    config.headers.Authorization = `Bearer ${inMemoryToken}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    // Skip refreshing if request is already to auth endpoints or missing config
    const isAuthEndpoint =
      originalRequest?.url?.includes('/auth/login') ||
      originalRequest?.url?.includes('/auth/register') ||
      originalRequest?.url?.includes('/auth/refresh') ||
      originalRequest?.url?.includes('/auth/logout')

    if (error.response?.status !== 401 || !originalRequest || isAuthEndpoint) {
      return Promise.reject(error)
    }

    if (originalRequest._retry) {
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
      return Promise.reject(refreshErr)
    } finally {
      isRefreshing = false
    }
  },
)
