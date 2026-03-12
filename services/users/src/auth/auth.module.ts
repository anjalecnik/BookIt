import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../users/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleTokenVerifierService } from './google-token-verifier.service';
import { UsersGrpcController } from './users.grpc.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [AuthController, UsersGrpcController],
  providers: [AuthService, GoogleTokenVerifierService],
})
export class AuthModule {}
