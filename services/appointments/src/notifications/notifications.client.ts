import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

type SendEmailPayload = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

@Injectable()
export class NotificationsClient {
  private baseUrl: string;

  constructor(
    private http: HttpService,
    cfg: ConfigService,
  ) {
    this.baseUrl =
      cfg.get<string>('NOTIFICATIONS_URL') ?? 'http://localhost:3003';
  }

  async sendEmail(payload: SendEmailPayload) {
    const url = `${this.baseUrl}/notify/email`;
    await firstValueFrom(this.http.post(url, payload));
  }
}
