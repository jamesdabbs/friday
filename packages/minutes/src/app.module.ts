import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlatformModule } from '@jamesdabbs/nest-platform'

@Module({
  imports: [
    ConfigModule.forRoot(),
    PlatformModule.forRoot({
      health: {
        path: '/health'
      }
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
