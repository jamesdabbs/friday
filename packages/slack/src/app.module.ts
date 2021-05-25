import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { App } from '@slack/bolt'
import { fetchEnv } from '@jamesdabbs-/nest-platform'

function slackFactory(
  config: ConfigService
) {
  const token = fetchEnv(config, 'SLACK_BOT_USER_TOKEN')
  const signingSecret = fetchEnv(config, 'SLACK_SIGNING_SECRET')

  return new App({
    token,
    signingSecret
  })
}

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [
    {
      provide: 'SLACK',
      useFactory: slackFactory,
      inject: [ConfigService]
    },
    AppService
  ],
})
export class AppModule {}
