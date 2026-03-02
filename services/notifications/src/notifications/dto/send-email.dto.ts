import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class SendEmailDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  to!: string;

  @ApiProperty({ example: 'Rezervacija potrjena' })
  @IsString()
  @MinLength(1)
  subject!: string;

  @ApiProperty({ example: 'Vaša rezervacija je uspešno potrjena.' })
  @IsString()
  @MinLength(1)
  text!: string;

  @ApiProperty({ required: false, example: '<b>Pozdravljeni</b>' })
  @IsOptional()
  @IsString()
  html?: string;
}