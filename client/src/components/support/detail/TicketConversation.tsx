import type { Ticket, TicketReply } from '@/types/support'
import { TicketMessage } from './TicketMessage'

interface TicketConversationProps {
  ticket: Ticket
  replies: TicketReply[]
}

/** The original request followed by replies and internal notes, oldest first. */
export function TicketConversation({ ticket, replies }: TicketConversationProps) {
  return (
    <div className="space-y-4">
      <TicketMessage
        author={ticket.requester.name}
        body={ticket.description}
        createdAt={ticket.createdAt}
        kind="requester"
      />
      {replies.map((reply) => (
        <TicketMessage
          key={reply.id}
          author={reply.authorName}
          body={reply.body}
          createdAt={reply.createdAt}
          kind={reply.type === 'internal_note' ? 'note' : 'reply'}
        />
      ))}
      {replies.length === 0 && (
        <p className="pl-10 text-xs text-slate-500">
          No replies yet. The first public reply stops the first-response SLA clock.
        </p>
      )}
    </div>
  )
}
