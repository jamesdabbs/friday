import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { google } from 'googleapis';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PlatformModule, fetchEnv } from '@jamesdabbs/nest-platform'

@Module({
  imports: [
    ConfigModule.forRoot(),
    PlatformModule.forRoot()
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'OAUTH_CLIENT',
      useFactory: (config: ConfigService) => {
        const client = new google.auth.OAuth2(
          fetchEnv(config, 'GOOGLE_CLIENT_ID'),
          fetchEnv(config, 'GOOGLE_CLIENT_SECRET'),
          fetchEnv(config, 'GOOGLE_CLIENT_REDIRECT_URI'),
        )

        const refreshToken = config.get('GOOGLE_PERSONAL_REFRESH_TOKEN')
        if (refreshToken) {
          client.setCredentials({
            refresh_token: refreshToken
          })
        }

        return client
      },
      inject: [ConfigService]
    },
  ],
})
export class AppModule {}
