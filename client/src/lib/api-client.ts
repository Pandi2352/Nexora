import type { AxiosProgressEvent, AxiosRequestConfig } from 'axios'
import axios from 'axios'
import { api, getAccessToken, getActiveTenant, setActiveTenant, setAccessToken } from './api'

export { api, getAccessToken, getActiveTenant, setActiveTenant, setAccessToken }

export interface ApiErrorPayload {
  message: string
  statusCode?: number
  errorCode?: string
  validationErrors?: Record<string, string[]>
  isNetworkError: boolean
}

/** Extracts clean, user-friendly error details from any caught error. */
export function extractApiError(error: unknown): ApiErrorPayload {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as {
      message?: string | string[]
      error?: string
      statusCode?: number
      errors?: Record<string, string[]>
    } | undefined

    const rawMessage = data?.message || error.message || 'An unexpected error occurred'
    const message = (Array.isArray(rawMessage) ? rawMessage[0] : rawMessage) ?? 'An unexpected error occurred'

    return {
      message,
      statusCode: error.response?.status,
      errorCode: data?.error,
      validationErrors: data?.errors,
      isNetworkError: !error.response,
    }
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      isNetworkError: false,
    }
  }

  return {
    message: 'An unknown error occurred',
    isNetworkError: false,
  }
}

/** Generates a cancellable abort controller with signal and cleanup. */
export function createAbortController() {
  const controller = new AbortController()
  return {
    signal: controller.signal,
    abort: () => controller.abort(),
  }
}

/** Advanced developer-friendly typed API client wrapping axios. */
export const apiClient = {
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const res = await api.get<T>(url, config)
    return res.data
  },

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const res = await api.post<T>(url, data, config)
    return res.data
  },

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const res = await api.put<T>(url, data, config)
    return res.data
  },

  async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const res = await api.patch<T>(url, data, config)
    return res.data
  },

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const res = await api.delete<T>(url, config)
    return res.data
  },

  async upload<T>(
    url: string,
    formData: FormData,
    onProgress?: (percent: number) => void,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const res = await api.post<T>(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
      onUploadProgress: (e: AxiosProgressEvent) => {
        if (onProgress && e.total) {
          onProgress(Math.round((e.loaded * 100) / e.total))
        }
      },
    })
    return res.data
  },
}
