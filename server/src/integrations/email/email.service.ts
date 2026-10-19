import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { type Transporter } from 'nodemailer';
import type { EnvironmentVariables } from '@/config/env.validation';
import type { SendEmailOptions } from './email.interface';
import {
  renderInvitationEmail,
  renderPasswordResetEmail,
  renderVerificationEmail,
} from './email.templates';

@Injectable()
export class EmailService implements OnModuleInit {
  private readonly logger = new Logger(EmailService.name);
  private transporter: Transporter | null = null;
  private fromAddress: string = 'Nexora OS <notifications@nexora.local>';
  private appOrigin: string = 'http://localhost:5173';

  constructor(private readonly config: ConfigService<EnvironmentVariables, true>) {}

  onModuleInit(): void {
    const host = this.config.get('SMTP_HOST', { infer: true });
    const port = this.config.get('SMTP_PORT', { infer: true }) ?? 587;
    const user = this.config.get('SMTP_USER', { infer: true });
    const pass = this.config.get('SMTP_PASS', { infer: true });
    const from = this.config.get('MAIL_FROM', { infer: true });
    const origin = this.config.get('APP_ORIGIN', { infer: true });

    if (from) this.fromAddress = from;
    if (origin) this.appOrigin = origin;

    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });
      this.logger.log(`SMTP Transporter configured (${host}:${port}) from ${this.fromAddress}`);
    } else {
      this.logger.warn('SMTP credentials not configured. Emails will be logged to the console.');
    }
  }

  /**
   * Dispatches an email using SMTP if configured, or logs to console as fallback.
   * Never throws exceptions so that email network failures don't disrupt the user request.
   */
  async sendMail(options: SendEmailOptions): Promise<boolean> {
    const mailOptions = {
      from: options.from || this.fromAddress,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      replyTo: options.replyTo,
    };

    if (this.transporter) {
      try {
        const info = await this.transporter.sendMail(mailOptions);
        this.logger.log(`Email dispatched to ${options.to} (Message ID: ${info.messageId})`);
        return true;
      } catch (err) {
        this.logger.error(`Failed to send email to ${options.to}: ${(err as Error).message}`);
        return false;
      }
    }

    // Console fallback when SMTP is not configured
    this.logger.log(
      `\n--- [LOCAL EMAIL LOG] ---\nTo: ${Array.isArray(options.to) ? options.to.join(', ') : options.to}\nSubject: ${options.subject}\nText: ${options.text ?? '(HTML only)'}\n-------------------------`,
    );
    return true;
  }

  /** Sends an account email verification code and link. */
  async sendVerificationEmail(to: string, name: string, code: string): Promise<boolean> {
    const verifyUrl = `${this.appOrigin}/verify-email?email=${encodeURIComponent(to)}&code=${code}`;
    const { html, text } = renderVerificationEmail({ name, code, verifyUrl });

    return this.sendMail({
      to,
      subject: `Your Nexora OS verification code: ${code}`,
      html,
      text,
    });
  }

  /** Sends a password reset request link. */
  async sendPasswordResetEmail(to: string, name: string, token: string): Promise<boolean> {
    const resetUrl = `${this.appOrigin}/reset-password?token=${token}`;
    const { html, text } = renderPasswordResetEmail({ name, resetUrl });

    return this.sendMail({
      to,
      subject: 'Reset your password — Nexora OS',
      html,
      text,
    });
  }

  /** Sends a workspace membership invitation link. */
  async sendInvitationEmail(
    to: string,
    inviterName: string,
    orgName: string,
    roleName: string,
    token: string,
  ): Promise<boolean> {
    const inviteUrl = `${this.appOrigin}/accept-invitation?token=${token}`;
    const { html, text } = renderInvitationEmail({
      inviterName,
      orgName,
      roleName,
      inviteUrl,
    });

    return this.sendMail({
      to,
      subject: `Invitation to join ${orgName} on Nexora OS`,
      html,
      text,
    });
  }
}
