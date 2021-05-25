import { Inject, Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Logger } from 'src/logging/logger.service';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name)

  constructor(
    @Inject('PrismaClient') private readonly client: any
  ) {
    client.$on('query', event => {
      this.logger.log({ event: 'query', body: event })
    })

    client.$use(async (params, next) => {
      this.logger.log({ event: 'middleware.before', params })

      const result = await next(params)

      this.logger.log({ event: 'middleware.after', result })
      return result
    })
  }

  async onModuleInit() {
    this.logger.debug('prisma client connecting')
    await this.client.$connect();
  }

  async onModuleDestroy() {
    this.logger.debug('prisma client disconnecting')
    await this.client.$disconnect();
  }
}
