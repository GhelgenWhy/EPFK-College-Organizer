import { Controller, Get } from '@nestjs/common';
import { Public } from '../auth/public.decorator.js';

@Controller()
export class HealthController {
  /** Public liveness probe used by the launcher and deployment checks. */
  @Get('health')
  @Public()
  check() {
    return { status: 'ok' };
  }
}
