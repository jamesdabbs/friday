import { DynamicModule, Module, Provider } from "@nestjs/common";
import { RouterModule } from "nest-router";
import { PRISMA_CLIENT } from "src/constants";
import { HealthModule } from "src/health/health.module";
import { Logger } from "src/logging/logger.service"
import { PrismaService } from "src/prisma/prisma.service";

export interface HealthCheckOptions {
  path: string
}

export interface Options {
  prisma?: any // TODO: is there a usable type for "an unknown generated PrismaClient"?
  health?: HealthCheckOptions
}

// See https://www.prisma.io/docs/concepts/components/prisma-client/working-with-prismaclient/logging
const logSettings = [
  // Enable $on('query', ...) handling
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
    prisma,
    health
  }: Options = {}): DynamicModule {
    let imports = []
    let providers: Provider<any>[] = [Logger]
    let exports = []

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

    if (health) {
      const { path } = health

      imports = imports.concat(
        RouterModule.forRoutes([
          {
            path,
            module: HealthModule
          }
        ]),
        HealthModule
      )
    }

    return {
      module: PlatformModule,
      providers,
      imports,
      exports
    }
  }
}
