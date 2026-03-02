import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SendEmailDto } from './dto/send-email.dto';
import { EmailSenderService } from './email-sender.service';

@ApiTags('notifications')
@Controller('notify')
export class NotificationsController {
  constructor(private email: EmailSenderService) {}

  @Post('email')
  send(@Body() dto: SendEmailDto) {
    return this.email.sendEmail(dto);
  }
}