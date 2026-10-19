/** Options for dispatching an email. */
export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
}

/** Payload for verification email template. */
export interface VerificationEmailProps {
  name: string;
  code: string;
  verifyUrl: string;
}

/** Payload for password reset email template. */
export interface PasswordResetEmailProps {
  name: string;
  resetUrl: string;
}

/** Payload for member invitation email template. */
export interface InvitationEmailProps {
  inviterName: string;
  orgName: string;
  roleName: string;
  inviteUrl: string;
}
