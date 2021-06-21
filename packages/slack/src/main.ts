import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { Logger, LoggingInterceptor } from '@jamesdabbs/nest-platform';

declare const module: any

async function bootstrap() {
  if (module.hot?.data?._platformBootstrapShutdown) {
    await module.hot.data._platformBootstrapShutdown
  }

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['kafka-cluster-kafka-bootstrap.kafka.svc.cluster.local:9092'],
      },
      consumer: {
        groupId: 'slack'
      }
    }
  });
  const logger = app.get(Logger)

  app.enableShutdownHooks()
  app.useGlobalInterceptors(new LoggingInterceptor(logger))

  app.listen(() => {
    logger.log('🤖 Slack is listening')
  })

  if (module.hot) {
    module.hot.accept()
    module.hot.dispose(data => {
      data._platformBootstrapShutdown = app.close();
    })
  }
}
bootstrap();
