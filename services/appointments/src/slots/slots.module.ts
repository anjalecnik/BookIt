import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentSlotEntity } from './appointment-slot.entity';
import { SlotsController } from './slots.controller';
import { SlotsService } from './slots.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forFeature([AppointmentSlotEntity]),
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
      {
        name: 'NOTIFICATIONS_BROKER',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL ?? 'amqp://rabbitmq:5672'],
          queue: 'notifications_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [SlotsController],
  providers: [SlotsService],
})
export class SlotsModule {}
