import { AppError } from './app-error'
import { getErrorDefinition, resolveError } from './errors'

describe('getErrorDefinition', () => {
  test.each([
    [400, 'BAD_REQUEST'],
    [401, 'UNAUTHORIZED'],
    [403, 'FORBIDDEN'],
    [404, 'NOT_FOUND'],
    [429, 'TOO_MANY_REQUESTS'],
    [500, 'SERVER_ERROR'],
    [503, 'SERVICE_UNAVAILABLE'],
  ])('%i → %s', (status, key) => {
    expect(getErrorDefinition(status).key).toBe(key)
  })

  test('unmapped statuses fall back by range', () => {
    expect(getErrorDefinition(418).key).toBe('BAD_REQUEST')
    expect(getErrorDefinition(599).key).toBe('SERVER_ERROR')
    expect(getErrorDefinition(undefined).key).toBe('UNKNOWN')
  })
})

describe('resolveError', () => {
  test('AppError keeps status and request ID', () => {
    const resolved = resolveError(new AppError(403, 'nope', 'req-1'))
    expect(resolved.definition.key).toBe('FORBIDDEN')
    expect(resolved.requestId).toBe('req-1')
  })

  test('backend error shape', () => {
    const resolved = resolveError({ statusCode: 409, code: 'CONFLICT', requestId: 'req-2' })
    expect(resolved.definition.key).toBe('CONFLICT')
    expect(resolved.requestId).toBe('req-2')
  })

  test('thrown Response', () => {
    expect(resolveError(new Response(null, { status: 410 })).definition.key).toBe('GONE')
  })

  test('stale chunk after deploy', () => {
    const error = new TypeError('Failed to fetch dynamically imported module: /assets/x.js')
    expect(resolveError(error).definition.key).toBe('CHUNK_LOAD_ERROR')
  })

  test('network failure', () => {
    expect(resolveError(new TypeError('Failed to fetch')).definition.key).toBe('NETWORK_ERROR')
  })

  test('anything else is UNKNOWN', () => {
    expect(resolveError(new Error('boom')).definition.key).toBe('UNKNOWN')
    expect(resolveError('weird').definition.key).toBe('UNKNOWN')
  })
})
