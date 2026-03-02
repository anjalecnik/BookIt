import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import { GoogleTokenVerifierService } from './google-token-verifier.service';
import { UserEntity } from '../users/user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let usersRepo: jest.Mocked<Repository<UserEntity>>;
  let googleVerifier: jest.Mocked<GoogleTokenVerifierService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: GoogleTokenVerifierService,
          useValue: {
            verifyIdToken: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('google-client-id'),
          },
        },
      ],
    }).compile();

    service = module.get(AuthService);
    usersRepo = module.get(getRepositoryToken(UserEntity));
    googleVerifier = module.get(GoogleTokenVerifierService);
  });

  it('should return existing user if Google user already exists', async () => {
    googleVerifier.verifyIdToken.mockResolvedValue({
      sub: 'google-sub',
      email: 'test@example.com',
      name: 'Test User',
    });

    usersRepo.findOne.mockResolvedValue({
      id: 'user-id',
      googleSub: 'google-sub',
      email: 'test@example.com',
      name: 'Test User',
    } as UserEntity);

    const result = await service.authWithGoogle('token');

    expect(result).toEqual({
      userId: 'user-id',
      email: 'test@example.com',
      name: 'Test User'
    });
  });

  it('should create new user if Google user does not exist', async () => {
    googleVerifier.verifyIdToken.mockResolvedValue({
      sub: 'google-sub',
      email: 'new@example.com',
      name: 'New User',
    });

    usersRepo.findOne.mockResolvedValue(null);

    usersRepo.create.mockReturnValue({
      googleSub: 'google-sub',
      email: 'new@example.com',
      name: 'New User',
    } as UserEntity);

    usersRepo.save.mockResolvedValue({
      id: 'new-id',
      googleSub: 'google-sub',
      email: 'new@example.com',
      name: 'New User',
    } as UserEntity);

    const result = await service.authWithGoogle('token');

    expect(usersRepo.create).toHaveBeenCalled();
    expect(usersRepo.save).toHaveBeenCalled();

    expect(result).toEqual({
      userId: 'new-id',
      email: 'new@example.com',
      name: 'New User'
    });
  });
});