import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { EmailSenderService } from './email-sender.service';

@Module({
  controllers: [NotificationsController],
  providers: [EmailSenderService],
})
export class NotificationsModule {}