import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';

export type GoogleIdentity = {
  sub: string;
  email: string;
  name: string;
  pictureUrl?: string;
};

@Injectable()
export class GoogleTokenVerifierService {
  private client = new OAuth2Client();

  async verifyIdToken(idToken: string, audience: string): Promise<GoogleIdentity> {
    try {
      const ticket = await this.client.verifyIdToken({ idToken, audience });
      const payload = ticket.getPayload();

      if (!payload?.sub || !payload.email || !payload.name) {
        throw new UnauthorizedException('Invalid Google token payload');
      }

      return {
        sub: payload.sub,
        email: payload.email,
        name: payload.name,
        pictureUrl: payload.picture,
      };
    } catch {
      throw new UnauthorizedException('Invalid Google ID token');
    }
  }
}