import { DynamicModule, Module, Provider } from "@nestjs/common";
import { PRISMA_CLIENT } from "src/constants";
import { Logger } from "src/logging/logger.service"
import { PrismaService } from "src/prisma/prisma.service";

export interface Options {
  prisma?: any // FIXME
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
  }: Options = {}): DynamicModule {
    let providers: Provider<any>[] = [
      Logger
    ]

    const exports = []

    if (prisma) {
      providers = providers.concat(
        {
          provide: PRISMA_CLIENT,
          useFactory: () => {
            return new prisma({
              log: logSettings
            })
          }
        },
        PrismaService
      )

      exports.push(PRISMA_CLIENT)
    }

    return {
      module: PlatformModule,
      providers,
      exports
    }
  }
}
