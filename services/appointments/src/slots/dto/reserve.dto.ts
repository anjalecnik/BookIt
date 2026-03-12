import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class ReserveSlotDto {
  @ApiProperty()
  @IsString()
  slotId!: string;

  @ApiProperty({ description: 'Internal BookIt user id (from users service)' })
  @IsString()
  @MinLength(3)
  userId!: string;
}
