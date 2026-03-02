import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class GoogleAuthRequestDto {
  @ApiProperty({ description: 'Google OpenID Connect ID token (id_token)' })
  @IsString()
  @MinLength(20)
  idToken!: string;
}

export class GoogleAuthResponseDto {
  @ApiProperty()
  userId!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  name!: string;
}