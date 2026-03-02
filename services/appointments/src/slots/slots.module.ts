import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentSlotEntity } from './appointment-slot.entity';
import { SlotsController } from './slots.controller';
import { SlotsService } from './slots.service';
import { HttpModule } from '@nestjs/axios';
import { NotificationsClient } from '../notifications/notifications.client';

@Module({
  imports: [TypeOrmModule.forFeature([AppointmentSlotEntity]), HttpModule],
  controllers: [SlotsController],
  providers: [SlotsService, NotificationsClient],
})
export class SlotsModule {}
