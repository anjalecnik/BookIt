import {
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Param,
  Body,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SlotsService } from './slots.service';
import { Provider } from './appointment-slot.entity';
import { ReserveSlotDto } from './dto/reserve.dto';

@ApiTags('appointments')
@Controller()
export class SlotsController {
  constructor(private slots: SlotsService) {}

  @Get('health')
  health() {
    return {
      status: 'ok',
      service: 'appointments',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('providers')
  providers() {
    return this.slots.providers();
  }

  @Get('slots')
  list(@Query('provider') provider?: Provider) {
    return this.slots.listSlots(provider);
  }

  @Post('slots/seed')
  seed() {
    return this.slots.seedPredefinedSlots();
  }

  @Post('reservations')
  reserve(@Body() dto: ReserveSlotDto) {
    return this.slots.reserve(dto.slotId, dto.userId);
  }

  @Delete('reservations/:slotId')
  cancel(@Param('slotId') slotId: string, @Query('userId') userId: string) {
    return this.slots.cancel(slotId, userId);
  }
}
