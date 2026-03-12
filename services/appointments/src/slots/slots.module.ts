import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentSlotEntity } from './appointment-slot.entity';
import { SlotsController } from './slots.controller';
import { SlotsService } from './slots.service';
import { HttpModule } from '@nestjs/axios';
import { NotificationsClient } from '../notifications/notifications.client';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forFeature([AppointmentSlotEntity]),
    HttpModule,
    ClientsModule.register([
      {
        name: 'USERS_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'users',
          protoPath: join(__dirname, './grpc/users.proto'),
          url: 'users-service:50051',
        },
      },
    ]),
  ],
  controllers: [SlotsController],
  providers: [SlotsService, NotificationsClient],
})
export class SlotsModule {}
