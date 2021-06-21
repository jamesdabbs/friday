import { INestApplication } from "@nestjs/common";
import { NestFactory } from "@nestjs/core"
import { Logger } from "./logging/logger.service"
import { LoggingInterceptor } from "src/logging/logger.interceptor"

export type AppCallback = (app: INestApplication) => Promise<void> | void

export type BootstrapArguments = {
  hot?: any
  port?: number
  beforeStart?: AppCallback
}

function noOp() {}

export async function bootstrap(
  appModule: any,
  {
    hot,
    port = 3000,
    beforeStart = noOp
  }: BootstrapArguments = {},
) {
  if (hot?.data?._platformBootstrapShutdown) {
    await hot.data._platformBootstrapShutdown
  }

  const app = await NestFactory.create(appModule);
  const logger = app.get(Logger)

  app.enableShutdownHooks()
  app.useGlobalInterceptors(new LoggingInterceptor(logger))

  if (beforeStart) {
    const result = beforeStart(app)
    if (result) { await result }
  }

  logger.log(`Listening on port=${port}`)
  await app.listen(port);

  if (hot) {
    hot.accept()
    hot.dispose(data => {
      data._platformBootstrapShutdown = app.close();
    })
  }
}
