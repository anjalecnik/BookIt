import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { UserEntity } from '../users/user.entity';
import { GoogleTokenVerifierService } from './google-token-verifier.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(UserEntity) private usersRepo: Repository<UserEntity>,
    private googleVerifier: GoogleTokenVerifierService,
    private cfg: ConfigService,
  ) {}

  async authWithGoogle(idToken: string) {
    const clientId = this.cfg.get<string>('GOOGLE_CLIENT_ID');
    if (!clientId) {
      this.logger.error('Missing GOOGLE_CLIENT_ID');
      throw new Error('Missing GOOGLE_CLIENT_ID');
    }

    const ident = await this.googleVerifier.verifyIdToken(idToken, clientId);

    const existing = await this.usersRepo.findOne({
      where: { googleSub: ident.sub },
    });

    if (existing) {
      return {
        userId: existing.id,
        email: existing.email,
        name: existing.name,
      };
    }

    const created = this.usersRepo.create({
      googleSub: ident.sub,
      email: ident.email,
      name: ident.name,
      pictureUrl: ident.pictureUrl ?? null,
    });

    const saved = await this.usersRepo.save(created);

    return {
      userId: saved.id,
      email: saved.email,
      name: saved.name,
    };
  }
}
