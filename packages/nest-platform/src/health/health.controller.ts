import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthController {
  // TODO
  // - allow consumers of this library to supply their own health checks
  // - conventional support for Prisma (e.g. liveness => db reachable)
  @Get('/')
  health() {
    return 'OK'
  }
}
