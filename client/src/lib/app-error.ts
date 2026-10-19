/**
 * Throw from a page or hook to show a specific error screen via the route errorElement.
 * Example: `throw new AppError(403)` when the user lacks permission.
 */
export class AppError extends Error {
  readonly status: number
  readonly requestId?: string

  constructor(status: number, message?: string, requestId?: string) {
    super(message ?? `HTTP ${status}`)
    this.name = 'AppError'
    this.status = status
    this.requestId = requestId
  }
}
