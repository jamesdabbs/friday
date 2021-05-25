import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MeetingsService } from './meetings/meetings.service';
import { PlatformModule } from '@jamesdabbs/nest-platform'
import { PrismaClient } from '@prisma/client'

@Module({
  imports: [
    PlatformModule.forRoot({
      prisma: PrismaClient
    }),
    ClientsModule.register([
      {
        name: 'SLACK_SERVICE',
        transport: Transport.KAFKA ,
        options: {
          client: {
            brokers: ['kafka-cluster-kafka-bootstrap.kafka.svc.cluster.local:9092'],
          }
        }
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService, MeetingsService],
})
export class AppModule {}
