import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EventPattern, Payload } from '@nestjs/microservices';
import { SendEmailDto } from './dto/send-email.dto';
import { EmailSenderService } from './email-sender.service';

type AppointmentReservedEvent = {
  slotId: string;
  userId: string;
  email: string;
  provider: string;
  startsAt: string;
  endsAt: string;
};

@ApiTags('notifications')
@Controller('notify')
export class NotificationsController {
  constructor(private email: EmailSenderService) {}

  @Post('email')
  send(@Body() dto: SendEmailDto) {
    return this.email.sendEmail(dto);
  }

  @EventPattern('appointment.reserved')
  async handleAppointmentReserved(@Payload() event: AppointmentReservedEvent) {
    await this.email.sendEmail({
      to: event.email,
      subject: 'BookIt – Rezervacija potrjena',
      text: `Rezervacija je potrjena (${event.provider}) ${event.startsAt}–${event.endsAt}.`,
    });
  }
}
