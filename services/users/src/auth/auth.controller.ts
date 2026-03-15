import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { GoogleAuthRequestDto, GoogleAuthResponseDto } from './dto/google-auth.dto';

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('health')
  health() {
    return {
      status: 'ok',
      service: 'auth',
      timestamp: new Date().toISOString(),
    };
  }

  @Post('auth/google')
  @ApiOkResponse({ type: GoogleAuthResponseDto })
  async google(@Body() body: GoogleAuthRequestDto): Promise<GoogleAuthResponseDto> {
    return this.authService.authWithGoogle(body.idToken);
  }
}