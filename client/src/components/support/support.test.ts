import type { TicketEvent } from '@/types/support'
import { describeTicketEvent } from './detail/ticket-event-text'
import { emptyTicketForm, toCreatePayload, validateTicketForm } from './form/ticket-form'
import { formatDuration, formatRelative } from './support-formatters'
import { STATUS_TRANSITIONS } from './support-options'

describe('formatDuration', () => {
  test.each([
    [null, '—'],
    [45, '45 min'],
    [60, '1 h'],
    [90, '1 h 30 min'],
    [24 * 60, '1 d'],
    [3 * 24 * 60 + 4 * 60, '3 d 4 h'],
  ])('%s → %s', (minutes, text) => {
    expect(formatDuration(minutes)).toBe(text)
  })
})

test('formatRelative past and future', () => {
  const now = new Date('2026-10-21T10:00:00Z')
  expect(formatRelative('2026-10-21T12:00:00Z', now)).toBe('in 2 h')
  expect(formatRelative('2026-10-21T09:30:00Z', now)).toBe('30 min ago')
})

describe('ticket form', () => {
  test('requires subject, description, requester name and a valid email', () => {
    const errors = validateTicketForm({ ...emptyTicketForm(), requesterEmail: 'nope' })
    expect(Object.keys(errors).sort()).toEqual([
      'description',
      'requesterEmail',
      'requesterName',
      'subject',
    ])
  })

  test('builds a trimmed create payload and drops empty optional fields', () => {
    const payload = toCreatePayload({
      ...emptyTicketForm(),
      subject: '  Export broken ',
      description: 'Blank screen',
      requesterName: ' Arun ',
      requesterEmail: 'arun@acme.in',
      requesterPhone: '   ',
      tags: ['invoices'],
    })
    expect(payload.subject).toBe('Export broken')
    expect(payload.requester).toEqual({
      name: 'Arun',
      email: 'arun@acme.in',
      phone: undefined,
      companyName: undefined,
    })
    expect(payload.tags).toEqual(['invoices'])
  })
})

test('closed tickets allow no manual transitions; resolved only to closed', () => {
  expect(STATUS_TRANSITIONS.closed).toEqual([])
  expect(STATUS_TRANSITIONS.resolved).toEqual(['closed'])
})

describe('describeTicketEvent', () => {
  const base: TicketEvent = {
    id: 'e',
    ticketId: 't',
    type: 'created',
    actorId: 'u',
    actorName: 'Pandi',
    createdAt: '',
  }
  const names = new Map([['u2', 'Meena']])

  test.each<[Partial<TicketEvent>, string]>([
    [
      { type: 'status_changed', from: 'open', to: 'in_progress' },
      'changed status from Open to In progress',
    ],
    [
      { type: 'priority_changed', from: 'low', to: 'urgent' },
      'changed priority from Low to Urgent',
    ],
    [{ type: 'assigned', to: 'u2' }, 'assigned the ticket to Meena'],
    [{ type: 'assigned', to: 'gone' }, 'assigned the ticket to a former member'],
    [{ type: 'resolved', to: 'workaround' }, 'resolved the ticket (Workaround provided)'],
  ])('%o', (patch, text) => {
    expect(describeTicketEvent({ ...base, ...patch }, names)).toBe(text)
  })
})
