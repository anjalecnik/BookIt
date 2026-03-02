import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { AppointmentSlotEntity, Provider } from './appointment-slot.entity';
import { SlotsService } from './slots.service';

describe('SlotsService', () => {
  let service: SlotsService;

  // mocks
  let dataSource: { transaction: jest.Mock };
  let slotsRepo: Partial<jest.Mocked<Repository<AppointmentSlotEntity>>>;

  beforeEach(async () => {
    dataSource = {
      transaction: jest.fn(),
    };

    slotsRepo = {
      find: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        SlotsService,
        { provide: DataSource, useValue: dataSource },
        {
          provide: getRepositoryToken(AppointmentSlotEntity),
          useValue: slotsRepo,
        },
      ],
    }).compile();

    service = moduleRef.get(SlotsService);
  });

  it('providers() should return the 3 predefined providers', () => {
    expect(service.providers().sort()).toEqual(
      [Provider.FITNES, Provider.ZDRAVNIK, Provider.FRIZER].sort(),
    );
  });

  it('listSlots() should call repo.find with optional provider filter', async () => {
    (slotsRepo.find as jest.Mock).mockResolvedValue([]);

    await service.listSlots();
    expect(slotsRepo.find).toHaveBeenCalledWith({
      where: {},
      order: { startsAt: 'ASC' },
    });

    await service.listSlots(Provider.FITNES);
    expect(slotsRepo.find).toHaveBeenCalledWith({
      where: { provider: Provider.FITNES },
      order: { startsAt: 'ASC' },
    });
  });

  it('reserve() should reserve a free slot', async () => {
    const slot: AppointmentSlotEntity = {
      id: 'slot-1',
      provider: Provider.FITNES,
      startsAt: new Date(),
      endsAt: new Date(),
      reservedByUserId: null,
      reservedAt: null,
      createdAt: new Date(),
    };

    const managerRepo = {
      findOne: jest.fn().mockResolvedValue(slot),
      save: jest.fn().mockImplementation(async (s) => s),
    };

    dataSource.transaction.mockImplementation(async (cb: any) => {
      const manager = {
        getRepository: () => managerRepo,
      };
      return cb(manager);
    });

    const result = await service.reserve('slot-1', 'user-1');

    expect(managerRepo.findOne).toHaveBeenCalledWith({
      where: { id: 'slot-1' },
      lock: { mode: 'pessimistic_write' },
    });

    expect(managerRepo.save).toHaveBeenCalled();
    expect(result.reservedByUserId).toBe('user-1');
    expect(result.reservedAt).toBeInstanceOf(Date);
  });

  it('reserve() should fail if slot does not exist', async () => {
    const managerRepo = {
      findOne: jest.fn().mockResolvedValue(null),
      save: jest.fn(),
    };

    dataSource.transaction.mockImplementation(async (cb: any) => {
      const manager = { getRepository: () => managerRepo };
      return cb(manager);
    });

    await expect(service.reserve('missing', 'user-1')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('reserve() should fail if slot already reserved', async () => {
    const slot: AppointmentSlotEntity = {
      id: 'slot-1',
      provider: Provider.FRIZER,
      startsAt: new Date(),
      endsAt: new Date(),
      reservedByUserId: 'someone-else',
      reservedAt: new Date(),
      createdAt: new Date(),
    };

    const managerRepo = {
      findOne: jest.fn().mockResolvedValue(slot),
      save: jest.fn(),
    };

    dataSource.transaction.mockImplementation(async (cb: any) => {
      const manager = { getRepository: () => managerRepo };
      return cb(manager);
    });

    await expect(service.reserve('slot-1', 'user-1')).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(managerRepo.save).not.toHaveBeenCalled();
  });

  it('cancel() should clear reservation if reserved by same user', async () => {
    const slot: AppointmentSlotEntity = {
      id: 'slot-1',
      provider: Provider.ZDRAVNIK,
      startsAt: new Date(),
      endsAt: new Date(),
      reservedByUserId: 'user-1',
      reservedAt: new Date(),
      createdAt: new Date(),
    };

    const managerRepo = {
      findOne: jest.fn().mockResolvedValue(slot),
      save: jest.fn().mockImplementation(async (s) => s),
    };

    dataSource.transaction.mockImplementation(async (cb: any) => {
      const manager = { getRepository: () => managerRepo };
      return cb(manager);
    });

    const result = await service.cancel('slot-1', 'user-1');

    expect(result.reservedByUserId).toBeNull();
    expect(result.reservedAt).toBeNull();
    expect(managerRepo.save).toHaveBeenCalled();
  });

  it('cancel() should fail if slot is not reserved', async () => {
    const slot: AppointmentSlotEntity = {
      id: 'slot-1',
      provider: Provider.ZDRAVNIK,
      startsAt: new Date(),
      endsAt: new Date(),
      reservedByUserId: null,
      reservedAt: null,
      createdAt: new Date(),
    };

    const managerRepo = {
      findOne: jest.fn().mockResolvedValue(slot),
      save: jest.fn(),
    };

    dataSource.transaction.mockImplementation(async (cb: any) => {
      const manager = { getRepository: () => managerRepo };
      return cb(manager);
    });

    await expect(service.cancel('slot-1', 'user-1')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('cancel() should fail if reserved by different user', async () => {
    const slot: AppointmentSlotEntity = {
      id: 'slot-1',
      provider: Provider.ZDRAVNIK,
      startsAt: new Date(),
      endsAt: new Date(),
      reservedByUserId: 'user-2',
      reservedAt: new Date(),
      createdAt: new Date(),
    };

    const managerRepo = {
      findOne: jest.fn().mockResolvedValue(slot),
      save: jest.fn(),
    };

    dataSource.transaction.mockImplementation(async (cb: any) => {
      const manager = { getRepository: () => managerRepo };
      return cb(manager);
    });

    await expect(service.cancel('slot-1', 'user-1')).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(managerRepo.save).not.toHaveBeenCalled();
  });
});
