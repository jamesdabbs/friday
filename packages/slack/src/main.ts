import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
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

  app.listen(() => {
    console.log('🤖 Slack is listening')
  })
}
bootstrap();
