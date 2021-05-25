import { DynamicModule, INestApplication, Module, Provider } from "@nestjs/common";
import { PRISMA_CLIENT } from "src/constants";
import { LoggingInterceptor } from "src/logging/logger.interceptor";
import { Logger } from "src/logging/logger.service"
import { PrismaService } from "src/prisma/prisma.service";

export interface Options {
  prisma: any // FIXME
}

const logSettings = [
  {
    emit: 'event',
    level: 'query'
  },
  {
    emit: 'stdout',
    level: 'info'
  },
  {
    emit: 'stdout',
    level: 'warn'
  },
  {
    emit: 'stdout',
    level: 'error'
  }
]

@Module({})
export class PlatformModule {
  static forRoot({
    prisma
  }: Options): DynamicModule {
    const providers: Provider<any>[] = [
      Logger,
      PrismaService
    ]

    if (prisma) {
      providers.push({
        provide: PRISMA_CLIENT,
        useFactory: () => {
          return new prisma({
            log: logSettings
          })
        }
      })
    }

    return {
      module: PlatformModule,
      providers,
      exports: [PRISMA_CLIENT]
    }
  }

  static configure(app: INestApplication) {
    app.useGlobalInterceptors(new LoggingInterceptor())
  }
}
