import { Controller, Get } from '@nestjs/common';
import { Public } from '../auth/public.decorator.js';

@Controller()
export class HealthController {
  @Get('health')
  @Public()
  check() {
    return { status: 'ok' };
  }
}
