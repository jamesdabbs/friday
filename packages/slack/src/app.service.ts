import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { App as SlackApp } from '@slack/bolt';
import { DateTime } from 'luxon';

const unknownPerson: string = '👤 Unknown';
@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  private token: string;

  constructor(
    @Inject('SLACK') private readonly slack: SlackApp,
    private readonly config: ConfigService,
  ) {
    this.token = config.get('SLACK_BOT_USER_TOKEN');
  }

  async sendReminder({
    channel,
    name,
    at,
    emcee = unknownPerson,
    scribe = unknownPerson,
    agenda
  }: {
    channel: string;
    name: string;
    at: DateTime;
    emcee?: string;
    scribe?: string;
    agenda?: string
  }): Promise<void> {
    const pacificTime = at
      .setZone('America/Los_Angeles')
      .setLocale('en')
      .toLocaleString(DateTime.TIME_WITH_SHORT_OFFSET);
    const relativeTime = at.toRelative()

    let text = `The next *${name}* meeting is coming up`

    const fields = [
      {
        title: '🕑 Date',
        value: `${pacificTime} (${relativeTime})`,
      },
      {
        title: '🎤 Emcee',
        value: emcee,
        short: true,
      },
      {
        title: '🖋 Scribe',
        value: scribe,
        short: true
      }
    ]

    if (agenda) {
      text += `. Please take a moment to review the agenda.`

      fields.push({
        title: '📓 Agenda',
        value: agenda
      })
    }

    const request = {
      channel,
      icon_emoji: 'robot_face',
      text,
      mrkdwn: true,
      link_names: true,
      attachments: [ { fields } ]
    };

    try {
      const response = await this.slack.client.chat.postMessage({
        token: this.token,
        ...request,
      });
      this.logger.debug({ event: 'reminderSent', request, response });
    } catch (error) {
      this.logger.error({ event: 'reminderSent', request, error });
    }
  }
}
