import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentSlotEntity } from './appointment-slot.entity';
import { SlotsController } from './slots.controller';
import { SlotsService } from './slots.service';

@Module({
  imports: [TypeOrmModule.forFeature([AppointmentSlotEntity])],
  controllers: [SlotsController],
  providers: [SlotsService],
})
export class SlotsModule {}
