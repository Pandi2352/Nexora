import type {
  InvitationEmailProps,
  PasswordResetEmailProps,
  VerificationEmailProps,
} from './email.interface';

interface BaseTemplateOptions {
  title: string;
  preheader: string;
  bodyHtml: string;
  actionText?: string;
  actionUrl?: string;
}

/** Wraps content in a responsive, styled Nexora OS email container. */
export function renderBaseTemplate(options: BaseTemplateOptions): string {
  const { title, preheader, bodyHtml, actionText, actionUrl } = options;

  const actionButton =
    actionText && actionUrl
      ? `
      <div style="margin: 28px 0; text-align: center;">
        <a href="${actionUrl}" target="_blank" style="display: inline-block; background-color: #4f46e5; color: #ffffff; font-weight: 600; font-size: 14px; text-decoration: none; padding: 12px 24px; border-radius: 6px; letter-spacing: 0.02em;">
          ${actionText}
        </a>
      </div>
      <p style="margin: 16px 0 0; font-size: 12px; color: #64748b; word-break: break-all; text-align: center;">
        Or copy and paste this link into your browser:<br/>
        <a href="${actionUrl}" style="color: #4f46e5;">${actionUrl}</a>
      </p>
    `
      : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.6; }
    .wrapper { width: 100%; max-width: 580px; margin: 32px auto; padding: 0 16px; box-sizing: border-box; }
    .card { background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 36px 32px; }
    .brand { font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 24px; letter-spacing: -0.01em; }
    .brand span { color: #4f46e5; }
    .footer { text-align: center; margin-top: 24px; font-size: 12px; color: #94a3b8; }
  </style>
</head>
<body>
  <div style="display: none; max-height: 0; overflow: hidden; opacity: 0;">${preheader}</div>
  <div class="wrapper">
    <div class="card">
      <div class="brand">Nexora <span>OS</span></div>
      <h1 style="font-size: 20px; font-weight: 600; color: #0f172a; margin: 0 0 16px;">${title}</h1>
      <div style="font-size: 15px; color: #334155;">
        ${bodyHtml}
      </div>
      ${actionButton}
    </div>
    <div class="footer">
      <p style="margin: 0;">&copy; ${new Date().getFullYear()} Nexora OS. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
}

/** Verification email template. */
export function renderVerificationEmail(props: VerificationEmailProps): {
  html: string;
  text: string;
} {
  const bodyHtml = `
    <p>Hi ${props.name},</p>
    <p>Welcome to <strong>Nexora OS</strong>. Please verify your email address to activate your account and start setting up your workspace.</p>
    <p>This verification link will expire in 24 hours.</p>
  `;
  const text = `Hi ${props.name},\n\nPlease verify your email address for Nexora OS by visiting:\n${props.verifyUrl}\n\nThis link will expire in 24 hours.`;

  return {
    html: renderBaseTemplate({
      title: 'Verify your email address',
      preheader: 'Complete your registration on Nexora OS',
      bodyHtml,
      actionText: 'Verify Email Address',
      actionUrl: props.verifyUrl,
    }),
    text,
  };
}

/** Password reset email template. */
export function renderPasswordResetEmail(props: PasswordResetEmailProps): {
  html: string;
  text: string;
} {
  const bodyHtml = `
    <p>Hi ${props.name},</p>
    <p>We received a request to reset the password for your Nexora OS account.</p>
    <p>Click the button below to set a new password. This link is valid for 1 hour and can only be used once.</p>
    <p style="font-size: 13px; color: #64748b; margin-top: 20px;">If you did not request a password reset, you can safely ignore this email.</p>
  `;
  const text = `Hi ${props.name},\n\nReset your password for Nexora OS by visiting:\n${props.resetUrl}\n\nThis link expires in 1 hour. If you did not make this request, please ignore this email.`;

  return {
    html: renderBaseTemplate({
      title: 'Reset your password',
      preheader: 'Instructions to reset your Nexora OS password',
      bodyHtml,
      actionText: 'Reset Password',
      actionUrl: props.resetUrl,
    }),
    text,
  };
}

/** Workspace member invitation email template. */
export function renderInvitationEmail(props: InvitationEmailProps): {
  html: string;
  text: string;
} {
  const bodyHtml = `
    <p>Hello,</p>
    <p><strong>${props.inviterName}</strong> has invited you to join the <strong>${props.orgName}</strong> workspace on Nexora OS as a <strong>${props.roleName}</strong>.</p>
    <p>Click below to accept your invitation and access your team's workspace.</p>
    <p>This invitation link will expire in 7 days.</p>
  `;
  const text = `Hello,\n\n${props.inviterName} has invited you to join ${props.orgName} on Nexora OS as a ${props.roleName}.\n\nAccept your invitation here:\n${props.inviteUrl}\n\nThis invitation expires in 7 days.`;

  return {
    html: renderBaseTemplate({
      title: `You're invited to join ${props.orgName}`,
      preheader: `${props.inviterName} invited you to join ${props.orgName} on Nexora OS`,
      bodyHtml,
      actionText: 'Accept Invitation',
      actionUrl: props.inviteUrl,
    }),
    text,
  };
}
