import { Controller, Get, Inject, Param, Patch, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { OAuth2Client } from 'google-auth-library'
import { calendar_v3, google } from 'googleapis';
import { ConfigService } from '@nestjs/config';
import { pick } from '@jamesdabbs/nest-platform';

@Controller()
export class AppController {
  private readonly calendarId: string
  private readonly gcal: calendar_v3.Calendar

  constructor(
    private readonly appService: AppService,
    private readonly config: ConfigService,
    @Inject('OAUTH_CLIENT') private readonly oauthClient: OAuth2Client
  ) {
    this.calendarId = config.get('CALENDAR_ID')
    this.gcal = google.calendar({version: 'v3', auth: this.oauthClient });
  }

  @Get('events')
  async meetings() {
    const response = await this.gcal.events.list({ calendarId: this.calendarId })
    const events = response.data.items || []

    return {
      events: events.map(event => pick(event, ['id', 'htmlLink', 'start', 'summary']))
    }
  }

  @Get('events/:id')
  async meeting(
    @Param('id') eventId: string
  ) {
    const response = await this.gcal.events.instances({
      calendarId: this.calendarId,
      eventId,
      maxResults: 1
    })
    const instances = response.data.items || []

    return {
      instances: instances.map(instance => pick(instance, ['id', 'htmlLink', 'start', 'summary', 'description']))
    };
  }

  @Patch('meetings/:meetingId/occurrences/:occurrenceId')
  updateOccurrence(
    @Param('meetingId') meetingId: string,
    @Param('occurrenceId') occurrenceId: string
  ) {

  }

  @Get('auth/google')
  startGoogleOauth() {
    return {
      statusCode: 302,
      url: this.oauthClient.generateAuthUrl({
        access_type: 'offline',
        scope: [
          'https://www.googleapis.com/auth/calendar'
        ]
      })
    }
  }

  @Get('auth/google/callback')
  async finishGoogleOauth(
    @Query('code') code: string
  ) {
    const { tokens } = await this.oauthClient.getToken(code)
    this.oauthClient.setCredentials(tokens)
    return tokens
  }
}
