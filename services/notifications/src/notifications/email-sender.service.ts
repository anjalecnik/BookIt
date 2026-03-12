import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { Transporter } from 'nodemailer';

export type EmailPayload = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

@Injectable()
export class EmailSenderService {
  private transporter: Transporter;
  private readonly logger = new Logger(EmailSenderService.name);

  constructor(private cfg: ConfigService) {
    const host = this.cfg.get<string>('SMTP_HOST');
    const port = Number(this.cfg.get<string>('SMTP_PORT') ?? '587');
    const user = this.cfg.get<string>('SMTP_USER');
    const pass = this.cfg.get<string>('SMTP_PASS');

    if (!host || !user || !pass) {
      this.logger.error(
        'Missing SMTP configuration (SMTP_HOST/SMTP_USER/SMTP_PASS)',
      );
      throw new Error(
        'Missing SMTP configuration (SMTP_HOST/SMTP_USER/SMTP_PASS)',
      );
    }

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }
  async sendEmail(payload: EmailPayload) {
    const from =
      this.cfg.get<string>('SMTP_FROM') ?? this.cfg.get<string>('SMTP_USER')!;
    await this.transporter.sendMail({
      from,
      to: payload.to,
      subject: payload.subject,
      text: payload.text,
      html: payload.html,
    });

    return { ok: true };
  }
}
