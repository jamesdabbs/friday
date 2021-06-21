import { Inject, Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PRISMA_CLIENT } from 'src/constants';
import { Logger } from 'src/logging/logger.service';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name)

  constructor(@Inject(PRISMA_CLIENT) private readonly client: any) {}

  async onModuleInit() {
    this.logger.debug('prisma client configuring')

    // In prod-like environments, this could e.g. report a histogram of query times
    this.client.$on('query', event => {
      this.logger.debug({ event: 'query', body: event })
    })

    // EXAMPLE: fully custom prisma middleware
    // See https://www.prisma.io/docs/concepts/components/prisma-client/middleware
    //
    // this.client.$use(async (params, next) => {
    //   this.logger.log({ event: 'middleware.before', params })
    //
    //   const result = await next(params)
    //
    //   this.logger.log({ event: 'middleware.after', result })
    //   return result
    // })
  }

  async onModuleDestroy() {
    this.logger.debug('prisma client disconnecting')
    await this.client.$disconnect();
  }
}
