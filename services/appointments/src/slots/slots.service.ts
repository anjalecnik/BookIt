import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AppointmentSlotEntity, Provider } from './appointment-slot.entity';
import { NotificationsClient } from '../notifications/notifications.client';

@Injectable()
export class SlotsService {
  private readonly logger = new Logger(SlotsService.name);

  constructor(
    private dataSource: DataSource,
    @InjectRepository(AppointmentSlotEntity)
    private slotsRepo: Repository<AppointmentSlotEntity>,
    private notifications: NotificationsClient,
  ) {}

  providers(): string[] {
    return Object.values(Provider);
  }

  listSlots(provider?: Provider) {
    const where = provider ? { provider } : {};
    return this.slotsRepo.find({ where, order: { startsAt: 'ASC' } });
  }

  async reserve(slotId: string, userId: string, email: string) {
    const savedSlot = await this.dataSource.transaction(async (manager) => {
      const repo = manager.getRepository(AppointmentSlotEntity);

      const slot = await repo.findOne({
        where: { id: slotId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!slot) {
        this.logger.warn(`Slot not found slotId=${slotId}`);
        throw new NotFoundException('Slot not found');
      }

      if (slot.reservedByUserId) {
        this.logger.warn(`Slot already reserved slotId=${slotId}`);
        throw new BadRequestException('Slot already reserved');
      }

      slot.reservedByUserId = userId;
      slot.reservedAt = new Date();

      const saved = await repo.save(slot);
      return saved;
    });

    this.logger.log(`Sending reservation email to=${email}`);

    await this.notifications.sendEmail({
      to: email,
      subject: 'BookIt – Rezervacija potrjena',
      text: `Rezervacija je potrjena (${savedSlot.provider}) ${savedSlot.startsAt.toISOString()}–${savedSlot.endsAt.toISOString()}.`,
    });

    return savedSlot;
  }

  async cancel(slotId: string, userId: string) {
    return this.dataSource.transaction(async (manager) => {
      const repo = manager.getRepository(AppointmentSlotEntity);

      const slot = await repo.findOne({
        where: { id: slotId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!slot) {
        this.logger.warn(`Slot not found slotId=${slotId}`);
        throw new NotFoundException('Slot not found');
      }

      if (!slot.reservedByUserId) {
        this.logger.warn(`Cancel failed - slot not reserved slotId=${slotId}`);
        throw new BadRequestException('Slot is not reserved');
      }

      if (slot.reservedByUserId !== userId) {
        throw new BadRequestException('Not your reservation');
      }

      slot.reservedByUserId = null;
      slot.reservedAt = null;

      const saved = await repo.save(slot);
      return saved;
    });
  }

  async seedPredefinedSlots() {
    this.logger.log('Seeding predefined slots');

    const providers = Object.values(Provider);

    const now = new Date();
    const base = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        8,
        0,
        0,
      ),
    );

    const slots: Partial<AppointmentSlotEntity>[] = [];

    for (let day = 0; day < 3; day++) {
      for (const p of providers) {
        for (let i = 0; i < 6; i++) {
          const startsAt = new Date(base);
          startsAt.setUTCDate(base.getUTCDate() + day);
          startsAt.setUTCHours(8 + i, 0, 0, 0);

          const endsAt = new Date(startsAt);
          endsAt.setUTCHours(endsAt.getUTCHours() + 1);

          slots.push({ provider: p, startsAt, endsAt });
        }
      }
    }

    await this.slotsRepo
      .createQueryBuilder()
      .insert()
      .into(AppointmentSlotEntity)
      .values(slots)
      .orIgnore()
      .execute();

    this.logger.log(`Seed completed slotsPrepared=${slots.length}`);

    return { insertedOrExisting: slots.length };
  }
}
