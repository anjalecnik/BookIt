import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { EmailSenderService } from './email-sender.service';

jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => ({
    sendMail: jest.fn().mockResolvedValue(true),
  })),
}));

describe('EmailSenderService', () => {
  it('sends email via transporter', async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        EmailSenderService,
        {
          provide: ConfigService,
          useValue: {
            get: (k: string) => {
              const map: Record<string, string> = {
                SMTP_HOST: 'smtp.test',
                SMTP_PORT: '587',
                SMTP_USER: 'user',
                SMTP_PASS: 'pass',
                SMTP_FROM: 'bookit@test',
              };
              return map[k];
            },
          },
        },
      ],
    }).compile();

    const svc = moduleRef.get(EmailSenderService);
    const res = await svc.sendEmail({
      to: 'a@b.com',
      subject: 'Hi',
      text: 'Hello',
    });

    expect(res).toEqual({ ok: true });
  });
});